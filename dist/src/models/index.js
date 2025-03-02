"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fingerprint = exports.Song = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SongSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    duration: { type: Number, required: true },
    youtubeId: { type: String },
    songKey: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
const FingerprintSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    songId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Song', required: true },
    offset: { type: Number, required: true }
});
// Create compound index for faster lookups
FingerprintSchema.index({ hash: 1, songId: 1 });
// Export models
exports.Song = mongoose_1.default.models.Song || mongoose_1.default.model('Song', SongSchema);
exports.Fingerprint = mongoose_1.default.models.Fingerprint || mongoose_1.default.model('Fingerprint', FingerprintSchema);
