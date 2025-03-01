# Monarch

Monarch is a Next.js project built with TypeScript that aims to recreate a simplified, Shazam-like audio fingerprinting system. This project is designed as a learning tool for beginners who are just starting to code and want to explore audio processing and web development in a modern framework.

## Overview

Monarch leverages the power of modern web technologies to process audio files and perform audio recognition. At a high level, the project works by:

1. **Audio Preprocessing:**  
   - Load an audio file and decode it into raw audio data.
   - Normalize the audio and, if necessary, convert it to a single (mono) channel.

2. **Spectrogram Generation:**  
   - Transform the raw audio data into a time-frequency representation using techniques like the Short-Time Fourier Transform (STFT).
   - This step creates a spectrogram that shows how the audio's frequency content changes over time.

3. **Peak Detection:**  
   - Analyze the spectrogram to identify prominent peaks that represent key audio features.
   - These peaks serve as the building blocks for creating a unique audio fingerprint.

4. **Fingerprint Creation:**  
   - Pair detected peaks from the spectrogram to generate compact hash fingerprints.
   - These fingerprints uniquely represent segments of the audio file and can be used for matching.

5. **Indexing & Matching:**  
   - Organize the fingerprints into a searchable index.
   - When a new (query) audio sample is processed, its fingerprints are compared against the stored ones to find a match based on timing and frequency patterns.

6. **User Interface & Interaction:**  
   - Provide a clean, interactive web interface using Next.js.
   - Allow users to upload audio files, view visualizations (like spectrograms), and see matching results.

## Technology Stack

- **Next.js:** For server-side rendering and building a responsive, modern web interface.
- **TypeScript:** To ensure strong typing and maintainable, scalable code.
- **Web Audio API / Audio Libraries:** For decoding audio files and performing audio analysis.
- **Modern Frontend Tools:** For state management, responsive design, and API integration.

## How It Works (General Steps)

- **Step 1: Audio Input & Preprocessing**  
  The application accepts an audio file, decodes it to extract raw audio samples, and prepares the data by normalizing and converting it to mono if needed.

- **Step 2: Creating a Spectrogram**  
  The raw audio data is segmented into overlapping windows. Each segment is processed using a Fourier transform (after applying a window function) to create a spectrogram that shows the frequency content over time.

- **Step 3: Detecting Peaks**  
  The spectrogram is analyzed to locate the most prominent peaks in each time segment. These peaks are considered the distinctive features of the audio.

- **Step 4: Generating Fingerprints**  
  The system pairs nearby peaks to create hash fingerprints that capture the unique characteristics of the audio. These fingerprints form the basis for identifying and matching audio samples.

- **Step 5: Indexing & Matching**  
  Generated fingerprints are stored in an index. When a new audio sample is provided, its fingerprints are compared against the index. A matching algorithm votes on time offsets to determine if there is a strong match with existing data.

- **Step 6: User Feedback**  
  The web interface displays the results of the audio matching process, including visual representations of the spectrogram and detected features, along with the best match (if found).

## Getting Started

1. **Clone the Repository:**  
   Begin by cloning the Monarch repository to your local machine.

2. **Install Dependencies:**  
   Use npm or yarn to install all required packages.

3. **Run the Development Server:**  
   Start the Next.js development server to view and interact with the project.

4. **Explore and Experiment:**  
   Since you're just starting out, feel free to modify and experiment with the code. Monarch is structured to help you learn the basic concepts of audio processing and modern web development.

## Future Plans

- Enhance audio processing and fingerprint matching for improved accuracy.
- Integrate support for multiple audio formats.
- Expand the user interface to include detailed visualizations and more interactive features.
- Optimize performance using advanced techniques like WebAssembly for compute-intensive tasks.

---

Monarch is your starting point for exploring audio fingerprinting with Next.js and TypeScript. Enjoy coding and learning as you build out this exciting project!

Happy coding!
