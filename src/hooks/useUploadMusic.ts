import { useState, useCallback } from 'react'
import { useMusicNFT } from './useMusicNFT'

interface UploadResponse {
  ipfsHash: string
  metadataUri: string
}

export function useUploadMusic() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { mintNFT } = useMusicNFT()

  const uploadAndMint = useCallback(async (
    audioFile: File,
    coverImage: File,
    title: string,
    artistName: string,
    description: string
  ) => {
    try {
      setIsUploading(true)
      setError(null)

      // Create form data for upload
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('cover', coverImage)
      formData.append('metadata', JSON.stringify({
        title,
        artistName,
        description
      }))

      // Upload to your backend/IPFS
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload files')
      }

      const data: UploadResponse = await response.json()

      // Automatically mint NFT after successful upload
      const tokenId = await mintNFT(data.metadataUri)

      return {
        ipfsHash: data.ipfsHash,
        tokenId
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [mintNFT])

  return {
    uploadAndMint,
    isUploading,
    error
  }
} 