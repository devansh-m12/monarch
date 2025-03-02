# MONARCH - Audio Recognition

MONARCH is a modern audio recognition application that allows users to identify songs by listening to audio from their microphone or device. It uses audio fingerprinting technology to match audio samples against a database of songs.

## Features

- **Audio Recognition**: Identify songs by listening to audio from your microphone or device
- **Spotify Integration**: Download songs, albums, and playlists from Spotify
- **Real-time Matching**: Get instant results as you listen
- **YouTube Links**: Access matched songs on YouTube
- **Responsive Design**: Works on both desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Socket.IO
- **Database**: MongoDB
- **Audio Processing**: Web Audio API, MediaRecorder API
- **Fingerprinting**: Custom audio fingerprinting algorithm

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Spotify API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/monarch.git
   cd monarch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Identify a Song**: Click the "Listen" button and allow microphone access or screen audio sharing.
2. **Add Songs to Database**: Enter a Spotify URL (track, album, or playlist) in the input field and click "Download".
3. **View Matches**: Matched songs will appear in the carousel with their title, artist, and match score.

## How It Works

MONARCH uses a custom audio fingerprinting algorithm to identify songs:

1. Audio is captured from the microphone or device
2. The audio is processed to generate a spectrogram
3. Peak points in the spectrogram are identified
4. Fingerprints are generated from these peak points
5. The fingerprints are matched against the database
6. The best matches are returned to the user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the Shazam audio recognition algorithm
- Built with Next.js and React
- Styled with Tailwind CSS

