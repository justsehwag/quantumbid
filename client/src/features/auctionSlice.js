import {
  createSlice,
  createAsyncThunk,
  combineReducers,
  createAction,
} from '@reduxjs/toolkit';
import http from '../services/http';
import { socket } from '../services/socket';

const initialCreateAuctionState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const createAuction = createAsyncThunk(
  'auction/create',
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await http.post('/auction', payload);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const createAuctionSlice = createSlice({
  name: 'auction/create',
  initialState: initialCreateAuctionState,
  extraReducers: (builder) => {
    builder.addCase(createAuction.pending, (auction, action) => {
      auction.loading = true;
      auction.error = null;
    });

    builder.addCase(createAuction.fulfilled, (auction, action) => {
      auction.loading = false;
      auction.success = true;
      auction.data = action.payload.data;
    });

    builder.addCase(createAuction.rejected, (auction, action) => {
      auction.loading = false;
      auction.success = false;
      auction.error = action.payload;
    });
  },
});

const initialAuctionsState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const getAuctions = createAsyncThunk(
  'auctions/fetch',
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await http.get('/auction');
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const getAuctionsSlice = createSlice({
  name: 'auctions/fetch',
  initialState: initialAuctionsState,
  extraReducers: (builder) => {
    builder.addCase(getAuctions.pending, (auction, action) => {
      auction.loading = true;
      auction.error = null;
    });

    builder.addCase(getAuctions.fulfilled, (auction, action) => {
      auction.loading = false;
      auction.success = true;
      auction.data = action.payload.data;
    });

    builder.addCase(getAuctions.rejected, (auction, action) => {
      auction.loading = false;
      auction.success = false;
      auction.error = action.payload;
    });
  },
});

const initialAuctionState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const bidReceived = createAction('auction/bidReceived');
const sendBid = createAction('auction/bidSent');

const getAuctionDetails = createAsyncThunk(
  'auction/fetch',
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await http.get(`/auction/${payload.id}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const getAuctionSlice = createSlice({
  name: 'auction/fetch',
  initialState: initialAuctionState,
  extraReducers: (builder) => {
    builder.addCase(getAuctionDetails.pending, (auction, action) => {
      auction.loading = true;
      auction.error = null;
    });

    builder.addCase(getAuctionDetails.fulfilled, (auction, action) => {
      auction.loading = false;
      auction.success = true;
      auction.data = action.payload.data;
    });

    builder.addCase(getAuctionDetails.rejected, (auction, action) => {
      auction.loading = false;
      auction.success = false;
      auction.error = action.payload;
    });

    builder.addCase(bidReceived.type, (auction, action) => {
      const notificationSound = new Audio('/assets/audios/notification.mp3');
      notificationSound.play();

      const bids = auction.data.bids;
      if (bids.length >= 20) bids.shift();
      bids.push(action.payload.bid);
    });

    builder.addCase(sendBid.type, (auction, action) => {
      socket.emit('bid:send', action.payload);
    });
  },
});

const initialWinnerSellerDetailsState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const getWinnerSellerDetails = createAsyncThunk(
  'auction/winnerSellerDetails',
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const url = `/auction/${payload.auctionId}/winner-seller-contact-details`;
      const { data } = await http.get(url);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const getWinnerSellerDetailsSlice = createSlice({
  name: 'auction/winnerSellerDetails',
  initialState: initialWinnerSellerDetailsState,
  reducers: {
    resetWinnerSellerDetails() {
      return initialWinnerSellerDetailsState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWinnerSellerDetails.pending, (auction, action) => {
      auction.loading = true;
      auction.error = null;
    });

    builder.addCase(getWinnerSellerDetails.fulfilled, (auction, action) => {
      auction.loading = false;
      auction.success = true;
      auction.data = action.payload.data;
    });

    builder.addCase(getWinnerSellerDetails.rejected, (auction, action) => {
      auction.loading = false;
      auction.success = false;
      auction.error = action.payload;
    });
  },
});

export default combineReducers({
  createAuction: createAuctionSlice.reducer,
  auctions: getAuctionsSlice.reducer,
  auction: getAuctionSlice.reducer,
  winnerSellerDetails: getWinnerSellerDetailsSlice.reducer,
});

export {
  createAuction,
  getAuctions,
  getAuctionDetails,
  bidReceived,
  sendBid,
  getWinnerSellerDetails,
};

export const { resetWinnerSellerDetails } = getWinnerSellerDetailsSlice.actions;

// Selectors
export const getHighestBid = (state) => {
  const bids = state.auction.auction.data?.bids;

  if (!bids || !bids.length) return 0;

  return bids[bids.length - 1].amount;
};

export const selectAuctionData = (state) => {
  return state.auction.auction.data;
};

export const selectWinnerSellerDetails = (state) => {
  return state.auction.winnerSellerDetails;
};
