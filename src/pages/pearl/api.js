import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 活动任务首页
 * @return {*}
 */
export const getPearlCollectorHomeApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pearl_collector/task");
    return http(url, "get");
};

/**
 * @description: 排行
 * @return {*}
 */

export const getPearlCollectorRankApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pearl_collector/rank");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}


/**
 * @description: 领取任务完成接口
 * @return {*}
 */
export const taskReceiveApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/pearl_collector/task_receive");
    return http(url, "post", params);
}

/**
 * @description: 规则页
 * @return {*}
 */
export const rankRuledApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pearl_collector/rank_reward");
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
 * @description: 点亮珍珠主页
 * @return {*}
 */
export const getLightenHomeApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pearl_collector/draws");
    return http(url, "get");
};

/**
 * @description: 点亮接口
 * @return {*}
 */
export const postLightenApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/activity/pearl_collector/draws_lottery`);
    return http(url, 'post', params);
}

/**
 * @description: 领取所有
 * @return {*}
 */
export const postAllAwardApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/activity/pearl_collector/draws_receive`);
    return http(url, 'post', params);
}