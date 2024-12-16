/*
 * @Author: ZhaoZhiqi
 * @Date: 2024-03-22 10:16:36
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2024-03-25 14:23:34
 * @Description: 愚人节
 * @FilePath: \yaame-h5\src\pages\AprilFoolsDay\api.js
 */
import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";

/**
 * @description: 领取奖励
 * @return {*}
 */
export const receiveAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/foolsday/get_reward");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 获取首页信息
 * @return {*}
 */
export const getInfoAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/foolsday/home_info");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 获取排行榜排名信息
 * @return {*}
 */
export const getRankListAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/rank/simple");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 获取排行榜奖励信息
 * @return {*}
 */
export const getRankRewardsAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/foolsday/rank_reward");
    return http(`${url}`, "get");
};
