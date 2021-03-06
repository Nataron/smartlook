/************************************************************\
* POZOR: Tento soubor obsahuje CITLIVE INFORMACE             *
* CAUTION: This file contains SENSITIVE INFORMATION          *
* Author: jcmiel                                             *
\************************************************************/

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { takeLatest, call, put,  } from 'redux-saga/effects';
import axios from 'axios';

import { transformIntoNormalizedVersion } from '~frontendDucks/ducksUtils';

import { Users, apiGetUsers } from './usersInterfaces';


const initialState: Users = {
    users: {
        ids: [],
        byId: {}
    },
    loading: false,
    error: null,
    selectedUser: null,
};

const users = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUsersRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getUsersSuccess(state, action:  PayloadAction<apiGetUsers>) {
            state.loading = false;
            state.error = null;
            state.users = transformIntoNormalizedVersion(action.payload);
            state.selectedUser = action.payload[0].id;
        },
        getUsersError(state, action:  PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setSelectedUser(state, action:  PayloadAction<number>) {
            state.selectedUser = action.payload;
        },
    }
});

export const {
    getUsersRequest,
    getUsersSuccess,
    getUsersError,
    setSelectedUser
} = users.actions;
export default users.reducer;

// API endpoints
const callGetUsers = async () =>
    axios.get('https://jsonplaceholder.typicode.com/users');


// side effects
const workerGetUsers = function* () {
    try {
        const { data } = yield call(callGetUsers);
        yield put(getUsersSuccess(data));
    } catch (error) {
        yield put(getUsersError(error));
    }
};

export const sagas = [
    takeLatest(getUsersRequest, workerGetUsers)
];
