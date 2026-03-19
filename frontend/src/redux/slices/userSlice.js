import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    wallet: { walletBalance: 0 },
    emergencyContacts: [],
    ratings: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    updateWallet: (state, action) => {
      state.wallet.walletBalance += action.payload;
    },
    setEmergencyContacts: (state, action) => {
      state.emergencyContacts = action.payload;
    },
    addEmergencyContact: (state, action) => {
      state.emergencyContacts.push(action.payload);
    },
    removeEmergencyContact: (state, action) => {
      state.emergencyContacts = state.emergencyContacts.filter(
        (_, index) => index !== action.payload
      );
    },
    setRatings: (state, action) => {
      state.ratings = action.payload;
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
  setWallet,
  updateWallet,
  setEmergencyContacts,
  addEmergencyContact,
  removeEmergencyContact,
  setRatings,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
