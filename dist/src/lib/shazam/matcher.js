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
exports.findMatches = void 0;
const fingerprint_1 = require("./fingerprint");
const client_1 = __importDefault(require("../db/client"));
/**
 * Finds matches for the given audio samples
 * @param samples Audio samples
 * @param duration Duration of the audio in seconds
 * @param sampleRate Sample rate of the audio
 * @returns Array of matches and the search duration
 */
const findMatches = (samples, duration, sampleRate) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = Date.now();
    // Generate fingerprints from the audio samples
    const fingerprints = (0, fingerprint_1.fingerprintAudio)(samples, sampleRate);
    // Get the hashes from the fingerprints
    const hashes = fingerprints.map(fp => fp.hash);
    // Find matching fingerprints in the database
    const dbClient = new client_1.default();
    const matchingFingerprints = yield dbClient.getMatchingFingerprints(hashes);
    // Group the matching fingerprints by song ID
    const songMatches = new Map();
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
            songMatches.get(songId).offsets.push(offset);
        }
    }
    // Calculate the score for each song based on the number of matching fingerprints
    const songScores = [];
    for (const [, match] of songMatches) {
        // Count the occurrences of each offset
        const offsetCounts = new Map();
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
    const matches = [];
    for (const { songId, score } of songScores) {
        const songResult = yield dbClient.getSongById(songId);
        // Check if songResult exists and has the expected properties
        if (songResult) {
            // Use type assertion to tell TypeScript this is an ISong
            const song = songResult;
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
});
exports.findMatches = findMatches;
