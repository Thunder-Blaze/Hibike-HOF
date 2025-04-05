interface Props {
    params: { id: string };
  }
  
  export default async function TrackPage({ params }: Props) {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${params.id}`);
    const track = await res.json();
  
    return (
      <main className="max-w-2xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">{track.title}</h1>
        <p className="text-gray-500">by <a href={`/artist/${track.artistAddress}`} className="text-blue-500">{track.artistName}</a></p>
        <audio controls src={track.audioUrl} className="w-full mt-4" />
      </main>
    );
  }
  