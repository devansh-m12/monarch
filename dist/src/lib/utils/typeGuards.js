"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isISong = isISong;
exports.hasObjectId = hasObjectId;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Type guard to check if an object is an ISong
 * @param obj Object to check
 * @returns True if the object is an ISong
 */
function isISong(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        '_id' in obj &&
        obj._id instanceof mongoose_1.default.Types.ObjectId &&
        'title' in obj &&
        typeof obj.title === 'string' &&
        'artist' in obj &&
        typeof obj.artist === 'string' &&
        'songKey' in obj &&
        typeof obj.songKey === 'string');
}
/**
 * Type guard to check if an object has a MongoDB ObjectId
 * @param obj Object to check
 * @returns True if the object has a valid _id property
 */
function hasObjectId(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        '_id' in obj &&
        obj._id instanceof mongoose_1.default.Types.ObjectId);
}
