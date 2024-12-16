/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-12-07 13:57:15
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-12-08 10:19:21
 * @Description: 
 * @FilePath: \yaame-h5\src\pages\cp\api.js
 */
import http, { getBaseUrl } from "../../lib/http";

/**
 * @description: 获取CP信息
 * @return {*}
 */
export const getCpInfoAPI = async (data) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/cp/info");
    return http(url, "get");
};

/**
 * @description: 删除CP
 * @return {*}
 */
export const removeCpAPI = async (data) => {
    let url = await getBaseUrl("post", "/yaame/api/h5/auth/cp/remove");
    return http(url, "post", data);
};

/**
 * @description: 获取CP privileges
 * @return {*}
 */
export const getPrivilegesAPI = async (data) => {
    let url = await getBaseUrl("get", "/yaame/api/h5/auth/cp/privileges");
    return http(url, "get");
};