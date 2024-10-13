const ObjectId = require('mongoose').Types.ObjectId;
const Auction = require('../models/auction');

module.exports = (io, socket) => {
  // @event   bid:send
  // @access  Private
  // @desc    Receive bids from client and save to db
  socket.on('bid:send', async (payload) => {
    let { bidAmount, auctionId } = payload;

    bidAmount = parseInt(Number(bidAmount));
    const auctionRoom = `auction/${auctionId}`;

    if (!bidAmount) {
      return socket.emit('bid:invalid_bid', {
        success: false,
        error: 'Invalid bid amount!',
      });
    }

    const auction = await Auction.findOne({ _id: auctionId })
      .select({
        _id: 1,
        startTime: 1,
        endTime: 1,
        minimumBid: 1,
        winner: 1,
        bids: {
          $slice: -1,
        },
      })
      .populate('winner', '_id name avatar email');

    const today = new Date();
    if (today < new Date(auction.startTime)) {
      return socket.emit('bid:invalid_bid', {
        success: false,
        error: 'Auction has not started yet!',
      });
    }

    if (today > new Date(auction.endTime)) {
      socket.emit('bid:invalid_bid', {
        success: false,
        error: 'Auction has been ended!',
      });
      return io.in(auctionRoom).disconnectSockets(); // Disconnect all socket instances in auctionRoom.
    }

    const highestBidAmount = auction.bids.length ? auction.bids[0].amount : 0;
    if (auction.bids.length && highestBidAmount >= bidAmount) {
      return socket.emit('bid:invalid_bid', {
        success: false,
        error: 'You have to bid higher than the highest bid!',
      });
    }

    if (auction.bids.length === 0 && auction.minimumBid >= bidAmount) {
      return socket.emit('bid:invalid_bid', {
        success: false,
        error: 'Bid must be higher than the minimum bid!',
      });
    }

    const currentBid = {
      _id: new ObjectId(),
      bidder: {
        _id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
      amount: bidAmount,
      timestamp: new Date(),
    };

    await Auction.updateOne(
      { _id: auctionId },
      {
        $push: {
          bids: { ...currentBid, bidder: socket.user._id },
        },
      }
    );

    io.to(auctionRoom).emit('bid:receive', currentBid);
  });
};
