/*
 * @Author: Se7enElk
 * @Date: 2022-04-07 16:48:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-12 15:28:33
 * @FilePath: /yaame-h5/src/pages/ChatMyGuild/api.js
 * @Description: 
 */
import http, { getBaseUrl } from '@/lib/http';
import config from '@/lib/config';
import { encodeURL } from '@/lib/utils';

// 聊天主播收益配置信息
export const getIncomeConfig = async () => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/user/statistic/income/chat/config');
    return http(url, 'get');
}
// 聊天主播日收益
export const getIncomeDaily = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/user/statistic/income/chat/daily');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}
// 聊天主播月收益
export const getIncomeMonth = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/user/statistic/income/chat/month');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}
// 工会聊天日收益
export const getGuildIncomeDaily = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/guild/statistic/income/chat/daily');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}
// 工会聊天月收益
export const getGuildIncomeMonth = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/guild/statistic/income/chat/month');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}


export default {
    getIncomeConfig,
    getIncomeDaily,
    getGuildIncomeDaily,
    getIncomeMonth,
    getGuildIncomeMonth
};