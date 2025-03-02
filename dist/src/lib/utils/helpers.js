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
exports.getLogger = exports.processRecording = exports.getEnv = exports.generateSongKey = exports.createFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Creates a folder if it doesn't exist
 * @param folderPath Path to the folder
 * @returns Promise that resolves when the folder is created
 */
const createFolder = (folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(folderPath)) {
        yield fs_1.default.promises.mkdir(folderPath, { recursive: true });
    }
});
exports.createFolder = createFolder;
/**
 * Generates a unique key for a song based on title and artist
 * @param title Song title
 * @param artist Song artist
 * @returns Unique song key
 */
const generateSongKey = (title, artist) => {
    const normalizedTitle = title.toLowerCase().trim();
    const normalizedArtist = artist.toLowerCase().trim();
    return `${normalizedTitle}:${normalizedArtist}`;
};
exports.generateSongKey = generateSongKey;
/**
 * Gets an environment variable or returns a default value
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default value
 */
const getEnv = (key, defaultValue) => {
    return process.env[key] || defaultValue;
};
exports.getEnv = getEnv;
/**
 * Processes a recording from the client
 * @param recordData Recording data from the client
 * @param saveToFile Whether to save the recording to a file
 * @returns Processed audio samples
 */
const processRecording = (recordData_1, ...args_1) => __awaiter(void 0, [recordData_1, ...args_1], void 0, function* (recordData, saveToFile = false) {
    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(recordData.audio, 'base64');
    // If saveToFile is true, save the buffer to a file
    if (saveToFile) {
        yield (0, exports.createFolder)('tmp');
        const filePath = path_1.default.join('tmp', `recording-${Date.now()}.wav`);
        yield fs_1.default.promises.writeFile(filePath, audioBuffer);
    }
    // Convert buffer to samples (this is a simplified version, actual implementation would depend on the WAV format)
    // In a real implementation, you would use a library like wavefile or wav to parse the WAV file
    // For now, we'll return a dummy Float32Array
    return new Float32Array(audioBuffer.length / 2);
});
exports.processRecording = processRecording;
/**
 * Creates a logger for the application
 * @returns Logger instance
 */
const getLogger = () => {
    return {
        info: (message) => console.log(`[INFO] ${message}`),
        error: (message, error) => console.error(`[ERROR] ${message}`, error),
        warn: (message) => console.warn(`[WARN] ${message}`),
        debug: (message) => console.debug(`[DEBUG] ${message}`),
        errorContext: (ctx, message, error) => console.error(`[ERROR] ${message}`, error)
    };
};
exports.getLogger = getLogger;
