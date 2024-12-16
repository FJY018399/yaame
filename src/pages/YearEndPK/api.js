import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 公会首页信息
 * @return {*}
 */
export const getInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/year/end/gift/info");
    return http(url, "get");
};

/**
 * @description: 奖品信息
 * @return {*}
 */
export const getGiftInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/year/end/reward/info");
    return http(url, "get");
}


/**
 * @description: 排行榜
 * @return {*}
 */
export const getRankAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/year/end/rank");
    return http(`${url}&${encodeURL(params)}`, 'get');
}
