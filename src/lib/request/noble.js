/*
 * @Author: Se7enElk
 * @Date: 2022-03-28 14:31:11
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-28 14:33:16
 * @FilePath: /peanut_h5/src/lib/request/noble.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

export const getNobleInfo = async () => {
    let url = await getBaseUrl('get', config.noble.info);
    return http(url, 'get');
};

export default {
    getNobleInfo,
};