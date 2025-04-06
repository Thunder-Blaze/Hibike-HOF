'use server';

import fs from 'fs';
import path from 'path';
import PinataClient from '@pinata/sdk';

const pinata = new PinataClient({
  pinataJWTKey: process.env.JWT_SECRET_TOKEN!,
});

export async function uploadFolderToIPFS(folderPath: string) {
  const folderName = path.basename(folderPath);

  try {
    const result = await pinata.pinFromFS(folderPath);

    console.log('✅ Uploaded folder to IPFS:', result);
    return result; // contains IpfsHash, PinSize, Timestamp
  } catch (error) {
    console.error('❌ Upload to IPFS failed:', error);
    throw error;
  }
}
