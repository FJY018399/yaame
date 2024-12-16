import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';


const getBoardHome = async () => {
    let url = await getBaseUrl('get', config.notice.list);
    return http(url, 'get');
};

const getRecordGift = async (page, page_size) => {
    let url = await getBaseUrl('get', config.notice.gift);
    url += '&page=' + page;
    url += '&page_size=' + page_size;
    return http(url, 'get');
};

const getRecordLottery = async (page, page_size) => {
    let url = await getBaseUrl('get', config.notice.lottery);
    url += '&page=' + page;
    url += '&page_size=' + page_size;
    return http(url, 'get');
};

export default {
    getBoardHome,
    getRecordGift,
    getRecordLottery
};