/*
 * @Author: ZhaoZhiqi
 * @Date: 2024-04-15 11:00:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-05 18:05:00
 * @Description: 星座活动
 * @FilePath: /yaame-h5/src/pages/constellation/api.js
 */
import http, { getBaseUrl } from "../../lib/http";
import { encodeURL } from "../../lib/utils";

/**
 * @description: 首页数据
 * @param {*} params
 * @return {*}
 */
export const getWelfareInfoAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/constellation/task");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
};

/**
 * @description: 选择当前星座
 * @param {*} params
 * @return {*}
 */
export const selectZodiacAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/constellation/zodiac");
    return http(url, "post", params);
};

/**
 * @description: 领取专属星座奖励
 * @param {*} params
 * @return {*}
 */
export const selectZodiacRewardAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/constellation/zodiac_reward");
    return http(url, "post", params);
};

/**
 * @description: 领取任务奖励
 * @param {*} params
 * @return {*}
 */
export const getTaskRewardAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/constellation/task_reward");
    return http(url, "post", params);
};
// /**
//  * @description: 排行榜
//  * @param {*} params
//  * @return {*}
//  */
// export const getRankAPI = (params) => {
//     let url = getBaseUrl("get", "/peanut/api/h5/auth/constellation/rank/details/V2");
//     return http(`${url}&${encodeURL(params)}`, "get");
// };

/**
 * @description: 房间排行榜
 * @param {*} params
 * @return {*}
 */
export const getRoomRankAPI = (params) => {
    let url = getBaseUrl("get", "/peanut/api/h5/auth/constellation/rank/room");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 星座成就查询-V2
 * @param {*} params
 * @return {*}
 */
export const getAchievementAPI = () => {
    let url = getBaseUrl("get", "/peanut/api/h5/auth/constellation/achievement/details/V2");
    return http(url, "get");
};

/**
 * @description: 12星盘内容查询
 * @param {*} params
 * @return {*}
 */
export const getDetailAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/constellation/crystal");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 水晶球奖励领取
 * @param {*} params
 * @return {*}
 */
export const getRewardAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/constellation/crystal_reward");
    return http(url, "post", params);
}

/**
 * @description: 排行榜
 * @param {*} params
 * @return {*}
 */
export const getRankAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/constellation/rank");
    return http(`${url}&${encodeURL(params)}`, "get");
}

/**
 * @description: 排行榜奖励
 * @param {*} params
 * @return {*}
 */
export const getRankReward = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/constellation/rank/reward");
    return http(`${url}&${encodeURL(params)}`, "get");
};