import { PinataSDK } from 'pinata-web3'

const pinata = new PinataSDK({
    pinataJwt: process.env.JWT_SECRET_TOKEN!,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY, // just configures pinning target, doesn't expose `.gateway`
})

export async function uploadFilesToIPFS(files: File[]) {
    if (!files.length) throw new Error('No files provided')

    const result = await pinata.upload.fileArray(files)

    return {
        cid: result.IpfsHash,
    }
}
