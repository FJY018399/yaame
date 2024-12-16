/*
 * @Author: Elk
 * @Date: 2024-05-21 14:11:46
 * @FilePath: /yaame-h5/src/pages/AbundantHarvest/api.js
 */
import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";

// 兑换首页列表
export const getExchangeApi = async () => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/harvest/exchange/home');
    return http(baseUrl, "get");
}

// 兑换
export const postExchangeApi = async (params) => {
    const baseUrl = await getBaseUrl("post", '/yaame/api/h5/auth/harvest/exchange');
    return http(baseUrl, "post", params);
}

// 排行榜奖励
export const getRankingWardApi = async () => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/harvest/rank/reward');
    return http(baseUrl, "get");
}

// 排行榜数据
export const getRankingApi = async (params) => {
    let baseUrl = await getBaseUrl("get", '/yaame/api/h5/rank/simple');
    baseUrl = `${baseUrl}&${encodeURL(params)}`;
    return http(baseUrl, "get");
}

// 送礼首页信息
export const getGiftApi = async () => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/harvest/gift/home');
    return http(baseUrl, "get");
}
// 历史记录信息
export const getHistoryApi = async () => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/harvest/history');
    return http(baseUrl, "get");
}
// 抽奖页面数据
export const getLotteryApi = async () => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/harvest/lottery/home');
    return http(baseUrl, "get");
}
// 抽奖操作
export const postLotteryApi = async (params) => {
    const baseUrl = await getBaseUrl("post", '/yaame/api/h5/auth/harvest/lottery');
    return http(baseUrl, "post", params);
}

// 获取抽奖页面信息
export const getLotteryInfoApi = async (params) => {
    const baseUrl = await getBaseUrl("get", '/yaame/api/h5/auth/activity/pool_lottery/home');

    return http(`${baseUrl}&${encodeURL(params)}`, 'get');
}