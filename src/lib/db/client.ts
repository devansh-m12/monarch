import { Song, Fingerprint, ISong, IFingerprint } from '../../models';
import mongoose from 'mongoose';
import { getEnv, generateSongKey } from '../utils/helpers';

const MONGODB_URI = getEnv('MONGODB_URI', '');

interface SongData {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  youtubeId?: string;
  songKey: string;
  createdAt: Date;
}

class DBClient {
  private static instance: DBClient | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DBClient {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }

  async connect() {
    if (!this.isConnected) {
      await mongoose.connect(MONGODB_URI);
      this.isConnected = true;
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Failed to connect to database');
    }
    return db;
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
    }
  }

  async insertSong(songData: SongData) {
    const db = await this.connect();
    return await db.collection('songs').insertOne(songData);
  }

  async countSongs() {
    const db = await this.connect();
    return await db.collection('songs').countDocuments();
  }

  async saveSong(title: string, artist: string, album: string | undefined, duration: number, youtubeId: string | undefined): Promise<ISong> {
    const songKey = generateSongKey(title, artist);
    
    const song = new Song({
      title,
      artist,
      album,
      duration,
      youtubeId,
      songKey
    });

    return await song.save();
  }

  async saveFingerprints(fingerprints: { hash: string; offset: number }[], songId: mongoose.Types.ObjectId): Promise<void> {
    const fingerprintDocs = fingerprints.map(fp => ({
      hash: fp.hash,
      songId,
      offset: fp.offset
    }));

    await Fingerprint.insertMany(fingerprintDocs);
  }

  async getMatchingFingerprints(hashes: string[]): Promise<IFingerprint[]> {
    return await Fingerprint.find({ hash: { $in: hashes } }).exec();
  }

  async getSongById(songId: mongoose.Types.ObjectId): Promise<ISong | null> {
    return await Song.findById(songId).exec();
  }

  async getSongByKey(songKey: string): Promise<{ song: ISong | null; exists: boolean; error: Error | null }> {
    try {
      const song = await Song.findOne({ songKey }).exec();
      return { song, exists: !!song, error: null };
    } catch (error) {
      return { song: null, exists: false, error: error as Error };
    }
  }

  async totalSongs(): Promise<number> {
    return await Song.countDocuments().exec();
  }

  async deleteCollection(collectionName: 'songs' | 'fingerprints'): Promise<void> {
    if (collectionName === 'songs') {
      await Song.deleteMany({}).exec();
    } else if (collectionName === 'fingerprints') {
      await Fingerprint.deleteMany({}).exec();
    }
  }
}

// Export a singleton instance
const instance = DBClient.getInstance();
export default instance; 