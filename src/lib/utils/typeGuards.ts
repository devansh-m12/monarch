import { ISong } from '../../models';
import mongoose from 'mongoose';

/**
 * Type guard to check if an object is an ISong
 * @param obj Object to check
 * @returns True if the object is an ISong
 */
export function isISong(obj: unknown): obj is ISong {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '_id' in obj &&
    obj._id instanceof mongoose.Types.ObjectId &&
    'title' in obj &&
    typeof (obj as Record<string, unknown>).title === 'string' &&
    'artist' in obj &&
    typeof (obj as Record<string, unknown>).artist === 'string' &&
    'songKey' in obj &&
    typeof (obj as Record<string, unknown>).songKey === 'string'
  );
}

/**
 * Type guard to check if an object has a MongoDB ObjectId
 * @param obj Object to check
 * @returns True if the object has a valid _id property
 */
export function hasObjectId(obj: unknown): obj is { _id: mongoose.Types.ObjectId } {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    '_id' in obj &&
    (obj as Record<string, unknown>)._id instanceof mongoose.Types.ObjectId
  );
} 