import {
  fetchCompany,
  delCompanyById,
  addCompany,
  getCompanyDetailById,
  updateCompanyById,
} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'company',

  state: {
    list: [],
    pagination: {},
    companyDrawerData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchCompany, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *delCompanyById({ payload, callback }, { call, put }) {
      const response = yield call(delCompanyById, payload);
      if (response.suncess) {
        yield put({
          type: 'delCompanyByIdR',
          payload,
        });
        if (callback) callback(response);
      }
    },
    *addCompany({ payload, callback }, { call, put }) {
      const response = yield call(addCompany, payload);
      yield put({
        type: 'addCompanyR',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchCompanyDetailById({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyDetailById, payload);
      yield put({
        type: 'fetchCompanyDetailByIdR',
        payload: response,
      });
      if (callback) callback(response);
    },
    *updateCompany({ payload, callback }, { call, put }) {
      const response = yield call(updateCompanyById, payload);
      yield put({
        type: 'updateCompanyR',
        payload: response.data,
      });
      if (callback) callback();
    },
    *downData({ payload, callback }, { call, put }) {
      let res = yield call(fetchCompany, payload);
      callback && callback(res.list);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.list,
        pagination: action.payload.pagination,
      };
    },
    delCompanyByIdR(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item._id !== payload),
      };
    },
    addCompanyR(state, { payload }) {
      return {
        ...state,
        list: [payload, ...state.list],
      };
    },
    fetchCompanyDetailByIdR(state, { payload }) {
      return {
        ...state,
        companyDrawerData: payload,
      };
    },
    updateCompanyR(state, { payload }) {
      let newData = state.list.map(item => {
        if (item._id + '' === payload._id + '') {
          return payload;
        } else {
          return item;
        }
      });
      return {
        ...state,
        list: [...newData],
      };
    },
    update(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
