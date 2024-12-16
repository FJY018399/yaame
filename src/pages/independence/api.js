/*
 * @Author: Elk
 * @Date: 2024-08-08 16:11:15
 * @FilePath: /yaame-h5/src/pages/independence/api.js
 * @Description: 
 */
import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 升旗信息
 * @return {*}
 */
export const getPearlCollectorHomeApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/independence/day/info");
    return http(url, "get");
};

/**
 * @description: 排行榜信息
 * @return {*}
 */

export const getPearlCollectorRankApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/independence/day/rank");
    // url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}


/**
 * @description: 输入祝福语
 * @return {*}
 */
export const taskReceiveApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/independence/day/blessing");
    return http(url, "post", params);
}

/**
 * @description: 获取用户奖励信息
 * @return {*}
 */
export const rankRuledApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/independence/day/user/reward");
    return http(url, "get");
}

/**
 * @description: 关注
 * @return {*}
 */
export const postAttentionsApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/attentions`);
    return http(url, 'post', params);
}

/**
 * @description: 投筛子
 * @return {*}
 */
export const getLightenHomeApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/independence/day/roll");
    return http(url, "post", params);
};
