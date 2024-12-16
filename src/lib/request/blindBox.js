import http, { getBaseUrl } from '../http';
import config from '../config';

const getBlindBoxBase = async () => {
    let url = await getBaseUrl('get', config.blindBox.index);
    return http(url, 'get');
};
const getBlindBoxList = async (data) => {
    let url = await getBaseUrl('get', config.blindBox.list);
    url += '&page=' + data.page;
    url += '&size=' + data.size;
    return http(url, 'get');
};
export default {
    getBlindBoxBase,
    getBlindBoxList,
};