'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Image, Music } from "lucide-react"

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

            console.log('IPFS Hash:', data.ipfsHash.IpfsHash)
            alert('Uploaded to IPFS: ' + data.ipfsHash.IpfsHash + "\nCheck the Console")
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
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Upload Music Track</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Track Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter track title"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="artist">Artist Name</Label>
                                    <Input
                                        id="artist"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                        placeholder="Enter artist name"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter track description"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="anime">Anime</Label>
                                    <Input
                                        id="anime"
                                        value={anime}
                                        onChange={(e) => setAnime(e.target.value)}
                                        placeholder="Enter anime name"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="genres">Genres</Label>
                                    <Input
                                        id="genres"
                                        value={genres}
                                        onChange={(e) => setGenres(e.target.value)}
                                        placeholder="Enter genres (comma separated)"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="Enter tags (comma separated)"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="cover">Cover Image</Label>
                                    <div className="flex items-center gap-4">
                                        <Image className="h-5 w-5" />
                                        <Input
                                            id="cover"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="song">Song File</Label>
                                    <div className="flex items-center gap-4">
                                        <Music className="h-5 w-5" />
                                        <Input
                                            id="song"
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button 
                                className="w-full"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {uploading ? 'Uploading...' : 'Upload to IPFS'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
