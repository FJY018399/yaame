import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 首页信息
 * @return {*}
 */
export const getLuckyKinHomeApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/who_lucky_king/home");
    return http(url, "get");
};
/**
 * @description: 排行页
 * @return {*}
 */

export const getLuckyKinRankApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/who_lucky_king/rank");
    return http(url, "get");
}


/**
 * @description: 领取任务完成接口
 * @return {*}
 */
export const taskReceiveApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/who_lucky_king/task_receive");
    return http(url, "post", params);
}

/**
 * @description: 兑换奖励
 * @return {*}
 */
export const taskRewardReceiveApi = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/who_lucky_king/task_reward_receive");
    return http(url, "post", params);
}

/**
 * @description: 关注
 * @return {*}
 */

export const postAttentionsApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/attentions`);
    return http(url, 'post', params);
}