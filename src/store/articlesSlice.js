import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api';


export const loadArticles = createAsyncThunk(
    'articles/loadArticles',
    async ({ limit = 5, offset = 0 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/articles', {
                params: {
                    limit,
                    offset
                }
            });
            const { articles, articlesCount } = response.data;
            return { articles, articlesCount };
        } catch (error) {
            return rejectWithValue('Fetching articles error');
        }
    }
);

export const loadArticleBySlug = createAsyncThunk(
    'articles/loadArticleBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await api.get(`/articles/${slug}`);
            return response.data.article;
        } catch (error) {
            return rejectWithValue('Fetching article error');
        }
    }
);

export const createArticle = createAsyncThunk(
    'articles/createArticle',
    async (articleData, {rejectWithValue}) => {
        try {
            const response = await api.post('/articles', articleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateArticle = createAsyncThunk(
    'articles/updateArticle',
    async (articleData, {rejectWithValue}) => {
        try {
            const { slug } = articleData.article
            const response = await api.put(`/articles/${slug}`, articleData)
            return response.data.article;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteArticle = createAsyncThunk(
    'articles/deleteArticle',
    async (slug, { rejectWithValue }) => {
        try {
            await api.delete(`/articles/${slug}`);
            return slug;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const likeArticle = createAsyncThunk(
    'articles/likeArticle',
    async(slug, { rejectWithValue }) => {
        try {
            const response = await api.post(`articles/${slug}/favorite`)
            return response.data.article;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const unlikeArticle = createAsyncThunk(
    'articles/unlikeArticle',
    async(slug, { rejectWithValue }) => {
        try {
            const response = await api.delete(`articles/${slug}/favorite`)
            return response.data.article;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
);

const articlesSlice = createSlice({
    name: 'articles',
    initialState: {
        articles: [],
        article: null,
        loading: false,
        error: null,
        articlesCount: 0,
    },

    reducers: { 
    },

    extraReducers: (builder) => {
        builder
            .addCase(loadArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadArticles.fulfilled, (state, action) => {
                const { articles, articlesCount } = action.payload;
                state.articles = articles;
                state.articlesCount = articlesCount
                state.loading = false;
            })
            .addCase(loadArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            
            .addCase(loadArticleBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.article = null;
            })
            .addCase(loadArticleBySlug.fulfilled, (state, action) => {
                state.article = action.payload
                state.loading = false;
            })
            .addCase(loadArticleBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.article = action.payload;
            })
            .addCase(updateArticle.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteArticle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.articles = state.articles.filter(article => article.slug !== action.payload);
                state.article = null;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(likeArticle.pending, (state) => {
            })
            .addCase(likeArticle.fulfilled, (state, action) => {
                state.loading = false;
                if (state.articles.length) {
                    state.articles = state.articles.map((article) =>
                        article.slug === action.payload.slug ? action.payload : article
                    );
                }
                if (state.article?.slug === action.payload.slug) {
                    state.article = action.payload;
                }
            })
            .addCase(likeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(unlikeArticle.pending, (state) => {
            })
            .addCase(unlikeArticle.fulfilled, (state, action) => {
                state.loading = false;
                if (state.articles.length) {
                    state.articles = state.articles.map((article) =>
                        article.slug === action.payload.slug ? action.payload : article
                    );
                }
                if (state.article?.slug === action.payload.slug) {
                    state.article = action.payload;
                }
            })
            .addCase(unlikeArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export default articlesSlice.reducer;