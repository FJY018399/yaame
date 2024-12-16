import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 创建工会用户搜索
 * @return {*}
 */
export const getSearchApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/guild/create/search");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
};

/**
 * @description: 创建工会
 * @return {*}
 */

export const getGuildCreateApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/guild/create");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}
