import { NextResponse } from 'next/server';
import { RecordData, StatusMessage } from '../../../types';
import { processRecording } from '../../../lib/utils/helpers';
import { findMatches } from '../../../lib/shazam/matcher';
import DBClient from '../../../lib/db/client';
import * as spotify from '../../../lib/spotify/client';

// Constants
const SONGS_DIR = 'songs';

/**
 * Handles the socket connection
 * @returns Response
 */
export async function GET(req: Request) {
  // For WebSocket upgrade requests, don't handle them at all
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader?.toLowerCase() === 'websocket') {
    // Skip handling WebSocket connections - let Socket.io in server.js handle them
    console.log('Skipping WebSocket request in API route');
    return new Response(null, { status: 426 }); // Upgrade Required
  }

  // For regular HTTP requests, return a simple response
  return NextResponse.json({ ok: true });
}

/**
 * Handles POST requests for socket communication
 * This is a fallback for environments where WebSockets are not available
 * @param req Request object
 * @returns Response
 */
export async function POST(req: Request) {
  // For WebSocket upgrade requests, don't handle them at all
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader?.toLowerCase() === 'websocket') {
    // Skip handling WebSocket connections
    return new Response(null, { status: 426 }); // Upgrade Required
  }

  try {
    const data = await req.json();
    
    // Handle different types of requests
    if (data.type === 'recording') {
      // Process recording data
      return NextResponse.json({ status: 'processing' });
    } else if (data.type === 'download') {
      // Process download request
      return NextResponse.json({ status: 'downloading' });
    }
    
    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error handling socket POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 