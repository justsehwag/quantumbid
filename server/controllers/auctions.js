const Auction = require('../models/auction');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { validateAuction } = require('../validations/auction');

// @route    POST /api/auction
// @desc     Create auction in the DB
// @access   Private
module.exports.createAuction = asyncHandler(async (req, res, next) => {
  const auctionPayload = { ...req.body };

  delete auctionPayload.bids;
  delete auctionPayload.winner;
  auctionPayload.seller = req.user._id;

  const { error } = await validateAuction(auctionPayload);

  if (error)
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message,
      error,
    });

  const cloudImages = [];
  for (let i = 0; i < auctionPayload.images.length; i++) {
    try {
      const image = auctionPayload.images[i];
      const result = await cloudinary.uploader.upload(image, {
        folder: `auctioneer/auctions/${auctionPayload.seller}/`,
      });
      cloudImages.push({ publicId: result.public_id, url: result.secure_url });
    } catch (error) {
      const message = 'Unable to upload images. Try again after some time!';
      next(new ErrorResponse(500, message));
    }
  }

  auctionPayload.images = cloudImages;

  const auction = new Auction(auctionPayload);
  await auction.save();

  return res.status(201).json({
    success: true,
    status: 201,
    data: {
      _id: auction._id,
      ...auctionPayload,
    },
  });
});

// @route    GET /api/auction
// @desc     Get the upcoming and live auctions
// @access   Public
module.exports.getUpcomingAuctions = asyncHandler(async (req, res, next) => {
  const auctions = await Auction.find({
    endTime: {
      $gte: new Date(),
    },
  }).select(['_id', 'itemName', 'images', 'startTime', 'endTime', 'state']);

  res.status(200).json({
    success: true,
    status: 200,
    data: auctions,
  });
});

// @route    GET /api/auction/:id
// @desc     Get the details of a specific auction
// @access   Public
module.exports.getAuctionDetails = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const auction = await Auction.findOne({ _id: id }, { bids: { $slice: -20 } })
    .populate('seller', '_id name avatar')
    .populate('winner', '_id name avatar')
    .populate('bids.bidder', '_id name avatar')
    .select('-createdAt -updatedAt -address -__v');

  if (!auction)
    return next(new ErrorResponse(404, `Auction with id ${id} not found!`));

  const hasAuctionClosed = new Date(auction.endTime) < new Date();

  if (hasAuctionClosed && !auction.winner && auction.bids.length) {
    const winner = auction.bids[auction.bids.length - 1].bidder;
    auction.winner = winner._id;
    await auction.save();
    await auction.populate('winner', '_id name avatar');
  }

  res.status(200).json({
    success: true,
    status: 200,
    data: auction,
  });
});

// @route    GET /api/auctions/myAuctions
// @desc     Get all the auctions that logged in user has started
// @access   Private
module.exports.getAuctionsByUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const auctions = await Auction.find({ seller: user._id })
    .select(['_id', 'itemName', 'images', 'startTime', 'endTime', 'state'])
    .sort({ startTime: 'desc' });

  res.status(200).json({
    success: true,
    status: 200,
    data: auctions,
  });
});

// @route    GET /api/auctions/won
// @desc     Get all the auctions that logged in user has won
// @access   Private
module.exports.getWonAuctionsByUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const auctions = await Auction.find({ winner: user._id })
    .populate('seller', '_id name avatar')
    .select('_id itemName images state startTime endTime')
    .sort({ endTime: 'desc' });

  res.status(200).json({
    success: true,
    status: 200,
    data: auctions,
  });
});

// @route    GET /api/auction/:auctionId/winner-seller-contact-details
// @desc     Get winner or seller's contact details based on requester
// @access   Private
module.exports.getWinnerSellerContactDetails = asyncHandler(
  async (req, res, next) => {
    const userId = req.user._id; // Requester id
    const auctionId = req.params.id;

    const auction = await Auction.findOne({
      _id: auctionId,
      endTime: { $lte: new Date() },
    })
      .populate({ path: 'seller', select: '_id name email mobile' })
      .populate({ path: 'winner', select: '_id name email mobile' })
      .select('_id seller winner startTime endTime');

    if (!auction) return next(new ErrorResponse(404, 'Auction not found'));
    if (!auction.winner)
      return next(new ErrorResponse(400, 'Sorry, Winner is not decided yet!'));

    const { seller, winner } = auction;
    if (!userId.equals(seller._id) && !userId.equals(winner._id)) {
      const message =
        'Sorry, but you are not the seller or the winner of this auction.';
      return next(new ErrorResponse(403, message));
    }

    const data = {};
    if (userId.equals(seller._id)) {
      data.requester = 'seller';
      data.contactDetails = auction.winner;
      data.isWinnerDetails = true;
      data.isSellerDetails = false;
    } else {
      data.requester = 'winner';
      data.contactDetails = auction.seller;
      data.isSellerDetails = true;
      data.isWinnerDetails = false;
    }

    res.status(200).json({
      success: true,
      status: 200,
      data,
    });
  }
);
