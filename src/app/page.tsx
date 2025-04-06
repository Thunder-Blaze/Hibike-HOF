'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractABI from '../contract_data/GetSet.json'
import contractAddress from '../contract_data/GetSet-address.json'
import { Search, Play, MoreVertical } from 'lucide-react'
import { MusicCard } from '@/components/music/MusicCard'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'

export default function HomePage() {
    const [value, setValue] = useState('')
    const [retrievedValue, setRetrievedValue] = useState(null)
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(
        null
    )
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
    const [contract, setContract] = useState<ethers.Contract | null>(null)
    const [depositAmount, setDepositAmount] = useState('')
    const [userBalance, setUserBalance] = useState<string | null>(null)

    const trendingMusic = [
        {
            id: '1',
            title: 'On the ground',
            artist: 'Rose',
            coverUrl: '/images/winter.jpg',
        },
        {
            id: '2',
            title: 'Stay',
            artist: 'Justin Bieber',
            coverUrl: '/images/stay.jpg',
        },
    ]

    const recentlyPlayed = [
        {
            id: '3',
            title: 'Homura',
            artist: 'Lisa',
            coverUrl: '/images/homura.jpg',
        },
        {
            id: '4',
            title: 'All my worst',
            artist: 'Pink',
            coverUrl: '/images/worst.jpg',
        },
    ]

    // Initialize Provider, Signer, and Contract
    const initializeEthers = async () => {
        if (!window.ethereum) {
            alert('MetaMask not detected!')
            return
        }

        try {
            const _provider = new ethers.BrowserProvider(window.ethereum)
            const _signer = await _provider.getSigner()
            const _contract = new ethers.Contract(
                contractAddress.address,
                contractABI.abi,
                _signer
            )

            setProvider(_provider)
            setSigner(_signer)
            setContract(_contract)

            const accounts = await _provider.send('eth_requestAccounts', [])
            setAccount(accounts[0])
        } catch (error) {
            console.error('Error initializing ethers:', error)
        }
    }

    // Set value in contract
    const setContractValue = async () => {
        if (!contract) return alert('Please connect wallet first!')
        try {
            const tx = await contract.set(BigInt(value)) // Convert string to BigInt
            await tx.wait() // Wait for transaction confirmation
            alert('Value set successfully!')
        } catch (error) {
            console.error('Error setting value:', error)
        }
    }

    // Get value from contract
    const getContractValue = async () => {
        if (!contract) return alert('Please connect wallet first!')
        try {
            const result = await contract.get()
            setRetrievedValue(result.toString())
        } catch (error) {
            console.error('Error getting value:', error)
        }
    }

    // Deposit funds to the contract
    const depositFunds = async () => {
        if (!contract) return alert('Please connect wallet first!')
        try {
            const tx = await signer?.sendTransaction({
                to: contractAddress.address,
                value: ethers.parseEther(depositAmount), // Convert to wei
            })
            await tx?.wait()
            alert(`Deposited ${depositAmount} ETH successfully!`)
            setDepositAmount('')
        } catch (error) {
            console.error('Error depositing funds:', error)
        }
    }

    // Get user balance
    const getUserBalance = async () => {
        if (!contract) return alert('Please connect wallet first!')
        try {
            const balance = await contract.getBalance(account)
            setUserBalance(ethers.formatEther(balance)) // Convert from wei to ETH
        } catch (error) {
            console.error('Error getting balance:', error)
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            initializeEthers()
        }
    }, [])

    return (
        <>
            <Header title="Discover" />
            <main className="container mx-auto px-4 pt-24 pb-8">
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search music, album..."
                            className="w-full rounded-full bg-muted px-10 py-2 text-sm"
                        />
                    </div>
                </div>

                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Music Trending</h2>
                        <button className="text-sm text-muted-foreground hover:text-primary">
                            Show more
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {trendingMusic.map((music) => (
                            <MusicCard key={music.id} {...music} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mb-4">
                        <div className="flex space-x-4 text-sm">
                            <button className="font-medium text-primary">Recently</button>
                            <button className="text-muted-foreground hover:text-primary">
                                Popular
                            </button>
                            <button className="text-muted-foreground hover:text-primary">
                                Similar
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentlyPlayed.map((music) => (
                            <div
                                key={music.id}
                                className="flex items-center gap-4 rounded-xl bg-card p-3 hover:bg-accent"
                            >
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                                    <Image
                                        src={music.coverUrl}
                                        alt={music.title}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="truncate font-medium">{music.title}</h3>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {music.artist}
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
                </section>
            </main>
        </>
    )
}
