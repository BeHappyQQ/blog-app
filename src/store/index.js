import { configureStore } from "@reduxjs/toolkit";
import articleReducer from './articlesSlice';
import authReducer from './authSlice';

export default configureStore({
    reducer: {
        articles: articleReducer,
        auth: authReducer,
    },
})
