/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-10-26 15:10:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-27 17:12:40
 * @Description:
 * @FilePath: /yaame-h5/src/pages/EidLuckyDraw/api.js
 */
import http, { getBaseUrl } from "../../lib/http";

export const getEidInfo = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/happy_lottery/home");
    return http(url, "get");
};
/**
 * @description: 抽奖奖品接口
 * @return {*}
 */
export const getLotteryDataApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pool_lottery/home");
    url += '&activity_type=' + 'HAPPY_LOTTERY';
    return http(url, "get");
};

// 抽奖操作
export const postPolLotteryApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/pool_lottery/lottery');
    return http(url, "post", params);
};

// 抽奖日志
export const getLotteryLogApi = async (lottery_strategy_type) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pool_lottery/log");
    url += '&activity_type=' + 'HAPPY_LOTTERY';
    url += '&lottery_strategy_type=' + lottery_strategy_type;
    return http(url, "get");
};
