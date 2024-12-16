import http, { getBaseUrl } from "../../lib/http";

/**
 * @description: 活动礼物信息
 * @return {*}
 */
export const getGiftInfoApi =async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/super_star/gift_infos");
    return http(url, "get");
};

// 活动充值信息
export const getRechargeInfoApi =async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/super_star/user");
    return http(url, "get");
};

// 领取活动礼物
export const receiveGiftApi =async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/super_star/gift_receive");
    return http(url, "post", params);
};

// 搜索用户
export const searchUserApi =async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/super_star/rank_search");
    url += `&yaame_id=${params.yaame_id}`;
    return http(url, "get");
};

//活动送礼 
export const sendGiftApi =async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/activity/super_star/send_gift");
    return http(url, "post", params);
};

// 超级巨星活动排行榜
export const getRankListApi =async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/super_star/rank");
    return http(url, "get", params);
};

// 活动礼物用户背包数量
export const getGiftUserBagApi =async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/super_star/gift_amount");
    return http(url, "get");
};