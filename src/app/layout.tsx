import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import AnimatedCursor from 'react-animated-cursor'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import { WalletProvider } from '@/contexts/WalletContext'
import { WalletButton } from '@/components/WalletButton'
import { ThemeToggle } from '@/components/ThemeToggle'

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrainsMono',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Hibike',
    description:
        'A Web3-powered marketplace where fans become music rights holders, and creators remix with freedom',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <WalletProvider>
                        <div className="min-h-screen bg-background">
                            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                                Hibike
                                            </span>
                                        </div>
                                        <nav className="hidden md:flex items-center gap-6">
                                            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
                                                Home
                                            </a>
                                            <a href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
                                                Marketplace
                                            </a>
                                            <a href="/upload" className="text-sm font-medium transition-colors hover:text-primary">
                                                Upload
                                            </a>
                                        </nav>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <WalletButton />
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </header>
                            <main className="flex-1">
                                {children}
                            </main>
                        </div>
                    </WalletProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
