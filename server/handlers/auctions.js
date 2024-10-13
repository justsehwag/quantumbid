const Auction = require('../models/auction');

module.exports = (io, socket) => {
  // @event   auction:join
  // @access  Public
  // @desc    Let the user join specific live auction
  socket.on('auction:join', async (payload) => {
    const { _id, startTime, endTime } = await Auction.findById(
      payload.auctionId
    ).select('_id startTime endTime');

    const auctionRoom = `auction/${payload.auctionId}`;
    const today = new Date();
    if (startTime < today && today < endTime) {
      socket.join(auctionRoom);
      socket.emit('auction:joined', { _id, startTime, endTime });
    }
  });

  // @event   auction:leave
  // @access  Private
  // @desc    Disconnect from a live auction
  socket.on('auction:leave', () => {
    socket.leave();
  });
};
