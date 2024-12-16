/*
 * @Author: Elk
 * @Date: 2023-04-19 10:16:43
 * @FilePath: /yaame-h5/src/lib/request/redEnvelope.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

const getRedPackResult = async (data) => {
    let url = await getBaseUrl('get', config.redEnvelope.result);
    url += '&page=' + data.page;
    url += '&size=' + data.size;
    url += '&redPackId=' + data.redPackId;
    return http(url, 'get');
};
export default {
    getRedPackResult,
};