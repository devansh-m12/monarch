import { Match } from '../../types';
import { fingerprintAudio } from './fingerprint';
import DBClient from '../db/client';
import mongoose from 'mongoose';

/**
 * Finds matches for the given audio samples
 * @param samples Audio samples
 * @param duration Duration of the audio in seconds
 * @param sampleRate Sample rate of the audio
 * @returns Array of matches and the search duration
 */
export const findMatches = async (
  samples: Float32Array,
  duration: number,
  sampleRate: number
): Promise<{ matches: Match[]; searchDuration: string }> => {
  const startTime = Date.now();
  
  // Generate fingerprints from the audio samples
  const fingerprints = fingerprintAudio(samples, sampleRate);
  
  // Get the hashes from the fingerprints
  const hashes = fingerprints.map(fp => fp.hash);
  
  // Find matching fingerprints in the database
  const dbClient = new DBClient();
  const matchingFingerprints = await dbClient.getMatchingFingerprints(hashes);
  
  // Group the matching fingerprints by song ID
  const songMatches = new Map<string, { offsets: number[]; songId: mongoose.Types.ObjectId }>();
  
  for (const fp of matchingFingerprints) {
    const songId = fp.songId.toString();
    
    if (!songMatches.has(songId)) {
      songMatches.set(songId, { offsets: [], songId: fp.songId });
    }
    
    // Find the corresponding query fingerprint
    const queryFingerprintIndex = hashes.indexOf(fp.hash);
    if (queryFingerprintIndex !== -1) {
      const queryOffset = fingerprints[queryFingerprintIndex].offset;
      const dbOffset = fp.offset;
      
      // Calculate the time offset between the query and the database fingerprint
      const offset = dbOffset - queryOffset;
      songMatches.get(songId)!.offsets.push(offset);
    }
  }
  
  // Calculate the score for each song based on the number of matching fingerprints
  const songScores: { songId: mongoose.Types.ObjectId; score: number }[] = [];
  
  for (const [, match] of songMatches) {
    // Count the occurrences of each offset
    const offsetCounts = new Map<number, number>();
    
    for (const offset of match.offsets) {
      offsetCounts.set(offset, (offsetCounts.get(offset) || 0) + 1);
    }
    
    // Find the most common offset
    let maxCount = 0;
    for (const count of offsetCounts.values()) {
      maxCount = Math.max(maxCount, count);
    }
    
    // Calculate the score based on the number of matching fingerprints
    const score = maxCount;
    
    songScores.push({
      songId: match.songId,
      score
    });
  }
  
  // Sort the songs by score in descending order
  songScores.sort((a, b) => b.score - a.score);
  
  // Get the song details for the top matches
  const matches: Match[] = [];
  
  for (const { songId, score } of songScores) {
    const songResult = await dbClient.getSongById(songId);
    
    // Check if songResult exists and has the expected properties
    if (songResult) {
      // Use type assertion to tell TypeScript this is an ISong
      const song = songResult as unknown as {
        _id: { toString: () => string };
        title: string;
        artist: string;
        youtubeId?: string;
      };
      
      matches.push({
        songId: song._id.toString(),
        songTitle: song.title,
        songArtist: song.artist,
        score,
        youtubeId: song.youtubeId
      });
    }
  }
  
  const endTime = Date.now();
  const searchDuration = `${((endTime - startTime) / 1000).toFixed(2)}s`;
  
  return { matches, searchDuration };
}; 