/*
 * @Author: Elk
 * @Date: 2024-05-27 17:12:30
 * @FilePath: /yaame-h5/src/pages/goldTurntable/api.js
 * @Description: 
 */
import http, { getBaseUrl } from "../../lib/http";
import { encodeURL } from '../../lib/utils';
import config from "../../lib/config";

// 首页信息
export const getHomeInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/coin_lottery/home");
    return http(url, "get");
};

// 抽奖
export const postLotteryApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/pool_lottery/lottery');
    return http(url, "post", params);
};

// 抽奖奖励信息
export const getLotteryHomeApi = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/pool_lottery/home');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 首页推荐用户
export const getLotteryLogApi = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/pool_lottery/log');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}