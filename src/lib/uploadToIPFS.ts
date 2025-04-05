import { Web3Storage, File as W3File } from "web3.storage";

export async function uploadToIPFS(file: File, metadata?: { name?: string }) {
  if (!process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN) {
    throw new Error("Missing Web3Storage token");
  }

  const client = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const wrappedFile = new W3File([buffer], file.name, {
    type: file.type,
  });

  const cid = await client.put([wrappedFile], {
    name: metadata?.name || file.name,
  });

  const gatewayUrl = `https://ipfs.io/ipfs/${cid}/${file.name}`;
  return { cid, url: gatewayUrl };
}
