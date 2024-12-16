import http, { getBaseUrl } from "../../lib/http";
import { encodeURL } from '../../lib/utils';

// task页面信息/用户数据
export const getTaskInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/greedy_king/task");
    return http(url, "get");
};

// 领取
export const postTaskApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/greedy_king/task_receive');
    return http(url, "post", params);
};

// daily数据
export const getDailyApi = async () => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/greedy_king/daily');
    return http(url, 'get');
}

// daily数据
export const getRankApi = async () => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/greedy_king/rank');
    return http(url, 'get');
}