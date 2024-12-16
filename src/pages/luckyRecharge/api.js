
import http, { getBaseUrl } from "../../lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 获取任务页信息
 * @return {*}
 */

export const getTaskInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/lucky_recharge/task");
    return http(url, "get");
}


/**
 * @description: 获取排行榜奖励信息
 * @return {*}
 */
export const getRankRewardInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/lucky_recharge/rank_reward");
    return http(url, "get");
}

/**
 * @description: 领取奖励
 * @return {*}
 */
export const receiveRewardAPI = async (data) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/lucky_recharge/receive_reward");
    return http(url, "post", data);
}

/**
 * @description: 获取排行榜排名信息
 * @return {*}
 */
export const getRankListAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/rank/simple");
    return http(`${url}&${encodeURL(params)}`, "get");
};
