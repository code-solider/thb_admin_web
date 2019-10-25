import {  fetchOrder } from '@/services/api';

export default {
    namespace: 'order',

    state: {
        list: [],
        pagination: {},
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(fetchOrder,payload);
            yield put({
                type: 'save',
                payload: response,
            });
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
    },
};
