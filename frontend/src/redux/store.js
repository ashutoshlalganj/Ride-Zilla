import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import rideReducer from './slices/rideSlice';
import userReducer from './slices/userSlice';
import captainReducer from './slices/captainSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    user: userReducer,
    captain: captainReducer,
  },
});

export default store;
