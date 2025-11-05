import { createSlice } from '@reduxjs/toolkit';
import type{ PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: { email: string; name: string; is_admin: boolean } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),  // Load user from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;