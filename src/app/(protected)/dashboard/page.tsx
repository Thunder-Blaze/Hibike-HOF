import Playlists from '@/components/dashboard/playlists'
import Banner from '@/components/dashboard/banner'

export default async function Dashboard() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <Banner />
            <Playlists />
        </main>
    )
}
