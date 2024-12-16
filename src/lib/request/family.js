/*
 * @Author: Se7enElk
 * @Date: 2022-07-19 15:45:49
 * @FilePath: /yaame-h5/src/lib/request/dress_up.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';


const getFamilyRule = async () => {
    let url = await getBaseUrl('get', config.family.rule);
    return http(url, 'get');
};

// 获取家族rank
const getFamilyRank = async (params) => {
    let url = await getBaseUrl('get', config.family.rank);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

// 获取家族成员rank
const getFamilyMemberRank = async (params) => {
    let url = await getBaseUrl('get', config.family.rankMember);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

// 获取最新
const getFamilyNew = async (params) => {
    let url = await getBaseUrl('get', config.family.new);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

// 判断当前是否可以拉起创建
const getCheckApi= async () => {
    let url = await getBaseUrl('get', config.family.check);
    return http(url, 'get');
};

export default {
    getFamilyRule,
    getFamilyRank,
    getFamilyMemberRank,
    getFamilyNew,
    getCheckApi
};