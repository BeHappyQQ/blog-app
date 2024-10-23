import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";


export const fetchUserByToken = createAsyncThunk(
    'auth/fetchUserByToken',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/user');
        const { user } = response.data
        return user;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (userData, { rejectWithValue }) => {
      try {
        const response = await api.post('/users', userData); 
        const { user } = response.data;
  
        localStorage.setItem('token', user.token);
        return user;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

export const signInUser = createAsyncThunk(
    'auth/signInUser',
    async (credentials, {rejectWithValue}) => {
        try {
            const response = await api.post('/users/login', credentials);
            const { user } = response.data;

            localStorage.setItem('token', user.token);
            return user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (profileData, { rejectWithValue }) => {
      try {
        const response = await api.put('/user', profileData);
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );



const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: null,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            // Регистрация
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = false
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = localStorage.getItem('token');
              })
              .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
        
              // Вход
              .addCase(signInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = localStorage.getItem('token');
              })
              .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })    

              // Обновление профиля
              .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
              })
              .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              // Проверка на входе 
              .addCase(fetchUserByToken.pending, (state) => {
                state.loading = true;
                state.error = false;
              })
              .addCase(fetchUserByToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = false;
              })
              .addCase(fetchUserByToken.rejected, (state) => {
                state.loading = false;
                logout(); 
              })

          },
        });
        
export const { logout } = authSlice.actions;
export default authSlice.reducer;