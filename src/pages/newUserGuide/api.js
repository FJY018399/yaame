/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-10-26 15:10:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-09-06 18:51:26
 * @Description:
 * @FilePath: /yaame-h5/src/pages/recharge/api.js
 */
import http, { getBaseUrl } from "../../lib/http";

/**
 * @description: 查询商品列表
 * @return {*}
 */
export const getGoodsAPI = async (type) => {
    let url = await getBaseUrl("get", "/yaame/api/web/payment/goods");
    url += `&country_type=${type}`;
    return http(url, "get");
};

/**
 * @description: 下单
 * @return {*}
 */
export const orderAPI = async (data) => {
    let url = await getBaseUrl("post", "/yaame/api/web/payment/order");
    if (data.web_uid) {
        url += `&web_uid=${data.web_uid}`;
    }
    return http(url, "post", data);
};


/**
 * @description: 校验订单
 * @return {*}
 */
export const checkOrderAPI = async (data) => {
    let url = await getBaseUrl("post", "/yaame/api/web/payment/order/check");
    if (data.web_uid) {
        url += `&web_uid=${data.web_uid}`;
    }
    return http(url, "post", data);
};


/**
 * @description: 查询用户信息
 * @return {*}
 */
export const queryUserAPI = async (id) => {
    let url = await getBaseUrl("get", "/yaame/api/web/payment/query/user");
    url += `&yaame_id=${id}`;
    return http(url, "get");
};

