"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAndSaveSong = exports.dlPlaylist = exports.dlAlbum = exports.dlSingleTrack = exports.getYoutubeId = exports.playlistInfo = exports.albumInfo = exports.trackInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("../utils/helpers");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fingerprint_1 = require("../shazam/fingerprint");
const client_1 = __importDefault(require("../db/client"));
const processor_1 = require("../wav/processor");
const typeGuards_1 = require("../utils/typeGuards");
// Spotify API endpoints
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
// Environment variables
const SPOTIFY_CLIENT_ID = (0, helpers_1.getEnv)('SPOTIFY_CLIENT_ID', '');
const SPOTIFY_CLIENT_SECRET = (0, helpers_1.getEnv)('SPOTIFY_CLIENT_SECRET', '');
/**
 * Gets a Spotify access token
 * @returns Access token
 */
const getSpotifyToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
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
        return response.data.access_token;
    }
    catch (error) {
        console.error('Error getting Spotify token:', error);
        throw new Error('Failed to get Spotify access token');
    }
});
/**
 * Gets track information from Spotify
 * @param trackUrl Spotify track URL
 * @returns Track information
 */
const trackInfo = (trackUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const trackId = (_a = trackUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        if (!trackId) {
            throw new Error('Invalid Spotify track URL');
        }
        const token = yield getSpotifyToken();
        const response = yield (0, axios_1.default)({
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
    }
    catch (error) {
        console.error('Error getting track info:', error);
        throw new Error('Failed to get track information from Spotify');
    }
});
exports.trackInfo = trackInfo;
/**
 * Gets album information from Spotify
 * @param albumUrl Spotify album URL
 * @returns Array of tracks in the album
 */
const albumInfo = (albumUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const albumId = (_a = albumUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        if (!albumId) {
            throw new Error('Invalid Spotify album URL');
        }
        const token = yield getSpotifyToken();
        const response = yield (0, axios_1.default)({
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
        return tracks.map((track) => ({
            id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            duration: Math.round(track.duration_ms / 1000)
        }));
    }
    catch (error) {
        console.error('Error getting album info:', error);
        throw new Error('Failed to get album information from Spotify');
    }
});
exports.albumInfo = albumInfo;
/**
 * Gets playlist information from Spotify
 * @param playlistUrl Spotify playlist URL
 * @returns Array of tracks in the playlist
 */
const playlistInfo = (playlistUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const playlistId = (_a = playlistUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0];
        if (!playlistId) {
            throw new Error('Invalid Spotify playlist URL');
        }
        const token = yield getSpotifyToken();
        const response = yield (0, axios_1.default)({
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
        return tracks.map((item) => {
            const track = item.track;
            return {
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                duration: Math.round(track.duration_ms / 1000)
            };
        });
    }
    catch (error) {
        console.error('Error getting playlist info:', error);
        throw new Error('Failed to get playlist information from Spotify');
    }
});
exports.playlistInfo = playlistInfo;
/**
 * Gets a YouTube ID for a track
 * @param track Track information
 * @returns YouTube ID
 */
const getYoutubeId = (track) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // In a real implementation, you would use the YouTube API to search for the track
        // For now, we'll return a dummy YouTube ID
        return `youtube-${track.title}-${track.artist}`.replace(/\s+/g, '-').toLowerCase();
    }
    catch (error) {
        console.error('Error getting YouTube ID:', error);
        throw new Error('Failed to get YouTube ID for track');
    }
});
exports.getYoutubeId = getYoutubeId;
/**
 * Downloads a single track from Spotify
 * @param trackUrl Spotify track URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
const dlSingleTrack = (trackUrl, outputDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get track information
        const track = yield (0, exports.trackInfo)(trackUrl);
        // Get YouTube ID
        const youtubeId = yield (0, exports.getYoutubeId)(track);
        // In a real implementation, you would download the track from YouTube
        // For now, we'll create a dummy WAV file
        yield (0, helpers_1.createFolder)(outputDir);
        const outputPath = path_1.default.join(outputDir, `${track.artist} - ${track.title}.wav`);
        // Create a dummy WAV file
        yield createDummyWavFile(outputPath);
        // Process and save the song
        yield (0, exports.processAndSaveSong)(outputPath, track.title, track.artist, youtubeId);
        return 1;
    }
    catch (error) {
        console.error('Error downloading track:', error);
        return 0;
    }
});
exports.dlSingleTrack = dlSingleTrack;
/**
 * Downloads an album from Spotify
 * @param albumUrl Spotify album URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
const dlAlbum = (albumUrl, outputDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get album information
        const tracks = yield (0, exports.albumInfo)(albumUrl);
        // Download each track
        let downloadedTracks = 0;
        for (const track of tracks) {
            try {
                // Get YouTube ID
                const youtubeId = yield (0, exports.getYoutubeId)(track);
                // In a real implementation, you would download the track from YouTube
                // For now, we'll create a dummy WAV file
                yield (0, helpers_1.createFolder)(outputDir);
                const outputPath = path_1.default.join(outputDir, `${track.artist} - ${track.title}.wav`);
                // Create a dummy WAV file
                yield createDummyWavFile(outputPath);
                // Process and save the song
                yield (0, exports.processAndSaveSong)(outputPath, track.title, track.artist, youtubeId);
                downloadedTracks++;
            }
            catch (error) {
                console.error(`Error downloading track ${track.title}:`, error);
            }
        }
        return downloadedTracks;
    }
    catch (error) {
        console.error('Error downloading album:', error);
        return 0;
    }
});
exports.dlAlbum = dlAlbum;
/**
 * Downloads a playlist from Spotify
 * @param playlistUrl Spotify playlist URL
 * @param outputDir Output directory
 * @returns Number of tracks downloaded
 */
const dlPlaylist = (playlistUrl, outputDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get playlist information
        const tracks = yield (0, exports.playlistInfo)(playlistUrl);
        // Download each track
        let downloadedTracks = 0;
        for (const track of tracks) {
            try {
                // Get YouTube ID
                const youtubeId = yield (0, exports.getYoutubeId)(track);
                // In a real implementation, you would download the track from YouTube
                // For now, we'll create a dummy WAV file
                yield (0, helpers_1.createFolder)(outputDir);
                const outputPath = path_1.default.join(outputDir, `${track.artist} - ${track.title}.wav`);
                // Create a dummy WAV file
                yield createDummyWavFile(outputPath);
                // Process and save the song
                yield (0, exports.processAndSaveSong)(outputPath, track.title, track.artist, youtubeId);
                downloadedTracks++;
            }
            catch (error) {
                console.error(`Error downloading track ${track.title}:`, error);
            }
        }
        return downloadedTracks;
    }
    catch (error) {
        console.error('Error downloading playlist:', error);
        return 0;
    }
});
exports.dlPlaylist = dlPlaylist;
/**
 * Creates a dummy WAV file for testing
 * @param outputPath Output path
 */
const createDummyWavFile = (outputPath) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield fs_1.default.promises.writeFile(outputPath, buffer);
});
/**
 * Processes and saves a song to the database
 * @param filePath Path to the WAV file
 * @param title Song title
 * @param artist Song artist
 * @param youtubeId YouTube ID
 */
const processAndSaveSong = (filePath, title, artist, youtubeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read the WAV file
        const wavInfo = yield (0, processor_1.readWavInfo)(filePath);
        // Convert to samples
        const samples = (0, processor_1.wavBytesToSamples)(wavInfo.data);
        // Generate fingerprints
        const fingerprints = (0, fingerprint_1.fingerprintAudio)(samples, wavInfo.sampleRate);
        // Save to database
        const dbClient = new client_1.default();
        // Save the song
        const song = yield dbClient.saveSong(title, artist, undefined, // album
        Math.round(wavInfo.duration), youtubeId);
        // Save the fingerprints
        if ((0, typeGuards_1.hasObjectId)(song)) {
            yield dbClient.saveFingerprints(fingerprints, song._id);
        }
        else {
            throw new Error('Failed to save song: Invalid song object returned');
        }
    }
    catch (error) {
        console.error('Error processing and saving song:', error);
        throw new Error('Failed to process and save song');
    }
});
exports.processAndSaveSong = processAndSaveSong;
