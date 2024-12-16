import http, { getBaseUrl } from "../../lib/http";
import { encodeURL } from '../../lib/utils';
import config from "../../lib/config";

// 首页信息
export const getHomeInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/be_serious/home_info");
    return http(url, "get");
};

// 邀请
export const postInviteApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/be_serious/invite');
    return http(url, "post", params);
};

// 搜索单个用户
export const getSearch = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/be_serious/search');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 首页推荐用户
export const getSuggestList = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/be_serious/suggest_list');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}
// 排行榜信息
export const getRankInfotList = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/be_serious/rank_info');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 删除
export const getRemove = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/be_serious/remove');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 查询当个用户信息
export const postUserDetailApi = async (data) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/be_serious/user_detail');
    return http(url, "post", data);
};