import { PinataSDK } from 'pinata-web3'
import fs from 'fs'
import path from 'path'
import { Blob } from 'fetch-blob'
import { NextResponse } from 'next/server'

// Initialize Pinata SDK with proper error handling
const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY
})

if (!process.env.PINATA_JWT) {
    console.error('PINATA_JWT environment variable is not set')
}

// Helper to create File object from local path
async function fileFromPath(filePath: string): Promise<File> {
    try {
        const buffer = await fs.promises.readFile(filePath)
        const blob = new Blob([buffer])
        const name = path.basename(filePath)
        const type = getMimeType(name)
        return new File([blob], name, { type })
    } catch (error) {
        console.error(`Error creating file from path ${filePath}:`, error)
        throw error
    }
}

// Upload entire folder to IPFS
export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
    try {
        const files: File[] = []

        // Read all files in the folder
        const fileNames = await fs.promises.readdir(folderPath)
        for (const fileName of fileNames) {
            const filePath = path.join(folderPath, fileName)
            const stat = await fs.promises.stat(filePath)

            if (stat.isFile()) {
                const file = await fileFromPath(filePath)
                files.push(file)
            }
        }

        if (files.length === 0) {
            throw new Error('No files found in folder')
        }

        // Upload folder to IPFS
        const upload = await pinata.upload.fileArray(files)

        if (!upload?.IpfsHash) {
            throw new Error('Failed to get IPFS hash from upload')
        }

        // Clean up temporary files
        await fs.promises.rm(folderPath, { recursive: true, force: true })

        return upload.IpfsHash
    } catch (error) {
        console.error('Error uploading to IPFS:', error)
        throw error
    }
}

// Get MIME types
function getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase()
    switch (ext) {
        case '.mp3':
            return 'audio/mpeg'
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg'
        case '.png':
            return 'image/png'
        case '.json':
            return 'application/json'
        default:
            return 'application/octet-stream'
    }
}

// API route handler
export async function POST(req: Request) {
    try {
        const { folderPath } = await req.json()
        
        if (!folderPath) {
            return NextResponse.json(
                { error: 'Folder path is required' },
                { status: 400 }
            )
        }

        const ipfsHash = await uploadFolderToIPFS(folderPath)
        return NextResponse.json({ ipfsHash })
    } catch (error) {
        console.error('Upload failed:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}
