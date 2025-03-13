import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip WebSocket upgrade requests completely
  const connection = request.headers.get('connection');
  const upgrade = request.headers.get('upgrade');
  
  if (connection?.toLowerCase().includes('upgrade') && 
      upgrade?.toLowerCase() === 'websocket') {
    // Don't process WebSocket connections at all
    return NextResponse.next();
  }

  // For all other requests, proceed normally
  return NextResponse.next();
}

// Configure the middleware to run only for socket.io paths
export const config = {
  matcher: ['/api/socket/io/:path*']
}; 