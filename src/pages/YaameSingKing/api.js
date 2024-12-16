/*
 * @Author: Elk
 * @Date: 2024-05-10 11:11:11
 * @FilePath: /yaame-h5/src/pages/YaameSingKing/api.js
 * @Description: 
 */
import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 礼物信息
 * @return {*}
 */
export const getGiftListApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/ktv/song/king/gift/info");
    return http(url, "get");
};

/**
 * @description: 排行榜
 * @return {*}
 */
export const getRankListApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/ktv/song/king/rank");
    return http(`${url}&${encodeURL(params)}`, 'get');
}

/**
 * @description: 奖品信息
 * @return {*}
 */

export const getPrizeListApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/ktv/song/king/reward/info");
    return http(url, 'get');
}

/**
 * @description: 送礼主页信息
 * @return {*}
 */

export const getSendGiftInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/ktv/song/king/send/gift/home");
    return http(url, 'get');
}

/**
 * @description: 兑换
 * @return {*}
 */

export const exchangeApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/ktv/song/king/send/gift/reward/exchange");
    return http(url, 'post', params);
}


/**
 * @description: 任务主页信息
 * @return {*}
 */

export const getTaskInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/ktv/song/king/task/home");
    return http(url, 'get');
}

/**
 * @description: 领取任务奖励
 * @return {*}
 */


export const getTaskRewardApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/ktv/song/king/task/receive");
    return http(url, 'post', params);
}