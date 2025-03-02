import fs from 'fs';
import { WavInfo, AudioMetadata } from '../../types';

/**
 * Reads WAV file information
 * @param filePath Path to the WAV file
 * @returns WAV file information
 */
export const readWavInfo = async (filePath: string): Promise<WavInfo> => {
  // Read the file
  const buffer = await fs.promises.readFile(filePath);
  
  // Parse the WAV header
  const sampleRate = buffer.readUInt32LE(24);
  const channels = buffer.readUInt16LE(22);
  const bitsPerSample = buffer.readUInt16LE(34);
  const dataSize = buffer.readUInt32LE(40);
  
  // Calculate the duration
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = dataSize / (channels * bytesPerSample);
  const duration = numSamples / sampleRate;
  
  // Extract the audio data
  const dataOffset = 44; // Standard WAV header size
  const data = buffer.slice(dataOffset);
  
  return {
    sampleRate,
    channels,
    sampleSize: bitsPerSample,
    duration,
    data: new Uint8Array(data)
  };
};

/**
 * Converts WAV bytes to audio samples
 * @param data WAV audio data
 * @returns Float32Array of audio samples
 */
export const wavBytesToSamples = (data: Uint8Array): Float32Array => {
  // Assuming 16-bit PCM audio (most common)
  const samples = new Float32Array(data.length / 2);
  
  for (let i = 0; i < samples.length; i++) {
    // Convert two bytes to a 16-bit sample
    const sample = (data[i * 2] | (data[i * 2 + 1] << 8));
    
    // Convert to signed value
    const signedSample = sample >= 0x8000 ? sample - 0x10000 : sample;
    
    // Normalize to [-1, 1]
    samples[i] = signedSample / 32768.0;
  }
  
  return samples;
};

/**
 * Gets metadata from an audio file
 * @param filePath Path to the audio file
 * @returns Audio metadata
 */
export const getMetadata = async (filePath: string): Promise<AudioMetadata> => {
  // In a real implementation, you would use a library like music-metadata
  // For now, we'll return a simplified metadata object
  
  // Read the WAV info to get the duration
  const wavInfo = await readWavInfo(filePath);
  
  // Extract the filename without extension
  const fileName = filePath.split('/').pop()?.split('.')[0] || '';
  
  // Try to parse artist and title from the filename (assuming format: "Artist - Title")
  let artist = 'Unknown Artist';
  let title = fileName;
  
  if (fileName.includes(' - ')) {
    const parts = fileName.split(' - ');
    artist = parts[0];
    title = parts[1];
  }
  
  return {
    format: {
      duration: wavInfo.duration.toString(),
      tags: {
        artist,
        title,
        album: 'Unknown Album'
      }
    }
  };
}; 