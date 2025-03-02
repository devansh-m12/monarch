import fs from 'fs';
import path from 'path';
import { RecordData } from '../../types';

/**
 * Creates a folder if it doesn't exist
 * @param folderPath Path to the folder
 * @returns Promise that resolves when the folder is created
 */
export const createFolder = async (folderPath: string): Promise<void> => {
  if (!fs.existsSync(folderPath)) {
    await fs.promises.mkdir(folderPath, { recursive: true });
  }
};

/**
 * Generates a unique key for a song based on title and artist
 * @param title Song title
 * @param artist Song artist
 * @returns Unique song key
 */
export const generateSongKey = (title: string, artist: string): string => {
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedArtist = artist.toLowerCase().trim();
  return `${normalizedTitle}:${normalizedArtist}`;
};

/**
 * Gets an environment variable or returns a default value
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default value
 */
export const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Processes a recording from the client
 * @param recordData Recording data from the client
 * @param saveToFile Whether to save the recording to a file
 * @returns Processed audio samples
 */
export const processRecording = async (recordData: RecordData, saveToFile: boolean = false): Promise<Float32Array> => {
  // Convert base64 audio to buffer
  const audioBuffer = Buffer.from(recordData.audio, 'base64');
  
  // If saveToFile is true, save the buffer to a file
  if (saveToFile) {
    await createFolder('tmp');
    const filePath = path.join('tmp', `recording-${Date.now()}.wav`);
    await fs.promises.writeFile(filePath, audioBuffer);
  }
  
  // Convert buffer to samples (this is a simplified version, actual implementation would depend on the WAV format)
  // In a real implementation, you would use a library like wavefile or wav to parse the WAV file
  // For now, we'll return a dummy Float32Array
  return new Float32Array(audioBuffer.length / 2);
};

/**
 * Creates a logger for the application
 * @returns Logger instance
 */
export const getLogger = () => {
  return {
    info: (message: string) => console.log(`[INFO] ${message}`),
    error: (message: string, error?: Error) => console.error(`[ERROR] ${message}`, error),
    warn: (message: string) => console.warn(`[WARN] ${message}`),
    debug: (message: string) => console.debug(`[DEBUG] ${message}`),
    errorContext: (ctx: unknown, message: string, error?: unknown) => console.error(`[ERROR] ${message}`, error)
  };
}; 