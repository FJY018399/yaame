import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 公会首页信息
 * @return {*}
 */
export const getResellerList = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/merchant/recharge/agent");
    return http(`${url}&${encodeURL(params)}`, 'get');
}