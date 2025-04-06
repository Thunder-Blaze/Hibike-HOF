interface Props {
    params: { address: string }
}

export default function ArtistPage({ params }: Props) {
    const { address } = params

    // simulate static or server-loaded artist data
    return (
        <main className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Artist Profile</h1>
            <p>Wallet: {address}</p>
            <p>
                Tracks uploaded will appear here (requires indexing or pin list)
            </p>
        </main>
    )
}
