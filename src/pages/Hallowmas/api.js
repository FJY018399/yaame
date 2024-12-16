import http, { getBaseUrl } from "@/lib/http";
import { encodeURL } from "@/lib/utils";


/**
 * @description: 拼图页数据
 * @return {*}
 */
export const getPuzzleHomeApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/halloween/v2/puzzle/home");
    return http(url, "get");
};

/**
 * @description: 点亮拼图
 * @param {*} params
 * @return {*}
 */

export const postPuzzleListApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/halloween/v2/puzzle/light`);
    return http(url, 'post', params);
}

/**
 * @description: 钻石点亮
 * @param {*} params
 * @return {*}
 */

export const postDiamondApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/halloween/v2/puzzle/light/diamond`);
    return http(url, 'post', params);
}


/**
 * @description: 钻石点亮
 * @param {*} params
 * @return {*}
 */

export const postPartyFollowApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/halloween/v2/party/follow`);
    return http(url, 'post', params);
}


/**
 * @description: 排行榜
 * @param {*} params
 * @return {*}
 */
export const getRankHomeApi = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/halloween/v2/rank/home");
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
};

/**
 * @description: 排行榜奖励
 * @return {*}
 */
export const getRankRewardApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/halloween/v2/rank/reward");
    return http(url, "get");
};


/**
 * @description: party
 * @return {*}
 */
export const getPartyApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/halloween/v2/party");
    return http(url, "get");
};


/**
 * @description: 历史记录
 * @return {*}
 */
export const getRecordApi = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/halloween/v2/puzzle/record");
    return http(url, "get");
};



/**
 * @description: 关注
 * @param {*} params
 * @return {*}
 */

export const postAttentionsApi = async (params) => {
    let url = await getBaseUrl("post", `/yaame/api/h5/auth/attentions`);
    return http(url, 'post', params);
}