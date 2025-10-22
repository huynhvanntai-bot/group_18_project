import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tokenService from '../../services/tokenService';

// Thunk for login
export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const data = await tokenService.login(email, password);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Login failed');
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await tokenService.logout();
    return {};
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Logout failed');
  }
});

const initialState = {
  user: tokenService.getUser() || null,
  accessToken: tokenService.getAccessToken() || null,
  refreshToken: tokenService.getRefreshToken() || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null; state.accessToken = null; state.refreshToken = null; state.status = 'idle';
      });
  }
});

export default authSlice.reducer;
