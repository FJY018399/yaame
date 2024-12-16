import http, { getBaseUrl } from '../http';
import config from '../config';

const getBoxLotteryBase = async () => {
    let url = await getBaseUrl('get', config.box_lottery.index);
    return http(url, 'get');
};
const postBoxLottery = async (data) => {
    let url = await getBaseUrl('post', config.box_lottery.index);
    url += '&n=' + data.n;
    url += '&type=' + data.type;
    return http(url, 'post', data);
};
const postBoxLotteryFree = async (data) => {
    let url = await getBaseUrl('post', config.box_lottery.free);
    url += '&n=' + data.n;
    return http(url, 'post', data);
};
const getBoxLotteryList = async (data) => {
    let url = await getBaseUrl('get', config.box_lottery.list);
    url += '&page=' + data.page;
    url += '&page_size=' + data.page_size;
    return http(url, 'get');
};
export default {
    getBoxLotteryBase,
    getBoxLotteryList,
    postBoxLottery,
    postBoxLotteryFree
};