import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { uploadFolderToIPFS } from '@/lib/pinata'
import { createMetadata } from '@/lib/metadata'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const maxDuration = 60 // Set max duration to 60 seconds

function sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
}

async function validateFile(file: File, type: 'audio' | 'image'): Promise<boolean> {
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3']
    const allowedImageTypes = ['image/jpeg', 'image/png']
    const maxSizes = {
        audio: 10 * 1024 * 1024, // 10MB
        image: 2 * 1024 * 1024   // 2MB
    }

    if (type === 'audio' && !allowedAudioTypes.includes(file.type)) {
        throw new Error('Invalid audio file type. Only MP3 files are allowed.')
    }

    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
        throw new Error('Invalid image file type. Only JPEG and PNG files are allowed.')
    }

    if (file.size > maxSizes[type]) {
        throw new Error(`File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit.`)
    }

    return true
}

export async function POST(req: NextRequest) {
    const tmpDir = path.join(process.cwd(), 'tmp')
    const folderName = nanoid()
    const folderPath = path.join(tmpDir, folderName)

    try {
        const formData = await req.formData()

        // Validate required fields
        const title = formData.get('title')?.toString()
        const artistName = formData.get('artistName')?.toString()
        const songFile = formData.get('songFile') as File | null
        const coverImage = formData.get('coverImage') as File | null

        if (!title || !artistName || !songFile || !coverImage) {
            throw new Error('Missing required fields')
        }

        // Create temp directory if it doesn't exist
        await fs.mkdir(tmpDir, { recursive: true })
        await fs.mkdir(folderPath, { recursive: true })

        // Validate and save files
        await validateFile(songFile, 'audio')
        await validateFile(coverImage, 'image')

        const saveFile = async (file: File, filename: string) => {
            const buffer = Buffer.from(await file.arrayBuffer())
            const filePath = path.join(folderPath, filename)
            await fs.writeFile(filePath, buffer)
            return filePath
        }

        // Save files
        await Promise.all([
            saveFile(songFile, 'song.mp3'),
            saveFile(coverImage, 'cover.jpg')
        ])

        // Create and save metadata
        const metadata = createMetadata({
            title,
            artistName,
            artistAddress: '',
            description: formData.get('description')?.toString() || '',
            anime: formData.get('anime')?.toString() || '',
            genres: formData.get('genres')?.toString()?.split(',').map(g => g.trim()) || [],
            tags: formData.get('tags')?.toString()?.split(',').map(t => t.trim()) || [],
            coverImageUrl: 'cover.jpg',
            skinImageUrl: '',
            colorArray: [],
        })

        await fs.writeFile(
            path.join(folderPath, 'metadata.json'),
            JSON.stringify(metadata, null, 2),
            'utf-8'
        )

        // Upload to IPFS
        const ipfsHash = await uploadFolderToIPFS(folderPath)

        return NextResponse.json({ success: true, ipfsHash })
    } catch (err) {
        // Cleanup temp folder in case of error
        try {
            await fs.rm(folderPath, { recursive: true, force: true })
        } catch (cleanupErr) {
            console.error('Cleanup error:', cleanupErr)
        }

        console.error('Upload error:', err)
        return NextResponse.json(
            { 
                error: err instanceof Error ? err.message : 'Upload failed',
                details: process.env.NODE_ENV === 'development' ? err : undefined
            },
            { status: 400 }
        )
    }
}
