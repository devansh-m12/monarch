const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const path = require('path');
// Import the socket handlers from the compiled TypeScript
const { initSocketHandlers } = require('./dist/lib/socket');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Global error handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Keep the process running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Special handling for socket.io requests
    const parsedUrl = parse(req.url, true);
    
    // Skip handling for socket.io paths - let socket.io handle them
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/api/socket/io')) {
      // Let socket.io handle these requests
      return;
    }
    
    // Handle Next.js requests
    handle(req, res, parsedUrl).catch((err) => {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });

  // Create Socket.io server
  const io = new Server(server, {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    // Add these options to fix the WebSocket connection issues
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Initialize Socket.io handlers
  initSocketHandlers(io);
  console.log('Socket.io handlers initialized');

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
}); 