import {  fetchArticle, delArtById, getDetailById } from '@/services/api';

export default {
    namespace: 'message',

    state: {
        list: [],
        pagination: {},
        detailData:{}
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(fetchArticle,payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *delArtById({payload,callback}, { call, put }) {
            const response = yield call(delArtById,payload);
            yield put({
                type: 'delArtByIdR',
                payload: payload,
            });
            if(callback) callback(response);
        },
        *getDetailById({payload,callback}, { call, put }) {
            const response = yield call(getDetailById,payload);
            yield put({
                type: 'getDetailByIdR',
                payload: response.data,
            });
            if(callback) callback(response);
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload.list,
                pagination:action.payload.pagination
            };
        },
        delArtByIdR(state, {payload}){
            return {
                ...state,
                list: state.list.filter((item)=>item._id+''!==payload),
            };
        },
        getDetailByIdR(state, {payload}) {
            return {
                ...state,
                detailData: payload,
            };
        },
    },
};
