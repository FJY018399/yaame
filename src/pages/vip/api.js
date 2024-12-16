import http, { getBaseUrl } from "@/lib/encipherHttp";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 公会首页信息
 * @return {*}
 */
export const getInfoAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/user/vip/privilege/list");
    return http(url, "get");
};

// 订阅vip
export const subscribeAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/user/vip/buy");
    return http(url, "post", params);
};


// 自动订阅开关
export const autoSubscribeAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/user/vip/renewal");
    return http(url, "post", params);
};