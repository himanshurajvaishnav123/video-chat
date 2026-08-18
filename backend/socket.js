const socketHandler = (io) => {
  // Mapping room -> list of socket IDs
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`[Socket Connected]: ${socket.id}`);

    // User Room Join karta hai
    socket.on('join-room', ({ roomId, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      // Check max limit (2 users for peer-to-peer 1:1 call)
      if (rooms[roomId].length >= 2) {
        socket.emit('room-full');
        return;
      }

      rooms[roomId].push(socket.id);
      socket.join(roomId);

      console.log(`User ${socket.id} joined room ${roomId}`);

      // Pehle se room me jo baaki log hain unki list bhej do
      const otherUsers = rooms[roomId].filter((id) => id !== socket.id);
      socket.emit('all-users', otherUsers);
    });

    // WebRTC Signaling: Offer Send karna
    socket.on('sending-signal', ({ userToSignal, callerId, signal }) => {
      io.to(userToSignal).emit('user-joined-signal', {
        signal: signal,
        callerId: callerId,
      });
    });

    // WebRTC Signaling: Answer Returning
    socket.on('returning-signal', ({ callerId, signal }) => {
      io.to(callerId).emit('receiving-returned-signal', {
        signal: signal,
        id: socket.id,
      });
    });

    // ICE Candidate exchange
    socket.on('ice-candidate', ({ targetId, candidate }) => {
      io.to(targetId).emit('ice-candidate', {
        senderId: socket.id,
        candidate,
      });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected]: ${socket.id}`);
      
      // Clean up user from rooms
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        } else {
          // Notify remaining peer in room
          socket.to(roomId).emit('user-left', socket.id);
        }
      }
    });
  });
};

module.exports = socketHandler;