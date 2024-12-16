/*
 * @Author: Elk
 * @Date: 2023-04-19 10:16:43
 * @FilePath: /yaame-h5/src/lib/request/wealthLevel.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

const getWealthLevel = async (data) => {
    let url = await getBaseUrl('get', config.wealthLevel.list);
    url += '&levelType=' + data.level_type;
    return http(url, 'get');
};
export default {
    getWealthLevel,
};