const Meeting = require('../models/Meeting');

const handleVideoCall = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', async (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      // Update meeting status
      await Meeting.findOneAndUpdate(
        { roomId },
        { status: 'ongoing' }
      );

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });

    socket.on('offer', (roomId, offer) => {
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
      socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('end-meeting', async (roomId) => {
      const meeting = await Meeting.findOne({ roomId });
      if (meeting) {
        meeting.status = 'completed';
        meeting.meetingHistory.duration = Date.now() - meeting.startTime;
        await meeting.save();
      }
      
      socket.to(roomId).emit('meeting-ended');
    });
  });
};

module.exports = handleVideoCall;