import { Song, Fingerprint, ISong, IFingerprint } from '../../models';
import dbConnect from './mongodb';
import { generateSongKey } from '../utils/helpers';
import mongoose from 'mongoose';

class DBClient {
  constructor() {
    // Connect to the database
    dbConnect();
  }

  async close() {
    // This is a no-op in Next.js since we're using a cached connection
    return;
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

export default DBClient; 