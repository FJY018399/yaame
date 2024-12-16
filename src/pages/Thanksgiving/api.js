import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 获取map4
 * @return {*}
 */
export const getVideoResources = async (url) => {
    return http(url, "get", null, "blob", false);
};
/**
 * @description: 获取奖池及榜单信息
 * @return {*}
 */
export const getJackpotInfo = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/thanksgiving/home");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/**
 * @description: 领取奖池领奖
 * @return {*}
 */
export const receiveJackpot = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/thanksgiving/prize");
    return http(url, "post", params);
};

/** @description: 活动折扣商店
 * @return {*}
 */
export const getShopInfo = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/thanksgiving/store");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/** @description: 折扣抽取
 * @return {*}
 */
export const getDiscount = async (params = {}) => {
    let url = await getBaseUrl(
        "post",
        "/yaame/api/h5/auth/thanksgiving/discount"
    );
    return http(url, "post", params);
};

/** @description: 获取商店信息
 * @return {*}
 */
export const getShopGoods = async (params = {}) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/thanksgiving/store");
    return http(`${url}&${encodeURL(params)}`, "get");
};

/** @description: 商品购买
 * @return {*}
 */
export const shopBuy = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/thanksgiving/buy");
    return http(url, "post", params);
};

/**
 * @description: 关注
 * @return {*}
 */
export const postAttentionsApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/attentions`);
    return http(url, "post", params);
};

/**
 * @description: 获取奖池数量
 * @return {*}
 */
export const getPool = async (params = {}) => {
    let url = await getBaseUrl("get", `/yaame/api/h5/auth/thanksgiving/pool`);
    return http(url, "get", params);
};

/**
 * @description: 输入祝福语
 * @return {*}
 */
export const postBlessingApi = async (params) => {
    let url = await getBaseUrl(
        "post",
        `/yaame/api/h5/auth/thanksgiving/blessing`
    );
    return http(url, "post", params);
};
