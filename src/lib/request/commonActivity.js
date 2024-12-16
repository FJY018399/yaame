/*
 * @Author: Se7enElk
 * @Date: 2021-11-06 16:57:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-09 18:51:53
 * @FilePath: /yaame-h5/src/lib/request/commonActivity.js
 * @Description: 公共活动请求接口
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

const rocketJoinGetFun = async () => {
    let url = await getBaseUrl('get', config.commonActivity.rocket.index);
    return http(url, 'get');
};

const rocketBetFun = async (data) => {
    let url = await getBaseUrl('post', config.commonActivity.rocket.index);
    return http(url, 'post', data);
};

const rocketRecordsGetFun = async (data) => {
    let url = await getBaseUrl('get', config.commonActivity.rocket.index + '/records');
    return http(url, 'get', data);
};

const jumpDownToExchange = async (data) => {
    let url = await getBaseUrl('put', config.commonActivity.rocket.index);
    return http(url, 'put', data);
};

export default {
    rocketJoinGetFun,
    rocketBetFun,
    rocketRecordsGetFun,
    jumpDownToExchange
};