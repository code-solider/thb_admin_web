import { queryRule, removeRule, addRule, updateRule, getUserDataById, updateUserDataById } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    userById:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getOneUserById({ payload }, { call, put }){
      const response = yield call(getUserDataById, payload);
      yield put({
        type: 'updateUserData',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updateUserById({ payload, callback }, { call, put }){
      const response = yield call(updateUserDataById, payload);
      yield put({
        type: 'updateUserByIdR',
        payload: response,
      });
      if (callback) callback();
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateUserData(state, action){
      return {
        ...state,
        userById: action.payload,
      };
    },
    updateUserByIdR(state,{payload}){
      let newData = state.data.list.map((item)=>{
        if(item._id+''===payload._id+''){
          return payload
        }else{
          return item
        }
      })
      return {
        ...state,
        userById:{},
        data: {
          list: [...newData],
          pagination: state.data.pagination,
        }
      };
    }
  },
};
