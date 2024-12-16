/*
 * @Author: Se7enElk
 * @Date: 2022-01-14 19:05:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-17 19:15:42
 * @FilePath: /peanut_h5/src/lib/request/lucky_rewards.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { options } from 'less';

const getActInfo = async () => {
    let url = await getBaseUrl('get', config.lucky_rewards.info);
    return http(url, 'get');
};
const postDiamond = async (data) => {
    let url = await getBaseUrl('post', config.lucky_rewards.post_diamond);
    url += '&n=' + data.count;
    url += '&type=' + data.type;
    url += '&use_spar=' + data.use_spar;
    return http(url, 'post', {});
};
const postDiamondFree = async (data) => {
    let url = await getBaseUrl('post', config.lucky_rewards.free);
    url += '&n=' + data.count;
    url += '&type=' + data.type;
    return http(url, 'post', {});
};
const getActRecord = async (page, page_size) => {
    let url = await getBaseUrl('get', config.lucky_rewards.record);
    url += '&page=' + page;
    url += '&page_size=' + page_size;
    return http(url, 'get');
};
const postDiamondLotteryTicket = async (data) => {
    let url = await getBaseUrl('post', config.lucky_rewards.ticket);
    url += '&n=' + data.count;
    url += '&type=' + data.type;
    return http(url, 'post', {});
};

// 幸运转盘 榜单
const getLuckyRank = async (lotteryWheelType) => {
    let url = await getBaseUrl('get', config.lucky_rewards.rank);
    url += '&lotteryWheelType=' + lotteryWheelType; 
    return http(url, 'get'); 
};

// 指针秘境抽奖-首页 <史乐声>
const getSecretarea = async () => {
    let url = await getBaseUrl('get', config.lucky_rewards.secretarea.overview);
    return http(url, 'get'); 
};

// 指针秘境抽奖-抽奖 <史乐声>
const postSecretareaLottery = async (options) => {
    let url = await getBaseUrl('post', config.lucky_rewards.secretarea.lottery);
    url += '&n=' + options.n; 
    url += '&type=' + options.type; 
    return http(url, 'post', options); 
};

// 指针秘境抽奖-记录 <史乐声>
const getSecretareaRecord = async (page, page_size) => {
    let url = await getBaseUrl('get', config.lucky_rewards.secretarea.record);
    url += '&page=' + page; 
    url += '&page_size=' + page_size; 
    return http(url, 'get'); 
};

export default {
    getActInfo,
    postDiamond,
    getActRecord,
    postDiamondFree,
    postDiamondLotteryTicket,
    getLuckyRank,
    getSecretarea,
    postSecretareaLottery,
    getSecretareaRecord
};