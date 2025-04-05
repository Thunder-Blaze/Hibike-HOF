import React from 'react'
import Image from 'next/image'
import { FaMusic, FaPlayCircle } from "react-icons/fa";
import Link from 'next/link';

interface TypePlaylist {
    id: string;
    name: string;
    image: string;
    tracks: number;
}

const Playlist = ({ playlist }: { playlist: TypePlaylist }) => {
    return (
        <div className='flex flex-col relative items-center justify-center'>
            <Image src={playlist.image} width={150} height={150} alt={playlist.name} className='w-48 h-48 rounded-xl' />
            <div className='flex justify-between items-center rounded-md absolute text-background bottom-3 p-2.5 py-1.5 w-full bg-foreground/50' style={{backdropFilter: "blur(10px)", width: "calc(100% - 1.5rem)"}}>
                <div className='flex flex-col'>
                    <h2 className='text-md font-bold'>{playlist.name}</h2>
                    <p className='text-xs text-card-background/60 flex gap-1 items-center justify-start'><FaMusic /> {playlist.tracks} tracks</p>
                </div>
                <Link href={`/playlist/${playlist.id}`} className='hover:scale-110 transition-all duration-200 ease-in-out'>
                    <FaPlayCircle size={28}/>
                </Link>
            </div>
        </div>
    )
}

export default Playlist
