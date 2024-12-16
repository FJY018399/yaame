/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/api.js
 * @Description: 
 */
import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
import config from "@/lib/config";
/**
 * @description: 首页信息
 * @return {*}
 */
export const getHomeInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/islamic/info");
    return http(url, "get");
};

/**
 * @description: 排行榜信息
 * @return {*}
 */
export const getIslamicRankAPI = async (params) => {
    let url = await getBaseUrl("get", `/yaame/api/h5/auth/activity/islamic/rank`);
    url = `${url}&${encodeURL(params)}`;

    return http(url, 'get');
}

/**
 * @description: 闯关信息
 * @return {*}
 */
export const getIslamicLevelAPI = async () => {
    let url = await getBaseUrl("get", `/yaame/api/h5/auth/activity/islamic/level`);
    return http(url, 'get');
}


/**
 * @description: 点亮
 * @return {*}
 */

export const lightFireworksAPI = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/activity/islamic/light`);
    return http(url, 'post', params);
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
 * @description: 取消关注
 * @return {*}
 */

export const deleteAttentionsApi = async (uid) => {
    let url = await getBaseUrl('delete', `/yaame/api/h5/auth/attentions`);
    return http(url, 'delete', uid);
};