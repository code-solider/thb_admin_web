import { fetchSys, updateSys } from '@/services/api';
import { message } from 'antd';

export default {
    namespace: 'setting_thb',

    state: {},

    effects: {
        * fetch(action, { call, put }) {
            const response = yield call(fetchSys);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * updateSys({payload}, { call, put }) {
            const response = yield call(updateSys,payload);
            if(response.suncess){
                message.success(response.message);
                yield put({
                    type: 'update',
                    payload: response.data,
                });
            }else{
                message.error(response.message);
            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        update(state, { payload }){
            return {
                ...state,
                ...payload,
            };
        }
    },
};
