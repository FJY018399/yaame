if (!window.Promise) {
	require("promise-polyfill/src/polyfill");
}
import CryptoJS from 'crypto-js'
import axios from "axios";
import md5 from "js-md5";
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
    getAuthToken
} from "./device";
import config from "./config";
import Toast from "./../components/third/toast/toast";

const app_key_define = {
	ios: 20001303,
	android: 20001303,
};

const getAppSign = (params, body) => {
	let string_ = "";
	const sortData = {}; // 排序后的对象
	Object.keys(params)
		.sort()
		.forEach((key) => {
			sortData[key] = params[key];
		});
	Object.keys(sortData).forEach((key) => {
		string_ += `${key}${sortData[key]}`;
	});
    if (body) {
        string_ += encryptData(JSON.stringify(body), key);
    }
    console.log(string_ + 'f9ef5f4139dddf0ccf105741009061df');
    return md5(string_ + 'f9ef5f4139dddf0ccf105741009061df');
};

export const getBaseUrl = async (method, path) => {
	const open_uid = getUid();
	// const open_uid = 'fbc835d051e21e4c';
	const device_id = getDevid();
	const app_ts = new Date().getTime();
	const ua_app_key = getAppKey()
		? getAppKey()
		: isIOS()
		? app_key_define.ios
		: app_key_define.android;
    const app_key = 20001303;
	const ad_code = getAdcode();
	const ver_code = getVerCode();
	const app_type = getAppType() || "yaame_h5";
	const channel = getChannel() || "";
	const up = getUp() || "";
	const language = getLanguage() || "en";
	const xver_code = getXVerCode();
    if (Number(ver_code) >= 11300) {
        const auth_token = await getAuthToken();
        return `${config.base_url}${path}?open_uid=${open_uid}&device_id=${device_id}&app_ts=${app_ts}&app_key=${app_key}&ua_app_key=${ua_app_key}&ad_code=${ad_code}&ver_code=${ver_code}&app_type=${app_type}&channel=${channel}&up=${up}&language=${language}&x_ver_code=${xver_code}&auth_token=${auth_token}`;
      }
	return `${config.base_url}${path}?open_uid=${open_uid}&device_id=${device_id}&app_ts=${app_ts}&app_key=${app_key}&ua_app_key=${ua_app_key}&ad_code=${ad_code}&ver_code=${ver_code}&app_type=${app_type}&channel=${channel}&up=${up}&language=${language}&x_ver_code=${xver_code}`;
	//   return `${config.base_url}${path}?uid=${9181}`;
	//   return `${config.base_url}${path}?uid=${3136}`;
	//   return `${config.base_url}${path}?uid=${40}`;
};



// 加密函数
function encryptData(data, key) {
    const cipherText = CryptoJS.AES.encrypt(data, key, {
        mode: CryptoJS.mode.ECB
    });

    // 返回 base64 编码的字符串
    return cipherText.toString();
}

// 解密函数
function decryptData(cipherText, key) {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        mode: CryptoJS.mode.ECB
    });

    // 返回解密后的字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 测试
const key = CryptoJS.enc.Hex.parse("6639656635663431333964646466306363663130353734313030393036316466");


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
			response.request.responseURL.indexOf("peanut-oss.cn-bj.ufileos.com") < 0
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

export default async (url, method, data) => {
	if (!Object.fromEntries) {
		Object.defineProperty(Object, "fromEntries", {
			value: function (entries) {
				if (!entries || !entries[Symbol.iterator]) {
					throw new Error(
						"Object.fromEntries() requires a single iterable argument"
					);
				}

				var obj = {};

				for (var [key, value] of entries) {
					obj[key] = value;
				}

				return obj;
			},
			configurable: true,
			writable: true,
		});
	}
	const url_obj = new URL(url);

	const app_sign = getAppSign(Object.fromEntries(url_obj.searchParams), data);

	try {
		let request_config = {
			method: method,
			url: `${url}&app_sign=${app_sign}`,
			withCredentials: true,
			headers: {
				"content-type": "application/json",
			},
		};
		if (data) {
			request_config.data = encryptData(JSON.stringify(data), key);
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
