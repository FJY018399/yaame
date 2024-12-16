/*
 * @Author: Se7enElk
 * @Date: 2022-05-16 16:23:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-09 18:51:55
 * @FilePath: /yaame-h5/src/lib/request/cupid.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

const getList = async (ofTab) => {
    let url = await getBaseUrl('get', config.activity.valentine);
    url += '&ofTab=' + ofTab;
    return http(url, 'get');
};
export default {
    getList,
};