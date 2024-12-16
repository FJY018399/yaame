import http, { getBaseUrl } from '../../lib/http';
import { encodeURL } from "@/lib/utils";
/**
 * @description: 我的1v1收益明细
 * @return {*}
 */
export const getTextFlows = async (options) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/guilds/settlements/users/text/flows');
    url = `${url}&${encodeURL(options)}`;
	return http(url, 'get');
};

/**
 * @description: 我的收入流水
 * @return {*}
 */
export const getFlows = async (options) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/guilds/settlements/users/flows');
    url = `${url}&${encodeURL(options)}`;
	return http(url, 'get');
};

// 聊天主播收益配置信息
export const getChatIncomeConfig = async () => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/user/statistic/income/chat/config');
    return http(url, 'get');
}

/**
 * @description: 工会成员列表
 * @return {*}
 */
export const getGuildUser = async (options) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/guild/user');
    return http(`${url}&${encodeURL(options)}`, 'get');
};

/**
 * @description: 设置权限
 * @return {*}
 */
export const setAuthority = async (options) => {
    let url = await getBaseUrl('put', '/yaame/api/h5/auth/guild/user/managers');
    return http(url, 'put', options);
};

/**
 * @description: 获取管理员列表
 * @return {*}
 */
export const getManagerList = async (options) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/guild/user/managers/records');
    return http(`${url}&${encodeURL(options)}`, 'get');
};