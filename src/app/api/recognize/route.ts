import { NextResponse } from 'next/server';
import { processRecording } from '../../../lib/utils/helpers';
import { findMatches } from '../../../lib/shazam/matcher';
import { RecordData } from '../../../types';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert blob to buffer and then to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    // Create record data object with timestamp
    const recordData: RecordData = {
      audioData: base64Audio,
      timestamp: Date.now()
    };

    // Process the audio and find matches
    const processedAudio = await processRecording(recordData);
    const { matches } = await findMatches(processedAudio, 0, 44100); // Use default sample rate

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Error processing audio' },
      { status: 500 }
    );
  }
} 