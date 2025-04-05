'use client';
import { useState } from "react";
import { createMetadata } from "@/lib/metadata";
import { uploadJsonToIPFS } from "@/lib/pinata";
import { ethers } from "ethers";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  async function handleUpload() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const metadata = createMetadata({
      title,
      artistName,
      artistAddress: address,
      audioUrl,
    });

    const ipfsUrl = await uploadJsonToIPFS(metadata);
    alert("Uploaded: " + ipfsUrl);
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Upload Music</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
      <input value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Artist Name" className="border p-2 w-full" />
      <input value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} placeholder="Audio URL (IPFS or https)" className="border p-2 w-full" />
      <button onClick={handleUpload} className="bg-black text-white px-4 py-2 rounded">Upload</button>
    </main>
  );
}
