'use client'

import { useState } from 'react'
import { createMetadata } from '@/lib/metadata'
import { uploadFolderToIPFS } from '@/lib/pinata'
import { ethers } from 'ethers'

export default function UploadPage() {
    const [title, setTitle] = useState('')
    const [artistName, setArtistName] = useState('')
    const [description, setDescription] = useState('')
    const [anime, setAnime] = useState('')
    const [genres, setGenres] = useState('')
    const [tags, setTags] = useState('')
    const [songFile, setSongFile] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    async function handleUpload() {
        if (!songFile) {
            alert('Please upload a song file.')
            return
        }

        const ethereum = window.ethereum
        if (!ethereum) {
            alert('MetaMask is not installed.')
            return
        }

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('artistName', artistName)
            formData.append('description', description)
            formData.append('anime', anime)
            formData.append('genres', genres)
            formData.append('tags', tags)

            // songFile and coverImage must be actual File objects from input elements
            if (coverImage instanceof File) {
                formData.append('coverImage', coverImage, coverImage.name)
            }

            if (songFile instanceof File) {
                formData.append('songFile', songFile, songFile.name)
            }

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            console.log('IPFS Hash:', data.ipfsHash)
            alert('Uploaded to IPFS: ' + data.ipfsHash)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Upload failed:', err.message)
            } else {
                console.error('Upload failed:', err)
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <main className="max-w-xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold">Upload Music Track</h1>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border p-2 w-full"
            />

            <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Artist Name"
                className="border p-2 w-full"
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border p-2 w-full"
            />

            <input
                value={anime}
                onChange={(e) => setAnime(e.target.value)}
                placeholder="Anime"
                className="border p-2 w-full"
            />

            <input
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Genres (comma separated)"
                className="border p-2 w-full"
            />

            <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="border p-2 w-full"
            />

            <div>
                <label className="block font-medium mt-4 mb-1">
                    Cover Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="border p-2 w-full"
                />
            </div>

            <div>
                <label className="block font-medium mt-4 mb-1">Song File</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                    className="border p-2 w-full"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload to IPFS'}
            </button>
        </main>
    )
}
