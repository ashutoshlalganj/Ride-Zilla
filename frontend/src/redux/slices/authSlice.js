import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    captain: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    userRole: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userRole = 'user';
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setCaptain: (state, action) => {
      state.captain = action.payload.captain;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userRole = 'captain';
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('captain', JSON.stringify(action.payload.captain));
    },
    logout: (state) => {
      state.user = null;
      state.captain = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.userRole = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('captain');
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
    restoreAuth: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const captain = localStorage.getItem('captain');

      if (accessToken && user) {
        state.user = JSON.parse(user);
        state.accessToken = accessToken;
        state.userRole = 'user';
        state.isAuthenticated = true;
      } else if (accessToken && captain) {
        state.captain = JSON.parse(captain);
        state.accessToken = accessToken;
        state.userRole = 'captain';
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  setUser,
  setCaptain,
  logout,
  setLoading,
  setError,
  clearError,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
