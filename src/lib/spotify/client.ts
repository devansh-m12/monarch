import axios from 'axios';
import { Track } from '../../types';
import { createFolder, getEnv, generateSongKey, getLogger } from '../utils/helpers';
import path from 'path';
import fs from 'fs';
import { fingerprintAudio } from '../shazam/fingerprint';
import DBClient from '../db/client';
import { readWavInfo, wavBytesToSamples } from '../wav/processor';
import { hasObjectId } from '../utils/typeGuards';

const logger = getLogger();

// Spotify API endpoints
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

// Environment variables
const SPOTIFY_CLIENT_ID = getEnv('SPOTIFY_CLIENT_ID', '');
const SPOTIFY_CLIENT_SECRET = getEnv('SPOTIFY_CLIENT_SECRET', '');

/**
 * Gets a Spotify access token
 * @returns Access token
 */
const getSpotifyToken = async (): Promise<string> => {
  try {
    logger.info('Requesting Spotify access token');
    const response = await axios({
      method: 'post',
      url: SPOTIFY_TOKEN_URL,
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      }
    });
    
    logger.info('Successfully obtained Spotify token');
    return response.data.access_token;
  } catch (error) {
    logger.error('Error getting Spotify token:', error);
    throw new Error('Failed to get Spotify access token');
  }
};

/**
 * Gets track information from Spotify
 * @param trackUrl Spotify track URL
 * @returns Track information
 */
export const trackInfo = async (trackUrl: string): Promise<Track> => {
  try {
    const trackId = trackUrl.split('/').pop()?.split('?')[0];
    
    if (!trackId) {
      throw new Error('Invalid Spotify track URL');
    }
    
    const token = await getSpotifyToken();
    
    const response = await axios({
      method: 'get',
      url: `${SPOTIFY_API_BASE}/tracks/${trackId}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const track = response.data;
    
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      duration: Math.round(track.duration_ms / 1000)
    };
  } catch (error) {
    console.error('Error getting track info:', error);
    throw new Error('Failed to get track information from Spotify');
  }
};

// Define types for Spotify API responses
interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  album?: { name: string };
}

interface SpotifyPlaylistItem {
  track: SpotifyTrack;
}

/**
 * Gets album information from Spotify
 * @param albumUrl Spotify album URL
 * @returns Array of tracks in the album
 */
export const albumInfo = async (albumUrl: string): Promise<Track[]> => {
  try {
    const albumId = albumUrl.split('/').pop()?.split('?')[0];
    
    if (!albumId) {
      throw new Error('Invalid Spotify album URL');
    }
    
    const token = await getSpotifyToken();
    
    const response = await axios({
      method: 'get',
      url: `${SPOTIFY_API_BASE}/albums/${albumId}/tracks`,
      params: {
        limit: 50
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const tracks = response.data.items;
    
    return tracks.map((track: SpotifyTrack) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      duration: Math.round(track.duration_ms / 1000)
    }));
  } catch (error) {
    console.error('Error getting album info:', error);
    throw new Error('Failed to get album information from Spotify');
  }
};

/**
 * Gets playlist information from Spotify
 * @param playlistUrl Spotify playlist URL
 * @returns Array of tracks in the playlist
 */
export const playlistInfo = async (playlistUrl: string): Promise<Track[]> => {
  try {
    const playlistId = playlistUrl.split('/').pop()?.split('?')[0];
    
    if (!playlistId) {
      throw new Error('Invalid Spotify playlist URL');
    }
    
    const token = await getSpotifyToken();
    
    const response = await axios({
      method: 'get',
      url: `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
      params: {
        limit: 100
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const tracks = response.data.items;
    
    return tracks.map((item: SpotifyPlaylistItem) => {
      const track = item.track;
      return {
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        duration: Math.round(track.duration_ms / 1000)
      };
    });
  } catch (error) {
    console.error('Error getting playlist info:', error);
    throw new Error('Failed to get playlist information from Spotify');
  }
};

/**
 * Gets a YouTube ID for a track
 * @param track Track information
 * @returns YouTube ID
 */
export const getYoutubeId = async (track: Track): Promise<string> => {
  try {
    // For now, return a dummy YouTube ID
    const dummyId = `youtube-${track.title}-${track.artist}`.replace(/\s+/g, '-').toLowerCase();
    logger.info(`Generated dummy YouTube ID: ${dummyId}`);
    return dummyId;
  } catch (error) {
    logger.error('Error generating YouTube ID:', error);
    throw new Error('Failed to get YouTube ID for track');
  }
};

/**
 * Downloads a single track from Spotify
 * @param trackUrl Spotify track URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
export const dlSingleTrack = async (trackUrl: string, outputDir: string): Promise<number> => {
  try {
    // Get track information
    const track = await trackInfo(trackUrl);
    
    // Get YouTube ID
    const youtubeId = await getYoutubeId(track);
    
    // In a real implementation, you would download the track from YouTube
    // For now, we'll create a dummy WAV file
    await createFolder(outputDir);
    const outputPath = path.join(outputDir, `${track.artist} - ${track.title}.wav`);
    
    // Create a dummy WAV file
    await createDummyWavFile(outputPath);
    
    // Process and save the song
    await processAndSaveSong(outputPath, track.title, track.artist, youtubeId);
    
    return 1;
  } catch (error) {
    console.error('Error downloading track:', error);
    return 0;
  }
};

/**
 * Downloads an album from Spotify
 * @param albumUrl Spotify album URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
export const dlAlbum = async (albumUrl: string, outputDir: string): Promise<number> => {
  try {
    // Get album information
    const tracks = await albumInfo(albumUrl);
    
    // Download each track
    let downloadedTracks = 0;
    
    for (const track of tracks) {
      try {
        // Get YouTube ID
        const youtubeId = await getYoutubeId(track);
        
        // In a real implementation, you would download the track from YouTube
        // For now, we'll create a dummy WAV file
        await createFolder(outputDir);
        const outputPath = path.join(outputDir, `${track.artist} - ${track.title}.wav`);
        
        // Create a dummy WAV file
        await createDummyWavFile(outputPath);
        
        // Process and save the song
        await processAndSaveSong(outputPath, track.title, track.artist, youtubeId);
        
        downloadedTracks++;
      } catch (error) {
        console.error(`Error downloading track ${track.title}:`, error);
      }
    }
    
    return downloadedTracks;
  } catch (error) {
    console.error('Error downloading album:', error);
    return 0;
  }
};

/**
 * Downloads a playlist from Spotify
 * @param playlistUrl Spotify playlist URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
export const dlPlaylist = async (playlistUrl: string, outputDir: string): Promise<number> => {
  try {
    // Get playlist information
    const tracks = await playlistInfo(playlistUrl);
    
    // Download each track
    let downloadedTracks = 0;
    
    for (const track of tracks) {
      try {
        // Get YouTube ID
        const youtubeId = await getYoutubeId(track);
        
        // In a real implementation, you would download the track from YouTube
        // For now, we'll create a dummy WAV file
        await createFolder(outputDir);
        const outputPath = path.join(outputDir, `${track.artist} - ${track.title}.wav`);
        
        // Create a dummy WAV file
        await createDummyWavFile(outputPath);
        
        // Process and save the song
        await processAndSaveSong(outputPath, track.title, track.artist, youtubeId);
        
        downloadedTracks++;
      } catch (error) {
        console.error(`Error downloading track ${track.title}:`, error);
      }
    }
    
    return downloadedTracks;
  } catch (error) {
    console.error('Error downloading playlist:', error);
    return 0;
  }
};

/**
 * Creates a dummy WAV file for testing
 * @param outputPath Output path
 */
const createDummyWavFile = async (outputPath: string): Promise<void> => {
  // Create a simple WAV header
  const buffer = Buffer.alloc(44 + 1000); // 44 bytes header + 1000 bytes of audio data
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(buffer.length - 8, 4); // File size - 8
  buffer.write('WAVE', 8);
  
  // Format chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Format chunk size
  buffer.writeUInt16LE(1, 20); // Audio format (PCM)
  buffer.writeUInt16LE(1, 22); // Number of channels
  buffer.writeUInt32LE(44100, 24); // Sample rate
  buffer.writeUInt32LE(44100 * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample
  
  // Data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(buffer.length - 44, 40); // Data size
  
  // Write some random data
  for (let i = 44; i < buffer.length; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  
  // Write the file
  await fs.promises.writeFile(outputPath, buffer);
};

/**
 * Processes and saves a song to the database
 * @param filePath Path to the WAV file
 * @param title Song title
 * @param artist Song artist
 * @param youtubeId YouTube ID
 */
export const processAndSaveSong = async (
  filePath: string,
  title: string,
  artist: string,
  youtubeId?: string
): Promise<void> => {
  try {
    // Read the WAV file
    const wavInfo = await readWavInfo(filePath);
    
    // Convert to samples
    const samples = wavBytesToSamples(wavInfo.data);
    
    // Generate fingerprints
    const fingerprints = fingerprintAudio(samples, wavInfo.sampleRate);
    
    // Save to database
    const dbClient = new DBClient();
    
    // Save the song
    const song = await dbClient.saveSong(
      title,
      artist,
      undefined, // album
      Math.round(wavInfo.duration),
      youtubeId
    );
    
    // Save the fingerprints
    if (hasObjectId(song)) {
      await dbClient.saveFingerprints(fingerprints, song._id);
    } else {
      throw new Error('Failed to save song: Invalid song object returned');
    }
  } catch (error) {
    console.error('Error processing and saving song:', error);
    throw new Error('Failed to process and save song');
  }
};

/**
 * Downloads a song from Spotify
 * @param url Spotify URL (track, album, or playlist)
 * @returns Song data
 */
export async function downloadSong(url: string) {
  try {
    logger.info(`Starting download for Spotify URL: ${url}`);
    
    const spotifyId = extractSpotifyId(url);
    if (!spotifyId) {
      logger.error(`Invalid Spotify URL: ${url}`);
      throw new Error('Invalid Spotify URL');
    }
    
    logger.info(`Getting Spotify token for track ID: ${spotifyId}`);
    const token = await getSpotifyToken();
    
    logger.info(`Fetching track info for ID: ${spotifyId}`);
    const track = await getTrackInfo(spotifyId, token);
    
    if (!track.artists || track.artists.length === 0) {
      logger.error('Track data missing artists array');
      throw new Error('Invalid track data: missing artists');
    }

    logger.info(`Creating song data for: ${track.name} by ${track.artists[0].name}`);
    const songData = {
      title: track.name,
      artist: track.artists[0].name,
      album: track.album?.name,
      duration: Math.round(track.duration_ms / 1000),
      youtubeId: await getYoutubeId({ 
        name: track.name, 
        artists: track.artists 
      }),
      songKey: generateSongKey(track.name, track.artists[0].name),
      createdAt: new Date()
    };

    logger.info(`Successfully processed song: ${songData.title}`);
    return songData;
  } catch (error) {
    logger.error('Error downloading song:', error);
    throw new Error('Failed to download song');
  }
}

/**
 * Extracts Spotify ID from URL
 * @param url Spotify URL
 * @returns Spotify ID
 */
const extractSpotifyId = (url: string): string | null => {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

/**
 * Gets track info from Spotify API
 * @param id Spotify track ID
 * @param token Access token
 * @returns Track info
 */
const getTrackInfo = async (id: string, token: string): Promise<Track> => {
  try {
    logger.info(`Fetching track info from Spotify API for ID: ${id}`);
    const response = await axios.get(`${SPOTIFY_API_BASE}/tracks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const track = response.data;
    logger.info(`Successfully fetched track info: ${track.name}`);
    return track;
  } catch (error) {
    logger.error('Error fetching track info from Spotify:', error);
    throw new Error('Failed to get track information from Spotify');
  }
};

// ... rest of the existing code ... 