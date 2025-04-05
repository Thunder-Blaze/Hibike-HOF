import React from 'react'
import { Button } from '../ui/button'
import Playlist from './playlist'

interface TypePlaylist {
    id: string;
    name: string;
    image: string;
    tracks: number;
}

const PlaylistData: TypePlaylist[] = [
    {
        id: "0006498",
        name: "Playlist 1",
        image: "/images/albumcover0006498.jpg",
        tracks: 21,
    },
    {
        id: "0007598",
        name: "Playlist 2",
        image: "/images/albumcover0007598.jpg",
        tracks: 17,
    },
    {
        id: "0007616",
        name: "Playlist 3",
        image: "/images/albumcover0007616.jpg",
        tracks: 12,
    },
    {
        id: "0007767",
        name: "Playlist 4",
        image: "/images/albumcover0007767.jpg",
        tracks: 8,
    },
]

const Playlists = () => {
  return (
    <div>
        <div className='flex items-center mb-5 justify-between'>
            <h1 className='text-2xl font-bold'>Playlists</h1>
            <Button variant={"ghost"} className='font-semibold'>See More</Button>
        </div>
        <div className='grid grid-cols-4  gap-4 items-center justify-center'>
            {PlaylistData.map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} />
            ))}
        </div>
    </div>
  )
}

export default Playlists
