import http, { getBaseUrl } from '@/lib/http';
import { encodeURL } from '@/lib/utils';
/**
 * @description: 首页
 * @return {*}
 */
export const getHomeApi = async () => {
    const url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stage');
    return http(url, 'get');
};

/**
 * @description: 家族榜单
 * @return {*}
 */
export const getFamilyRankingApi = async (params) => {
    const url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stage/family');
    return http(`${url}&${encodeURL(params)}`, 'get');
};

/**
 * @description: 用户排名
 * @return {*}
 */
export const getUserRankApi = async (params) => {
    const url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stage/family/users');
    return http(`${url}&${encodeURL(params)}`, 'get');
};

/**
 * @description: MVP榜单
 * @return {*}
 */
export const getMvpRankApi = async (params) => {
    const url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stage/users');
    return http(`${url}&${encodeURL(params)}`, 'get');
};

/**
 * @description: 关注
 * @return {*}
 */
export const postAttentionsApi = async (params) => {
    const url = await getBaseUrl('post', `/yaame/api/h5/auth/attentions`);
    return http(url, 'post', params);
};
