import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 名人堂
 * @param {*} params
 * @return {*}
 */
export const getWeekStarRankApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/week_star/fame");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
};

/**
 * @description: 首页排行
 * @param {*} params
 * @return {*}
 */

export const getHomeRankApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/week_star/rank");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}


/**
 * @description: 规则页面
 * @param {*} params
 * @return {*}
 */
export const taskReceiveApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/week_star/reward");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get", params);
}

/**
 * @description: 关注
 * @return {*}
 */
export const postAttentionsApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/attentions`);
    return http(url, 'post', params);
}