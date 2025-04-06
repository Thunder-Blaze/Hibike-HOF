export interface TrackMetadata {
    title: string;
    artistName: string;
    artistAddress: string;
    // audioUrl: string;
    coverImageUrl?: string;
    skinImageUrl?: string;
    colorArray?: string[];
    description?: string;
    anime?: string;
    genres?: string[];
    tags?: string[];
  }
  
  export function createMetadata(meta: TrackMetadata) {
    return {
      version: "1.0.0",
      type: "music-track",
      ...meta,
      timestamp: new Date().toISOString(),
    };
  }
  