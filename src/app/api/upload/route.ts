import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { uploadFolderToIPFS } from "@/lib/pinata";
import { createMetadata } from "@/lib/metadata";

export const runtime = "nodejs"; // required for fs support in App Router

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "untitled";
    const artistName = formData.get("artistName")?.toString() || "unknown";
    const description = formData.get("description")?.toString() || "";
    const anime = formData.get("anime")?.toString() || "";
    const genres = formData.get("genres")?.toString().split(",").map((g) => g.trim()) || [];
    const tags = formData.get("tags")?.toString().split(",").map((t) => t.trim()) || [];

    const folderName = sanitizeFileName(`${title}-${artistName}`);
    const folderPath = path.join(process.cwd(), "tmp", folderName);
    fs.mkdirSync(folderPath, { recursive: true });

    const saveFile = async (file: File, filename: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(folderPath, filename);
      await fsPromises.writeFile(filePath, buffer);
    };

    const songFile = formData.get("songFile") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    if (songFile) {
      await saveFile(songFile, "song.mp3");
    }

    if (coverImage) {
      await saveFile(coverImage, "cover.jpg");
    }

    const metadata = createMetadata({
      title,
      artistName,
      artistAddress: "",
      description,
      anime,
      genres,
      tags,
      coverImageUrl: "cover.jpg",
      skinImageUrl: "",
      colorArray: [],
    });

    await fsPromises.writeFile(
      path.join(folderPath, "metadata.json"),
      JSON.stringify(metadata),
      "utf-8"
    );

    const ipfsHash = await uploadFolderToIPFS(folderPath);

    return NextResponse.json({ ipfsHash });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
