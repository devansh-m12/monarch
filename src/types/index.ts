import mongoose from 'mongoose';

// Couple type from the original Go code
export interface Couple {
  anchorTimeMs: number;
  songId: number;
}

// RecordData type from the original Go code
export interface RecordData {
  audioData: string;
  timestamp: number;
}

// Match type for song recognition results
export interface Match {
  songId: string;
  title: string;
  artist: string;
  confidence: number;
}

// Track type for Spotify integration
export interface Track {
  name: string;
  artists: { name: string }[];
  album?: { name: string };
  duration_ms: number;
}

// Status message type for socket communication
export interface StatusMessage {
  type: 'info' | 'error' | 'success';
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

export interface ISong extends mongoose.Document {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  youtubeId?: string;
  songKey: string;
  createdAt: Date;
}

export interface IFingerprint extends mongoose.Document {
  hash: string;
  songId: mongoose.Types.ObjectId;
  offset: number;
} 