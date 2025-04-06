'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

interface Track {
  id: string
  title: string
  artistName: string
  description: string
}

export default function PlayerPage() {
  const params = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState<Track | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)
        setIsConnected(true)
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

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

        // Initialize audio
        audioRef.current = new Audio(
          `https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/song.mp3`
        )
        
        audioRef.current.addEventListener('loadedmetadata', () => {
          setDuration(audioRef.current?.duration || 0)
        })

        audioRef.current.addEventListener('timeupdate', () => {
          setCurrentTime(audioRef.current?.currentTime || 0)
        })

        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false)
          if(audioRef.current) audioRef.current.currentTime = 0
        })

      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchTrack()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [params.id])

  const togglePlay = () => {
    if (!audioRef.current || !isConnected) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const time = Number(e.target.value)
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!track) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-xl">
          <Image
            src={`https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/cover.jpg`}
            alt={track.title}
            fill
            className="object-cover"
          />
        </div>

        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary/90"
          >
            Connect Wallet to Play
          </button>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{track.title}</h1>
                <p className="text-lg text-muted-foreground">{track.artistName}</p>
              </div>
              <button 
                className={`rounded-full p-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className="h-6 w-6" fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button 
                className={`rounded-full p-2 ${isShuffled ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                onClick={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button className="rounded-full p-2 text-muted-foreground hover:text-foreground">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                className="rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary/90"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </button>
              <button className="rounded-full p-2 text-muted-foreground hover:text-foreground">
                <SkipForward className="h-5 w-5" />
              </button>
              <button 
                className={`rounded-full p-2 ${isRepeated ? 'text-primary' : 'text-muted-foreground'} hover:text-foreground`}
                onClick={() => setIsRepeated(!isRepeated)}
              >
                <Repeat className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}