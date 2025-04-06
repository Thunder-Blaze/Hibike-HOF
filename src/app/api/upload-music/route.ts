import { PinataSDK } from "pinata-web3";
import fs from "fs";
import path from "path";
import { Blob } from "fetch-blob";

// 1. Create SDK instance
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "your-gateway.mypinata.cloud", // optional
});

// 2. Helper to create File object from local path
function fileFromPath(filePath: string): File {
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer]);
  const name = path.basename(filePath);
  const type = getMimeType(name); // you can use 'mime' lib for this
  return new File([blob], name, { type });
}

// 3. Upload entire folder
export async function uploadFolderToIPFS(folderPath: string) {
  const files: File[] = [];

  // Read all files in the folder
  const fileNames = fs.readdirSync(folderPath);
  for (const fileName of fileNames) {
    const filePath = path.join(folderPath, fileName);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      files.push(fileFromPath(filePath));
    }
  }

  // Upload folder to public IPFS
  const upload = await pinata.upload.fileArray(files);

  console.log("✅ Uploaded folder to IPFS:");
  console.log(upload);
}

// 4. Get MIME types (basic)
function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".json") return "application/json";
  return "application/octet-stream";
}

// Usage
// uploadFolderToIPFS("");
