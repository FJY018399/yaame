/*
 * @Author: Se7enElk
 * @Date: 2021-10-02 13:56:58
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-17 15:40:29
 * @FilePath: /peanut_h5/src/lib/request/violation.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

// 获取作品详情数据
const getViolationInfo = async (options) => {
    let url = await getBaseUrl('get', config.violation.info);
    url += '&date=' + options.date;
    return http(url, 'get');
};

const getViolationPageIndex = async (options) => {
    let url = await getBaseUrl('get', config.violation.blacklist);
    url += '&page=' + options.page;
    url += '&size=' + options.size;
    return http(url, 'get');
};

export default {
    getViolationInfo,
    getViolationPageIndex
};