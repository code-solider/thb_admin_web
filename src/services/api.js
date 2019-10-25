import { stringify } from 'qs';
import request, { getAuth, loginIn } from '@/utils/request';

export async function fakeAccountLogin(params) {
    return request('/admin/login', {
        method: 'get',
        headers: { 'Authorization': await getAuth('/admin/login', params.userName, params.password) },
    }).then(data => {
        if(data!==undefined){
            loginIn(params.userName, params.password);
            return {
                currentAuthority: 'admin',
                status: 'ok',
                type: 'account',
            };
        }else{
            return {
                status: 'error',
                type:'account',
                currentAuthority: 'guest',
            }
        }
    });
}

export async function queryProjectNotice() {
    return request('/api/project/notice');
}

export async function queryActivities() {
    return request('/api/activities');
}

export async function queryRule(query) {
    return request(`/admin/user/list`, {
        method: 'post',
        data:query,
        headers: { 'Authorization': await getAuth('/admin/user/list')}
    }).then(data=>data.data)
}

export async function getDetailById(id) {
    return request(`/art/detail/${id}`, {
        method: `get`
    }).then(data=>data)
}

export async function fetchOrder(payload) {
    return request(`/order`, {
        method: 'post',
        data:payload,
        headers: { 'Authorization': await getAuth('/order')}
    }).then(data=>data.data)
}

export async function getUserDataById(params) {
    return request(`/user/${params}`, {method: 'get'}).then(data=>data.data)
}

export async function updateUserDataById(payload) {
    return request(`/user`, {method: 'put',data:payload,headers: { 'Authorization': await getAuth('/user')}}).then(data=>data.data)
}

export async function fetchArticle(payload) {
    return request(`/art/list`, { method: 'post', data:payload }).then(data=>data.data)
}

export async function fetchCompany(payload) {
    return request(`/company/find`, { method: 'post', data:payload }).then(data=>data.data)
}

export async function getCompanyDetailById(id) {
    return request(`/company/${id}`, { method: 'get'}).then(data=>data.data)
}

export async function delCompanyById(id) {
    return request(`/company/${id}`, {method: 'delete',headers: { 'Authorization': await getAuth(`/company/${id}`)}}).then(data=>data)
}

export async function updateCompanyById(payload) {
    return request(`/company`, {method: 'post',data:payload,headers: { 'Authorization': await getAuth(`/company`)}}).then(data=>data)
}

export async function delArtById(id) {
    return request(`/art/${id}`, {method: 'delete',headers: { 'Authorization': await getAuth(`/art/${id}`)}}).then(data=>data)
}

export async function addCompany(payload) {
    return request(`/company/reg`, { method: 'post', data:payload }).then(data=>data.data)
}

export async function fetchSys() {
    return request(`/sys`, { method: 'get'}).then(data=>data.data)
}

export async function updateSys(payload) {
    return request(`/sys`, { method: 'put',data:payload, headers: { 'Authorization': await getAuth('/sys')} }).then(data=>data)
}

export async function postImg(payload) {
    return request(`/files`, { method: 'post',data:payload}).then(data=>data)
}

export async function removeRule(params) {
    return request('/api/rule', {
        method: 'POST',
        data: {
            ...params,
            method: 'delete',
        },
    });
}

export async function addRule(params) {
    return request('/api/rule', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

export async function updateRule(params = {}) {
    return request(`/api/rule?${stringify(params.query)}`, {
        method: 'POST',
        data: {
            ...params.body,
            method: 'update',
        },
    });
}

export async function fakeSubmitForm(params) {
    return request('/api/forms', {
        method: 'POST',
        data: params,
    });
}

export async function fakeChartData() {
    return request('/api/fake_chart_data');
}

export async function queryTags() {
    return request('/api/tags');
}

export async function queryBasicProfile(id) {
    return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
    return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
    return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        data: {
            ...restParams,
            method: 'delete',
        },
    });
}

export async function addFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        data: {
            ...restParams,
            method: 'post',
        },
    });
}

export async function updateFakeList(params) {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
        method: 'POST',
        data: {
            ...restParams,
            method: 'update',
        },
    });
}

export async function fakeRegister(params) {
    return request('/api/register', {
        method: 'POST',
        data: params,
    });
}

export async function queryNotices(params = {}) {
    return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
    return request(`/api/captcha?mobile=${mobile}`);
}
