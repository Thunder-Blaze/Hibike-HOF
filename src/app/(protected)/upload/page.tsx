'use client'

import { useState } from 'react'
import { createMetadata } from '@/lib/metadata'
import { uploadFolderToIPFS } from '@/lib/pinata'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, Music, Image as ImageIcon } from 'lucide-react'

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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCoverImage(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

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
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Upload Your Music</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Track Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter track title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="artist">Artist Name</Label>
                                <Input
                                    id="artist"
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    placeholder="Enter artist name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your track"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="anime">Anime</Label>
                                <Input
                                    id="anime"
                                    value={anime}
                                    onChange={(e) => setAnime(e.target.value)}
                                    placeholder="Related anime"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="genres">Genres</Label>
                                <Input
                                    id="genres"
                                    value={genres}
                                    onChange={(e) => setGenres(e.target.value)}
                                    placeholder="e.g. Rock, Pop, Jazz"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g. upbeat, instrumental, vocal"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label className="block">Cover Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label 
                                    htmlFor="cover-upload" 
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                    )}
                                    <span className="text-sm text-muted-foreground">Click to upload cover image</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="block">Song File</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="song-upload"
                                />
                                <label 
                                    htmlFor="song-upload" 
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Music className="w-12 h-12 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {songFile ? songFile.name : "Click to upload song file"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload to IPFS'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
