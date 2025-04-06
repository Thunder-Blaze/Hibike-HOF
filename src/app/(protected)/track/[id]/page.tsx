'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FastAverageColor } from 'fast-average-color'
import { Play, Pause } from 'lucide-react'

interface Props {
    params: { id: string }
}

interface Track {
    id: string
    title: string
    artistName: string
    audioUrl: string
}

export default function TrackPage() {
    const params = useParams()
    const [track, setTrack] = useState<Track | null>(null)
    const [dominantColor, setDominantColor] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const animationFrameRef = useRef<number>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)

    useEffect(() => {
        async function fetchTrack() {
            try {
                const res = await fetch(
                    `https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/metadata.json`
                )
                if (!res.ok) {
                    throw new Error('Failed to fetch track')
                }
                const data = await res.json()
                setTrack(data)

                const fac = new FastAverageColor()
                const coverUrl = `https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/cover.jpg`
                
                const img = new Image()
                img.crossOrigin = "Anonymous"
                img.src = coverUrl
                
                img.onload = async () => {
                    const color = await fac.getColorAsync(img)
                    setDominantColor(color.hex)
                    document.documentElement.style.setProperty('--primary', color.hex)
                }
                
                img.onerror = () => {
                    console.error('Error loading cover image')
                    setDominantColor('#4a5568')
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchTrack()
    }, [params.id])

    useEffect(() => {
        if (!track) return

        // Initialize audio context and analyser
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256

        // Create audio element and connect to analyser
        audioRef.current = new Audio(
            `https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/song.mp3`
        )
        const source = audioContextRef.current.createMediaElementSource(audioRef.current)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)

        // Set up canvas
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        function animate() {
            if (!analyserRef.current || !ctx || !canvas) return
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
            analyserRef.current.getByteFrequencyData(dataArray)

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            
            // Draw blob visualizer
            ctx.save()
            ctx.translate(canvas.width / 2, canvas.height / 2)
            
            const radius = 140 // Base radius matching album art size
            ctx.beginPath()
            ctx.moveTo(radius, 0)
            
            for (let i = 0; i < dataArray.length; i++) {
                const angle = (i / dataArray.length) * Math.PI * 2
                const amplitude = (dataArray[i] / 255) * 50 // Scale factor for visualization
                const x = (radius + amplitude) * Math.cos(angle)
                const y = (radius + amplitude) * Math.sin(angle)
                
                if (i === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }
            
            ctx.closePath()
            ctx.fillStyle = `${dominantColor}33`
            ctx.fill()
            ctx.restore()

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ''
            }
        }
    }, [track, dominantColor])

    const togglePlayPause = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            // Resume AudioContext if it was suspended
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume()
            }
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
            {track ? (
                <Card className="max-w-3xl mx-auto backdrop-blur-lg bg-background/80">
                    <CardContent className="p-8 space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative w-64 h-64 flex-shrink-0">
                                <canvas 
                                    ref={canvasRef}
                                    width={400}
                                    height={400}
                                    className="absolute inset-0 w-full h-full"
                                />
                                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
                                    <img 
                                        src={`https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/cover.jpg`}
                                        alt={track.title}
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-bold tracking-tight mb-3">{track.title}</h1>
                                <p className="text-2xl text-muted-foreground">{track.artistName}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <button
                                    onClick={togglePlayPause}
                                    className="p-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-8 h-8 text-primary-foreground" />
                                    ) : (
                                        <Play className="w-8 h-8 text-primary-foreground" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                </div>
            )}
        </div>
    )
}
