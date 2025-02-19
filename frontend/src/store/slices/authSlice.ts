import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthTokens, ApiError } from '@/types';
import api from '@/services/api';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { user: User; tokens: AuthTokens },
  { username: string; password: string },
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/token/', credentials);
    const tokens: AuthTokens = response.data;
    
    // Get user data
    const userResponse = await api.get('/users/me/', {
      headers: { Authorization: `Bearer ${tokens.access}` },
    });
    const user: User = userResponse.data;
    
    // Store tokens in localStorage
    localStorage.setItem('tokens', JSON.stringify(tokens));
    
    return { user, tokens };
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('tokens');
});

export const refreshToken = createAsyncThunk<
  AuthTokens,
  void,
  { rejectValue: ApiError }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const tokens = localStorage.getItem('tokens');
    if (!tokens) throw new Error('No refresh token found');
    
    const { refresh } = JSON.parse(tokens) as AuthTokens;
    const response = await api.post('/token/refresh/', { refresh });
    const newTokens: AuthTokens = response.data;
    
    localStorage.setItem('tokens', JSON.stringify(newTokens));
    return newTokens;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.tokens = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
