import Link from 'next/link'
import { ChevronLeft, MoreVertical } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface HeaderProps {
  showBackButton?: boolean
  title?: string
}

export function Header({ showBackButton, title }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href="/" className="rounded-full p-2 hover:bg-accent">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          )}
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="rounded-full p-2 hover:bg-accent">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
} 