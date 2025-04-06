'use client'
import { useState } from 'react'
import { ethers } from 'ethers'

export default function Home() {
    const [address, setAddress] = useState('')

    async function signIn() {
        if (!window.ethereum) return alert('MetaMask not found')

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const addr = await signer.getAddress()
        setAddress(addr)

        const message = 'Sign in to authenticate with web3-token'
        const signature = await signer.signMessage(message)

        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
        })

        if (res.ok) {
            window.location.href = '/dashboard'
        }
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login with Ethereum</h1>
            <button
                onClick={signIn}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Connect Wallet
            </button>
            {address && (
                <p className="mt-2 text-sm text-gray-600">
                    Connected: {address}
                </p>
            )}
        </main>
    )
}
