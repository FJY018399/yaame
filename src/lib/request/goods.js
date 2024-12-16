/*
 * @Author: Se7enElk
 * @Date: 2021-11-06 16:57:54
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-11-11 15:35:29
 * @FilePath: /peanut_h5/src/lib/request/goods.js
 * @Description: 商品类接口
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

const getFirstChargeInfo = async (options) => {
    let url = await getBaseUrl('get', config.goods.first);
    url += '&platform=' + options.platform;
    if(options.marketing_channel) {
        url += '&marketing_channel=' + options.marketing_channel;
    }
    return http(url, 'get');
};

export default {
    getFirstChargeInfo
};