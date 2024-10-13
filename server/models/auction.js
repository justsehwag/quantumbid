const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const auctionSchema = new Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Please provide a name'],
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      minLength: 8,
      maxLength: 2048,
      trim: true,
    },
    minimumBid: {
      type: Number,
      default: 0,
    },
    images: {
      type: [
        {
          publicId: {
            type: String,
            required: [true, 'Public id is required!'],
          },
          url: {
            type: String,
            required: [true, 'Image url is required!'],
          },
        },
      ],
      required: true,
    },
    seller: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'Seller can not be empty!'],
    },
    address: {
      type: String,
      maxLength: 256,
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide your state!'],
    },
    startTime: {
      type: Date,
      required: [true, 'Starting date time can not be empty!'],
    },
    endTime: {
      type: Date,
      required: [true, 'Ending date time can not be empty!'],
    },
    bids: {
      type: [
        {
          bidder: { type: ObjectId, ref: 'User', required: true },
          timestamp: { type: Date, required: [true, 'Bid time is required'] },
          amount: { type: Number },
        },
      ],
      default: null,
    },
    winner: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
