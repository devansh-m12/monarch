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
exports.getMetadata = exports.wavBytesToSamples = exports.readWavInfo = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Reads WAV file information
 * @param filePath Path to the WAV file
 * @returns WAV file information
 */
const readWavInfo = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Read the file
    const buffer = yield fs_1.default.promises.readFile(filePath);
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
});
exports.readWavInfo = readWavInfo;
/**
 * Converts WAV bytes to audio samples
 * @param data WAV audio data
 * @returns Float32Array of audio samples
 */
const wavBytesToSamples = (data) => {
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
exports.wavBytesToSamples = wavBytesToSamples;
/**
 * Gets metadata from an audio file
 * @param filePath Path to the audio file
 * @returns Audio metadata
 */
const getMetadata = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real implementation, you would use a library like music-metadata
    // For now, we'll return a simplified metadata object
    var _a;
    // Read the WAV info to get the duration
    const wavInfo = yield (0, exports.readWavInfo)(filePath);
    // Extract the filename without extension
    const fileName = ((_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]) || '';
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
});
exports.getMetadata = getMetadata;
