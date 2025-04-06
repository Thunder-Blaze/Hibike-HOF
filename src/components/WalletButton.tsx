'use client'

import { useWallet } from '@/contexts/WalletContext'

export function WalletButton() {
    const { isConnected, account, connectWallet } = useWallet()
    
    return (
        <button
            onClick={connectWallet}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
            {isConnected ? (
                <span className="text-sm font-medium">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
            ) : (
                <span className="text-sm font-medium">Connect Wallet</span>
            )}
        </button>
    )
} 