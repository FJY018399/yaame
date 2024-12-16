import http, { getBaseUrl } from "../../lib/http";

// 充值返利首页信息
export const getReceiveHomeInfoApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/activity/charge_rebate/info");
    return http(url, "get");
};

// 充值领取奖励接口
export const postReceiveApi = async (params) => {
    let url = await getBaseUrl("post", '/yaame/api/h5/auth/activity/charge_rebate/receive');
    return http(url, "post", params);
};