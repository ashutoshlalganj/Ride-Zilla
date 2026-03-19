import { createSlice } from '@reduxjs/toolkit';

const rideSlice = createSlice({
  name: 'ride',
  initialState: {
    rides: [],
    currentRide: null,
    activeRide: null,
    rideHistory: [],
    loading: false,
    error: null,
    estimatedFare: null,
    nearbyRides: [],
  },
  reducers: {
    setRides: (state, action) => {
      state.rides = action.payload;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    setActiveRide: (state, action) => {
      state.activeRide = action.payload;
    },
    updateRideStatus: (state, action) => {
      if (state.currentRide && state.currentRide._id === action.payload.rideId) {
        state.currentRide.rideStatus = action.payload.status;
      }
      if (state.activeRide && state.activeRide._id === action.payload.rideId) {
        state.activeRide.rideStatus = action.payload.status;
      }
    },
    setRideHistory: (state, action) => {
      state.rideHistory = action.payload;
    },
    setEstimatedFare: (state, action) => {
      state.estimatedFare = action.payload;
    },
    setNearbyRides: (state, action) => {
      state.nearbyRides = action.payload;
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
    clearCurrentRide: (state) => {
      state.currentRide = null;
    },
    clearActiveRide: (state) => {
      state.activeRide = null;
    },
  },
});

export const {
  setRides,
  setCurrentRide,
  setActiveRide,
  updateRideStatus,
  setRideHistory,
  setEstimatedFare,
  setNearbyRides,
  setLoading,
  setError,
  clearError,
  clearCurrentRide,
  clearActiveRide,
} = rideSlice.actions;

export default rideSlice.reducer;
