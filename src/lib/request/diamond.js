/*
 * @Author: Elk
 * @Date: 2023-05-30 18:42:36
 * @FilePath: /yaame-h5/src/lib/request/diamond.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

const getDiamondList = async (page, size) => {
    let url = await getBaseUrl('get', config.diamond.list);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};

const getMoneyList = async (page, size) => {
    let url = await getBaseUrl('get', config.diamond.money);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};

const getCrystalList = async (page, size) => {
    let url = await getBaseUrl('get', config.diamond.crystal);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
}

export default {
    getDiamondList,
    getMoneyList,
    getCrystalList
};