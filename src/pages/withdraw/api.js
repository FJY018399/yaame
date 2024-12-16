/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/withdraw/api.js
 * @Description: 
 */
import http, { getBaseUrl } from "@/lib/encipherHttp";
import { encodeURL } from "@/lib/utils";
/**
 * @description: 首页信息
 * @return {*}
 */
export const getHomeInfoAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/withdraw/home");
    if (params) {
        url = `${url}&${encodeURL(params)}`;
    }
    return http(url, "get");
};

/**
 * @description: 支付方式列表
 * @return {*}
 */
export const getWithdrawalMethodAPI = async () => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/withdraw/methods");
    
    return http(url, "get");
}

/**
 * @description: 提现账号详情
 * @return {*}
 */
export const getWithdrawalAccountAPI = async (params) => {
    let url = await getBaseUrl("get", `/yaame/api/h5/auth/withdraw/account/detail`);
    url = `${url}&${encodeURL(params)}`;
    
    return http(url, 'get');
}


/**
 * @description: 新增-编辑支付方式
 * @return {*}
 */

export const addEditWithdrawalAccountAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/withdraw/account/aou");
    
    return http(url, 'post', params);
}

/**
 * @description: 删除支付方式
 * @return {*}
 */
export const deleteWithdrawalAccountAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/withdraw/account");
    
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'delete');
}

/**
 * @description: 创建提现订单
 * @return {*}
 */
export const createWithdrawalOrderAPI = async (params) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/withdraw/orders/create");
    
    return http(url, 'post', params);
}


/**
 * @description: 提现订单列表
 * @return {*}
 */
export const getWithdrawalOrderListAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/withdraw/orders/list");
    
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}


/**
 * @description: 计算手续费
 * @return {*}
 */
export const calculateFeeAPI = async (params) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/withdraw/pre/order");
    
    return http(url, 'post', params);
}
