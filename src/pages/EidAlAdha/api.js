import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 祈福页面信息
 * @return {*}
 */
export const getBlessingInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/infos");
    return http(url, "get");
};
/**
 * @description: 主页信息
 * @return {*}
 */

export const getHomeInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/home");
    return http(url, "get");
}


/**
 * @description: 祈福
 * @return {*}
 */
export const blessingApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/blessing");
    return http(url, "post", params);
}

/**
 * @description: 领取宝箱
 * @return {*}
 */
export const receiveBoxApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/box");
    return http(url, "post", params);
}

/**
 * @description: 排行榜奖励
 * @return {*}
 */
export const getRankRewardApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/rank_reward");
    return http(`${url}&${encodeURL(params)}`, "get");
}

/**
 * @description: 排行榜
 * @return {*}
 */
export const getRankSimpleApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/rank/simple");
    return http(`${url}&${encodeURL(params)}`, "get");
}

/**
 * @description: 背包数据
 * @return {*}
 */
export const getBagApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/backpack");
    return http(url, "get");
}

/**
 * @description: 主页信息
 * @return {*}
 */
export const getRankApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/home");
    return http(url, "get");
}

/**
 * @description: 抽奖页面信息
 * @return {*}
 */
export const getLotteryInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/lottery/info");
    return http(url, "get");
}

/**
 * @description: 抽奖接口
 * @return {*}
 */
export const postLotteryApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/lottery");
    return http(url, "post", params);
}

/**
 * @description: 抽奖历史页面信息
 * @return {*}
 */
export const getRewardHistoryApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/lottery/reward/history");
    return http(url, "get");
}

/**
 * @description: 任务列表
 * @return {*}
 */
export const getTaskListInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/task/list");
    return http(url, "get");
}

/**
 * @description: 领取任务奖励
 * @return {*}
 */
export const postTaskRewardApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/task/reward");
    return http(url, "post", params);
}

/**
 * @description: 合成菜品
 * @return {*}
 */
export const postComposeApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/merge");
    return http(url, "post", params);
}

/**
 * @description: 领取菜品奖励
 * @return {*}
 */
export const postFoodRewardApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/receive_dish_reward");
    return http(url, "post", params);
}

/**
 * @description: 商铺列表
 * @return {*}
 */

export const getShopListApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/shop/list");
    return http(url, "get");
}

/**
 * @description: 商铺购买
 * @return {*}
 */
export const postShopBuyApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/shop/buy");
    return http(url, "post", params);
}


/**
 * @description: 可寄售列表
 * @return {*}
 */
export const getSellListApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/market/can/sale/list");
    return http(url, "get");
}

/**
 * @description: 寄售商品
 * @return {*}
 */
export const postSellApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/sale/product");
    return http(url, "post", params);
}

/**
 * @description: 已寄售列表
 * @return {*}
 */
export const getSoldListApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/market/sale/list");
    return http(`${url}&${encodeURL(params)}`, "get");
}

/**
 * @description: 取消寄售商品
 * @return {*}
 */

export const postCancelSellApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/sale/can");
    return http(url, "post", params);
}

/**
 * @description: 自由市场
 * @return {*}
 */
export const getMarketListApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/eidalad/market/list");
    return http(`${url}&${encodeURL(params)}`, "get");
}

/**
 * @description: 购买寄售商品
 * @return {*}
 */
export const postBuyApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/eidalad/sale/buy");
    return http(url, "post", params);
}