import { createSlice } from '@reduxjs/toolkit';

const captainSlice = createSlice({
  name: 'captain',
  initialState: {
    profile: null,
    earnings: { totalEarnings: 0, periodEarnings: 0 },
    rides: [],
    rideStats: {},
    isOnline: false,
    location: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setEarnings: (state, action) => {
      state.earnings = action.payload;
    },
    setRides: (state, action) => {
      state.rides = action.payload;
    },
    setRideStats: (state, action) => {
      state.rideStats = action.payload;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProfile,
  setEarnings,
  setRides,
  setRideStats,
  setOnlineStatus,
  setLocation,
  setLoading,
  setError,
  clearError,
} = captainSlice.actions;

export default captainSlice.reducer;
