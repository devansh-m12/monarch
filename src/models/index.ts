import mongoose, { Schema, Document } from 'mongoose';

// Song model
export interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  youtubeId?: string;
  songKey: string;
  createdAt: Date;
}

const SongSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  duration: { type: Number, required: true },
  youtubeId: { type: String },
  songKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Fingerprint model
export interface IFingerprint extends Document {
  hash: string;
  songId: mongoose.Types.ObjectId;
  offset: number;
}

const FingerprintSchema: Schema = new Schema({
  hash: { type: String, required: true },
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  offset: { type: Number, required: true }
});

// Create compound index for faster lookups
FingerprintSchema.index({ hash: 1, songId: 1 });

// Export models
export const Song = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
export const Fingerprint = mongoose.models.Fingerprint || mongoose.model<IFingerprint>('Fingerprint', FingerprintSchema); 