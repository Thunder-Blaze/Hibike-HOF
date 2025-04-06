import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MusicCardProps {
  title: string
  artist: string
  coverUrl: string
  isPlaying?: boolean
  onClick?: () => void
  className?: string
  url: string
}

export function MusicCard({
  title,
  artist,
  coverUrl,
  isPlaying,
  onClick,
  className,
  url
}: MusicCardProps) {
  return (
    <a
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card transition-all hover:shadow-lg',
        className
      )}
      href={`/player/${url}`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <button className="absolute right-3 top-3 rounded-full bg-primary p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-6 w-6 text-primary-foreground" />
        </button>
      </div>
      <div className="p-4 absolute bottom-3 left-3 bg-background/50 rounded-lg" style={{width: 'calc(100% - 1.5rem)', backdropFilter: 'blur(10px)'}}>
        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{artist}</p>
      </div>
    </a>
  )
} 