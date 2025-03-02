// Socket.io event handlers
// This is a simplified version for demonstration purposes
// You'll need to adapt this to your actual project structure

/**
 * Initialize Socket.io event handlers
 * @param {import('socket.io').Server} io - Socket.io server instance
 */
function initSocketHandlers(io) {
  console.log('Initializing Socket.io handlers');

  // Handle middleware errors
  io.engine.on('connection_error', (err) => {
    console.error('Connection error:', err);
  });

  // Log all socket.io events for debugging
  const wrap = middleware => (socket, next) => middleware(socket, next);
  
  io.use(wrap((socket, next) => {
    console.log(`[${new Date().toISOString()}] Socket middleware: ${socket.id}`);
    next();
  }));

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id} from ${socket.handshake.address}`);
    console.log(`Transport: ${socket.conn.transport.name}`);

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });

    // Handle total songs request
    socket.on('totalSongs', async () => {
      try {
        console.log(`Total songs request from ${socket.id}`);
        // Simplified for demonstration
        socket.emit('totalSongs', 0);
      } catch (error) {
        console.error(`Error getting total songs for ${socket.id}:`, error);
        socket.emit('error', { message: 'Failed to get total songs' });
      }
    });

    // Handle song download request
    socket.on('newDownload', async (spotifyURL) => {
      try {
        console.log(`Download request from ${socket.id}: ${spotifyURL}`);
        // Simplified for demonstration
        const statusMsg = {
          type: 'info',
          message: 'Download functionality is being set up.'
        };
        
        socket.emit('downloadStatus', JSON.stringify(statusMsg));
      } catch (error) {
        console.error(`Error handling download for ${socket.id}:`, error);
        socket.emit('error', { message: 'Failed to process download' });
      }
    });

    // Handle recording request
    socket.on('newRecording', async (recordData) => {
      try {
        console.log(`Recording received from ${socket.id}`);
        // Simplified for demonstration
        const matchesToSend = [];
        socket.emit('matches', JSON.stringify(matchesToSend));
      } catch (error) {
        console.error(`Error handling recording for ${socket.id}:`, error);
        socket.emit('error', { message: 'Failed to process recording' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
}

module.exports = { initSocketHandlers }; 