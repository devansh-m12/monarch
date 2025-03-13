import { NextResponse } from 'next/server';
import DBClient from '../../../../lib/db/client';
import * as spotify from '../../../../lib/spotify/client';
import { getLogger } from '../../../../lib/utils/helpers';

const logger = getLogger();

export async function POST(request: Request) {
  try {
    logger.info('Processing song add request');
    const { url } = await request.json();

    if (!url) {
      logger.error('No URL provided in request');
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    if (!url.includes('spotify.com')) {
      logger.error(`Invalid Spotify URL provided: ${url}`);
      return NextResponse.json(
        { error: 'Invalid Spotify URL' },
        { status: 400 }
      );
    }

    logger.info(`Downloading song from Spotify URL: ${url}`);
    const songData = await spotify.downloadSong(url);
    
    logger.info(`Saving song to database: ${songData.title}`);
    await DBClient.insertSong(songData);
    
    logger.info('Getting updated song count');
    const totalSongs = await DBClient.countSongs();

    logger.info(`Successfully added song. Total songs: ${totalSongs}`);
    return NextResponse.json({ 
      success: true,
      totalSongs,
      song: {
        title: songData.title,
        artist: songData.artist
      }
    });
  } catch (error) {
    logger.error('Error adding song:', error);
    return NextResponse.json(
      { error: 'Error adding song' },
      { status: 500 }
    );
  }
} 