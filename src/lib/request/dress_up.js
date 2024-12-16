/*
 * @Author: Se7enElk
 * @Date: 2022-07-19 15:45:49
 * @FilePath: /yaame-h5/src/lib/request/dress_up.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';


const getDressUpHomeInfo = async () => {
    let url = await getBaseUrl('get', config.dress_up.type);
    return http(url, 'get');
};

const getDressUpList = async (type, page) => {
    let url = await getBaseUrl('post', config.dress_up.list);
    // url += '&back_pack_good_type=' + type;
    url += '&dress_up_type=' + type;
    url += '&page=' + page;
    return http(url, 'post');
};

const getDressUpListV2 = async (type, page) => {
    let url = await getBaseUrl('post', config.dress_up.list_v2);
    // url += '&back_pack_good_type=' + type;
    url += '&dressUpType=' + type;
    url += '&page=' + page;
    return http(url, 'post');
};

const createDressOrder = async (params) => {
    let url = await getBaseUrl('post', config.dress_up.order);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'post');
};

export default {
    getDressUpHomeInfo,
    getDressUpList,
    createDressOrder,
    getDressUpListV2
};