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
const models_1 = require("../../models");
const mongodb_1 = __importDefault(require("./mongodb"));
const helpers_1 = require("../utils/helpers");
class DBClient {
    constructor() {
        // Connect to the database
        (0, mongodb_1.default)();
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            // This is a no-op in Next.js since we're using a cached connection
            return;
        });
    }
    saveSong(title, artist, album, duration, youtubeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const songKey = (0, helpers_1.generateSongKey)(title, artist);
            const song = new models_1.Song({
                title,
                artist,
                album,
                duration,
                youtubeId,
                songKey
            });
            return yield song.save();
        });
    }
    saveFingerprints(fingerprints, songId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fingerprintDocs = fingerprints.map(fp => ({
                hash: fp.hash,
                songId,
                offset: fp.offset
            }));
            yield models_1.Fingerprint.insertMany(fingerprintDocs);
        });
    }
    getMatchingFingerprints(hashes) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Fingerprint.find({ hash: { $in: hashes } }).exec();
        });
    }
    getSongById(songId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Song.findById(songId).exec();
        });
    }
    getSongByKey(songKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const song = yield models_1.Song.findOne({ songKey }).exec();
                return { song, exists: !!song, error: null };
            }
            catch (error) {
                return { song: null, exists: false, error: error };
            }
        });
    }
    totalSongs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Song.countDocuments().exec();
        });
    }
    deleteCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (collectionName === 'songs') {
                yield models_1.Song.deleteMany({}).exec();
            }
            else if (collectionName === 'fingerprints') {
                yield models_1.Fingerprint.deleteMany({}).exec();
            }
        });
    }
}
exports.default = DBClient;
