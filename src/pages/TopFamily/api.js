import http, { getBaseUrl } from "../../lib/http";

/**
 * @description: rank列表接口
 * @return {*}
 */
export const getFamilyRank = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/top/family/rank");
    url += '&page=' + '1';
    url += '&size=' + '30';
    return http(url, "get");
};

/**
 * @description: top family领奖
 * @param {*} data
 * @return {*}
 */
export const claimFamilyReward = async (data) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/top/family/receive");
    return http(url, "post", data);
};

/**
 * @description: 领取奖品信息
 * @return {*}
 */

export const getFamilyRewardInfo = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/top/family/reward/info");
    return http(url, "get");
};
