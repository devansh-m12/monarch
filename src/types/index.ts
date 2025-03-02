// Couple type from the original Go code
export interface Couple {
  anchorTimeMs: number;
  songId: number;
}

// RecordData type from the original Go code
export interface RecordData {
  audio: string;
  duration: number;
  channels: number;
  sampleRate: number;
  sampleSize: number;
}

// Match type for song recognition results
export interface Match {
  songId: string;
  songTitle: string;
  songArtist: string;
  score: number;
  youtubeId?: string;
}

// Track type for Spotify integration
export interface Track {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  youtubeId?: string;
}

// Status message type for socket communication
export interface StatusMessage {
  type: 'info' | 'success' | 'error';
  message: string;
}

// WavInfo type for audio processing
export interface WavInfo {
  sampleRate: number;
  channels: number;
  sampleSize: number;
  duration: number;
  data: Uint8Array;
}

// AudioMetadata type for audio file metadata
export interface AudioMetadata {
  format: {
    duration: string;
    tags: {
      album?: string;
      artist: string;
      title: string;
    };
  };
} 