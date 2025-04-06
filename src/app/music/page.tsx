'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, MoreVertical } from 'lucide-react'

const tabs = ['Songs', 'Artists', 'Album', 'Playlist']

const songs = [
  {
    id: '1',
    title: 'Dear god',
    artist: 'Midnight pool party',
    coverUrl: '/images/dear-god.jpg',
  },
  {
    id: '2',
    title: 'Wherever you will go',
    artist: 'The calling',
    coverUrl: '/images/wherever.jpg',
  },
  {
    id: '3',
    title: 'Stay',
    artist: 'Justin Bieber',
    coverUrl: '/images/stay.jpg',
  },
  {
    id: '4',
    title: 'All this love',
    artist: 'Benjamin',
    coverUrl: '/images/love.jpg',
  },
  {
    id: '5',
    title: 'Good bye drop',
    artist: 'Lisa',
    coverUrl: '/images/drop.jpg',
  },
  {
    id: '6',
    title: 'Homura',
    artist: 'Lisa',
    coverUrl: '/images/homura.jpg',
  },
]

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState('Songs')

  return (
    <main className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-8">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-4 rounded-lg p-2 hover:bg-accent"
          >
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={song.coverUrl}
                alt={song.title}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-medium">{song.title}</h3>
              <p className="truncate text-sm text-muted-foreground">
                {song.artist}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full p-2 hover:bg-background">
                <Play className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-background">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
} 