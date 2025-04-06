import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import MusicNFTAbi from '@/contracts/MusicNFT.json'

const CONTRACT_ADDRESS = '' // Replace after deployment

export function useMusicNFT() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mintNFT = useCallback(async (metadataURI: string) => {
    try {
      setIsLoading(true)
      setError(null)

      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask!')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MusicNFTAbi.abi, signer)

      // Get mint price
      const mintPrice = await contract.getMintPrice()

      // Mint NFT
      const tx = await contract.mintMusic(metadataURI, {
        value: mintPrice
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Get token ID from event
      const event = receipt.events?.find(
        (event: any) => event.event === 'MusicNFTMinted'
      )
      const tokenId = event?.args?.tokenId

      return tokenId
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    mintNFT,
    isLoading,
    error
  }
} 