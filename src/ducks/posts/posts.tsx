/************************************************************\
* POZOR: Tento soubor obsahuje CITLIVE INFORMACE             *
* CAUTION: This file contains SENSITIVE INFORMATION          *
* Author: jcmiel                                             *
\************************************************************/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put,  } from 'redux-saga/effects';
import axios from 'axios';

import { transformIntoNormalizedVersion } from '~frontendDucks/ducksUtils';

import { Posts, apiGetPosts } from './postsInterfaces';


const initialState: Posts = {
    posts: {
        ids: [],
        byId: {}
    },
    loading: false,
    error: null,
    selectedPost: null,
};

const posts = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        getPostsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getPostsSuccess(state, action:  PayloadAction<apiGetPosts>) {
            state.loading = false;
            state.error = null;
            state.posts = transformIntoNormalizedVersion(action.payload);
            state.selectedPost = action.payload[0].id;
        },
        getPostsError(state, action:  PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedPost(state, action:  PayloadAction<number>) {
            state.selectedPost = action.payload;
        },
    }
});

export const {
    getPostsRequest,
    getPostsSuccess,
    getPostsError,
    setSelectedPost
} = posts.actions;
export default posts.reducer;

// API endpoints
const callGetPosts = async () =>
    axios.get('https://jsonplaceholder.typicode.com/posts'); // Optimalization, get few posts at a time, get more if user is scrolling


// side effects
const workerGetPosts = function* () {
    try {
        const { data } = yield call(callGetPosts);
        yield put(getPostsSuccess(data));
    } catch (error) {
        yield put(getPostsError(error));
    }
};

export const sagas = [
    takeLatest(getPostsRequest, workerGetPosts)
];
