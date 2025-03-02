"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprintAudio = exports.generateSpectrogram = exports.generateFingerprints = exports.findPeaks = exports.generateHash = void 0;
// Constants for fingerprinting
const DEFAULT_FAN_VALUE = 15;
const DEFAULT_MIN_HASH_TIME_DELTA = 0;
const DEFAULT_MAX_HASH_TIME_DELTA = 200;
const DEFAULT_SAMPLE_RATE = 44100;
const DEFAULT_WINDOW_SIZE = 4096;
const DEFAULT_AMPLITUDE_THRESHOLD = 10;
const DEFAULT_PEAK_NEIGHBORHOOD_SIZE = 20;
/**
 * Generates a fingerprint hash from a set of frequencies and their time
 * @param frequencies Array of frequency points
 * @param times Array of time points
 * @returns Hash string
 */
const generateHash = (frequencies, times) => {
    // Simple hash function for demonstration
    // In a real implementation, this would be more sophisticated
    return frequencies.map((f, i) => `${f}|${times[i]}`).join(',');
};
exports.generateHash = generateHash;
/**
 * Finds peaks in the spectrogram
 * @param spectrogram 2D array representing the spectrogram
 * @param ampThreshold Amplitude threshold for peak detection
 * @param peakNeighborhoodSize Size of the neighborhood for peak detection
 * @returns Array of [frequency, time] pairs
 */
const findPeaks = (spectrogram, ampThreshold = DEFAULT_AMPLITUDE_THRESHOLD, peakNeighborhoodSize = DEFAULT_PEAK_NEIGHBORHOOD_SIZE) => {
    const peaks = [];
    // Iterate through the spectrogram to find peaks
    for (let timeIdx = 0; timeIdx < spectrogram.length; timeIdx++) {
        for (let freqIdx = 0; freqIdx < spectrogram[timeIdx].length; freqIdx++) {
            const amplitude = spectrogram[timeIdx][freqIdx];
            // Check if the amplitude is above the threshold
            if (amplitude < ampThreshold) {
                continue;
            }
            // Check if it's a peak in its neighborhood
            let isPeak = true;
            // Define the neighborhood boundaries
            const freqStart = Math.max(0, freqIdx - peakNeighborhoodSize);
            const freqEnd = Math.min(spectrogram[timeIdx].length - 1, freqIdx + peakNeighborhoodSize);
            const timeStart = Math.max(0, timeIdx - peakNeighborhoodSize);
            const timeEnd = Math.min(spectrogram.length - 1, timeIdx + peakNeighborhoodSize);
            // Check if it's a peak in the frequency dimension
            for (let f = freqStart; f <= freqEnd; f++) {
                if (f === freqIdx)
                    continue;
                if (spectrogram[timeIdx][f] > amplitude) {
                    isPeak = false;
                    break;
                }
            }
            if (!isPeak)
                continue;
            // Check if it's a peak in the time dimension
            for (let t = timeStart; t <= timeEnd; t++) {
                if (t === timeIdx)
                    continue;
                if (spectrogram[t][freqIdx] > amplitude) {
                    isPeak = false;
                    break;
                }
            }
            if (isPeak) {
                peaks.push([freqIdx, timeIdx]);
            }
        }
    }
    return peaks;
};
exports.findPeaks = findPeaks;
/**
 * Generates fingerprints from peaks
 * @param peaks Array of [frequency, time] pairs
 * @param fanValue Number of pairs to generate for each anchor point
 * @param minHashTimeDelta Minimum time delta for hash generation
 * @param maxHashTimeDelta Maximum time delta for hash generation
 * @returns Array of fingerprints with their time offsets
 */
const generateFingerprints = (peaks, fanValue = DEFAULT_FAN_VALUE, minHashTimeDelta = DEFAULT_MIN_HASH_TIME_DELTA, maxHashTimeDelta = DEFAULT_MAX_HASH_TIME_DELTA) => {
    const fingerprints = [];
    // For each peak, generate a fingerprint with nearby peaks
    for (let i = 0; i < peaks.length; i++) {
        const [anchorFreq, anchorTime] = peaks[i];
        // Look at the next fanValue peaks
        for (let j = 1; j < fanValue && i + j < peaks.length; j++) {
            const [pointFreq, pointTime] = peaks[i + j];
            const timeDelta = pointTime - anchorTime;
            // Check if the time delta is within the allowed range
            if (timeDelta >= minHashTimeDelta && timeDelta <= maxHashTimeDelta) {
                // Generate a hash from the anchor and point frequencies and the time delta
                const hash = `${anchorFreq}|${pointFreq}|${timeDelta}`;
                // Add the fingerprint with its time offset
                fingerprints.push({
                    hash,
                    offset: anchorTime
                });
            }
        }
    }
    return fingerprints;
};
exports.generateFingerprints = generateFingerprints;
/**
 * Generates a spectrogram from audio samples
 * @param samples Audio samples
 * @param windowSize Size of the FFT window
 * @returns 2D array representing the spectrogram
 */
const generateSpectrogram = (samples, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_sampleRate = DEFAULT_SAMPLE_RATE, windowSize = DEFAULT_WINDOW_SIZE) => {
    // This is a simplified implementation
    // In a real implementation, you would use the Web Audio API or a DSP library
    const spectrogram = [];
    const hopSize = windowSize / 2; // 50% overlap
    for (let i = 0; i < samples.length - windowSize; i += hopSize) {
        const window = samples.slice(i, i + windowSize);
        // Apply a window function (e.g., Hann window)
        const windowedSamples = applyHannWindow(window);
        // Perform FFT (simplified)
        const fft = simulateFFT(windowedSamples);
        // Add the magnitude spectrum to the spectrogram
        spectrogram.push(fft);
    }
    return spectrogram;
};
exports.generateSpectrogram = generateSpectrogram;
/**
 * Applies a Hann window to the samples
 * @param samples Audio samples
 * @returns Windowed samples
 */
const applyHannWindow = (samples) => {
    const windowedSamples = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
        const windowValue = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (samples.length - 1)));
        windowedSamples[i] = samples[i] * windowValue;
    }
    return windowedSamples;
};
/**
 * Simulates an FFT operation (simplified)
 * @param samples Audio samples
 * @returns Magnitude spectrum
 */
const simulateFFT = (samples) => {
    // This is a very simplified simulation of an FFT
    // In a real implementation, you would use a proper FFT algorithm
    const spectrum = [];
    const numBins = samples.length / 2;
    for (let i = 0; i < numBins; i++) {
        // Generate some random values for demonstration
        // In a real implementation, this would be the actual FFT calculation
        const magnitude = Math.abs(samples[i * 2]) + Math.abs(samples[i * 2 + 1]);
        spectrum.push(magnitude);
    }
    return spectrum;
};
/**
 * Processes audio samples to generate fingerprints
 * @param samples Audio samples
 * @param sampleRate Sample rate of the audio
 * @returns Array of fingerprints with their time offsets
 */
const fingerprintAudio = (samples, sampleRate = DEFAULT_SAMPLE_RATE) => {
    // Generate spectrogram
    const spectrogram = (0, exports.generateSpectrogram)(samples, sampleRate);
    // Find peaks in the spectrogram
    const peaks = (0, exports.findPeaks)(spectrogram);
    // Generate fingerprints from the peaks
    const fingerprints = (0, exports.generateFingerprints)(peaks);
    return fingerprints;
};
exports.fingerprintAudio = fingerprintAudio;
