import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import auctionReducer from '../features/auctionSlice';
import profileReducer from '../features/profileSlice';
import auth from '../services/auth';

const user = auth.getCurrentUser();
const token = auth.getAuthToken();

const preloadedState = {
  auth: {
    userLogin: {
      isLoggedIn: !!(user && token),
      user,
      token,
    },
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
    profile: profileReducer,
  },
  preloadedState,
});

export default store;
