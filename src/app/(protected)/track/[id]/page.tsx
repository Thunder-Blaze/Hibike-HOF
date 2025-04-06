'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    params: { id: string };
  }

interface Track {
    id: string;
    title: string;
    artistName: string;
    audioUrl: string;
  }
  
  export default function TrackPage() {
    const params = useParams();
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
      async function fetchTrack() {
        const res = await fetch(`https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/metadata.json`);
        if (!res.ok) {
          throw new Error("Failed to fetch track");
        }
        const data = await res.json();
        setTrack(data);
      }
      fetchTrack();
    }, [params.id]);
  
    return (
      <>
        {track ? (
          <div className="max-w-xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold">{track.title}</h1>
            <p className="text-gray-600">Artist: {track.artistName}</p>
            <audio
              controls
              src={`https://apricot-abstract-swordfish-756.mypinata.cloud/ipfs/${params.id}/song.mp3`}
              className="w-full"
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </>
    );
    
  }
  