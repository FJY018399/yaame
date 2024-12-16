/*
 * @Author: Elk
 * @Date: 2023-01-05 15:04:17
 * @FilePath: /yaame-h5/src/lib/request/recharge.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
// 获取充值列表
export const getGoodsListApi = async () => {
    let url = await getBaseUrl('get', '/peanut/api/h5/common/goods/diamonds');
    return http(url, 'get');
};

// 获取用户信息
export const getUserInfoApi = async (id) => {
    let url = await getBaseUrl('get', '/peanut/api/h5/common/user/simple');
    url += '&peanut_id=' + id;
    return http(url, 'get');
};

// 确定充值
export const rechargeApi = async (data) => {
    let url = await getBaseUrl('post', '/peanut/api/h5/common/order');
    return http(url, 'post', data);
};

// 获取充值结果
export const getResultApi = async (target_uid, order_id) => {
    let url = await getBaseUrl('get', '/peanut/api/h5/common/order/check');
    url += `&order_id=${order_id}`;
    url += `&target_uid=${target_uid}`;
    return http(url, 'get');
};

// 充值-订单验证
export const rechargeOrderCheck = async (data) => {
    let url = await getBaseUrl('post', config.recharge.check);
    return http(url, 'post', data);
};

// 充值-订单验证
export const rechargeOrderPayment = async (data) => {
    let url = await getBaseUrl('get', config.recharge.payment);
    url += `&orderId=${data.orderId}`;
    url += `&channelType=AIR_WALLEX`;
    return http(url, 'get');
};

// 充值返利活动信息
export const getChargeRebateInfo = async () => {
    let url = await getBaseUrl('get', config.recharge.chargeRebate);
    return http(url, 'get');
};

// 充值返利活动领取奖励
export const chargeRebateReceive = async (data) => {
    let url = await getBaseUrl('post', config.recharge.receiveRebate);
    return http(url, 'post', data);
};
