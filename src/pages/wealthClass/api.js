import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";

/**
 * @description: 财富等级首页数据
 * @return {*}
 */
export const getUserLevelApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/user_level/wealth/info");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}

/**
 * @description: 财富等级任务数据
 * @return {*}
 */
export const getTaskApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/user_level/task");
    return http(url, "get");
}