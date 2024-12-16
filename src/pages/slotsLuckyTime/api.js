import http, { getBaseUrl } from "../../lib/http";

/**
 * @description: 抽奖奖品接口
 * @return {*}
 */
export const getLotteryDataApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/pool_lottery/home");
    url += '&activity_type=' + 'SLOTS_LUCK';
    return http(url, "get");
};

// 抽奖操作
export const postPolLotteryApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/pool_lottery/lottery');
    return http(url, "post", params);
};
// 任务页面接口
export const getTaskDataApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/slotslucky/task");
    return http(url, "get");
};
// 排行榜页面接口
export const getRankDataApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/slotslucky/rank");
    return http(url, "get");
};
// 获取票数
export const getTicketDataApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/slotslucky/ticket_amount");
    return http(url, "get");
};