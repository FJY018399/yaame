if (!window.Promise) {
    require("promise-polyfill/src/polyfill");
}
import axios from "axios";
import md5 from "js-md5";
import { getQueryString } from "./utils";
import {
    getUid,
    getDevid,
    isIOS,
    getAppKey,
    getVerCode,
    getAdcode,
    getAppType,
    getChannel,
    getUp,
    getLanguage,
    getXVerCode,
    getAuthToken,
} from "./device";
import config from "./config";
import Toast from "./../components/third/toast/toast";

const app_key_define = {
    ios: 61456502,
    android: 61456501,
};

const getAppSign = (method, path, timestamp) => {
    return md5(method.toLocaleUpperCase() + "&" + path + "&" + timestamp);
};

export const getBaseUrl = async (method, path) => {
    const open_uid = getUid();
    // const open_uid = '2b6c3acc392bf6b9';
    const device_id = getDevid();
    const timestamp = new Date().getTime();
    const app_sign = getAppSign(method, path, timestamp);
    const app_key = getAppKey()
        ? getAppKey()
        : isIOS()
        ? app_key_define.ios
        : app_key_define.android;
    const ad_code = getAdcode();
    const ver_code = getVerCode();
    const app_type = getAppType() || "yaame_h5";
    const channel = getChannel() || "";
    //   const up = getUp() || '';
    const up = isIOS() ? "IPHONE" : "ANDROID";
    //   const language = getLanguage() || getQueryString('language') || 'en';
    const language = getQueryString("language") || getLanguage() || "en";
    const xver_code = getXVerCode();

    if (Number(ver_code) >= 11300) {
        const auth_token = await getAuthToken();
        return `${config.base_url}${path}?open_uid=${open_uid}&device_id=${device_id}&timestamp=${timestamp}&app_sign=${app_sign}&app_key=${app_key}&ad_code=${ad_code}&ver_code=${ver_code}&app_type=${app_type}&channel=${channel}&up=${up}&language=${language}&x_ver_code=${xver_code}&auth_token=${auth_token}`;
    }
    return `${config.base_url}${path}?open_uid=${open_uid}&device_id=${device_id}&timestamp=${timestamp}&app_sign=${app_sign}&app_key=${app_key}&ad_code=${ad_code}&ver_code=${ver_code}&app_type=${app_type}&channel=${channel}&up=${up}&language=${language}&x_ver_code=${xver_code}`;
    //   return `${config.base_url}${path}?uid=${3229}`;
    //   return `${config.base_url}${path}?uid=${9350}`;
    //   return `${config.base_url}${path}?uid=${40}`;
};

axios.interceptors.response.use(
    (response) => {
        if (response.status !== 200) {
            // todo 全局用户提示
            Toast(response.status);
            return response.data;
        }
        //  response.data.status !== 1000 && response.data.status !== 1020 && response.data.status !== 5000 && response.data.status !== 6600 && response.data.status !== 101
        if (
            ![1000, 1020, 5000, 6600, 101, 1023, 4004, 9505].includes(
                response.data.status
            ) &&
            response.request.responseURL.indexOf(
                "peanut-oss.cn-bj.ufileos.com"
            ) < 0
        ) {
            // todo 全局用户提示
            //   response.data.status !== 2001 && Toast(response.data.desc);
            return response.data;
        }
        return response.data;
    },
    (error) => {
        Toast(error);
        return error;
    }
);

export default async (
    url,
    method,
    data,
    responseType = "json",
    withCredentials = true
) => {
    try {
        let request_config = {
            method: method,
            url: url,
            responseType,
            withCredentials,
            headers: {
                "content-type": "application/json",
            },
        };
        if (data) {
            request_config.data = data;
        }
        return await axios(request_config).catch((e) => {
            if (e.toJSON) {
                try {
                    let err_msg = JSON.stringify(e.toJSON());
                } catch (err) {
                    return null;
                }
            }
        });
    } catch (e) {
        // todo 修改良好用户体验
        // 提示用户错误
        Toast("Network error, please refresh and try again later");
        return null;
    }
};
