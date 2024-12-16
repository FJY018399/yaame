/* eslint-disable no-extend-native */
import { isIOS } from "@/lib/device";

/**
 * 格式化日期
 * @param {*} timestamp
 * @param {*} format
 * @param {*} abnormal
 */
export const formatDate = (
    date = new Date(),
    format = "yyyy-MM-dd",
    is12System = false
) => {
    if (typeof date === "number") {
        date = new Date(date);
        // date = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // 按照UTC时间计算
    }

    let o = {
        "M+": date.getUTCMonth() + 1,
        "d+": date.getUTCDate(),
        "h+":
            is12System && date.getUTCHours() > 12
                ? date.getUTCHours() - 12
                : date.getUTCHours(),
        "m+": date.getUTCMinutes(),
        "s+": date.getUTCSeconds(),
        "q+": Math.floor((date.getUTCMonth() + 3) / 3),
        S: date.getUTCMilliseconds(),
    };

    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            String(date.getUTCFullYear()).substr(4 - RegExp.$1.length)
        );
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(String(o[k]).length)
            );
        }
    }

    if (is12System) {
        format += date.getUTCHours() >= 12 ? " PM" : " AM";
    }

    return format;
};

export const rem2Px = (value) => {
    let percent = document.documentElement.attributes["data-percent"];

    if (!percent) return value;
    percent = percent.value;

    return value * percent;
};

// 判断是否是微信
export const isWeixin = () => {
    return /MicroMessenger/i.test(navigator.userAgent);
};

export const getQueryString = (key) => {
    if (typeof window !== "undefined") {
        let url = location.search;
        let theRequest = {};
        if (url.indexOf("?") !== -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(
                    strs[i].split("=")[1]
                );
            }
        }
        return theRequest[key] == null ? "" : theRequest[key];
    }
};

export const sleep = (time) => {
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove();
        }, time);
    });
};
export const openWechat = () => {
    // let iframe = document.createElement('iframe');
    // iframe.style.position = 'absolute';
    // iframe.style.left = '-1000px';
    // document.body.appendChild(iframe);
    // iframe.src = 'weixin://';
    window.location.href = "weixin://";
};
export const loadImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            resolve(img);
        };
    }).catch((e) => {
        resolve(null);
    });
};

export const loadArrayImage = (array) => {
    return new Promise((resolve) => {
        Promise.all(array).then((res) => {
            resolve(res);
        });
    }).catch((e) => {
        resolve(null);
    });
};
export const formateMonth = (number) => {
    let arr = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
    ];
    if (number.slice(0, 1) === "0") {
        let index = parseInt(number.slice(1, 2), 0) - 1;
        return arr[index];
    } else {
        return arr[number - 1];
    }
};
export const encodeURL = (json) => {
    const params = Object.keys(json)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
        )
        .join("&");
    return params;
};
// 数字隔3个用逗号分隔
export const formatNumber = (num) => {
    return num
        .toString()
        .split("")
        .reverse()
        .join("")
        .replace(/(\d{3})(?=[^$])/g, "$1,")
        .split("")
        .reverse()
        .join("");
};
export const getAbsPoint = (element) => {
    let x = element.offsetLeft;
    let y = element.offsetTop;
    while ((element = element.offsetParent)) {
        x += element.offsetLeft;
        y += element.offsetTop;
    }
    return {
        x: x,
        y: y,
    };
};
export const compareDay = (timestmap1, timestmap2) => {
    let time1 = formatDate(timestmap1, "dd");
    let time2 = formatDate(timestmap2, "dd");
    return time1 === time2;
};

export const groupBy = (array, f) => {
    let groups = {};
    array.forEach(function (o) {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
};
export const getDateStr = (add_day_count = 0, separator) => {
    let dd = new Date();
    dd.setDate(dd.getDate() + add_day_count);
    let y = dd.getFullYear();
    let m = `0${dd.getMonth() + 1}`.slice(-2);
    let d = `0${dd.getDate()}`.slice(-2);
    return `${y}${separator}${m}${separator}${d}`;
};
export const transTime = (timestamp) => {
    let now = new Date().getTime();
    let differ = now - timestamp;
    if (differ / 1000 < 5 * 60) {
        return "刚刚";
    }
    if (differ / 1000 < 60 * 60) {
        return Math.floor(differ / 1000 / 60) + "分钟前";
    }
    if (differ / 1000 < 24 * 60 * 60) {
        return Math.floor(differ / 1000 / (60 * 60)) + "小时前";
    } else {
        return formatDate(timestamp, "yyyy.MM.dd");
    }
};
export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (error) {
        return false;
    }
    return true;
};

export const formatDateString = (str, separator) => {
    if (typeof str !== String) {
        str = String(str);
    }
    let arr = str.match(/^(\d{4})(\d{2})(\d{2})$/);
    arr.shift();

    return arr.join(separator);
};

export const getSevenDayRange = () => {
    const current = new Date().getTime();
    const range = 7 * 24 * 60 * 60 * 1000;
    const sevenDay = current - range;
    return [new Date(sevenDay), new Date(current)];
};
function padStartPoly() {
    if (!String.prototype.padStart) {
        String.prototype.padStart = function padStart(targetLength, padString) {
            targetLength = targetLength >> 0;
            padString = String(
                typeof padString !== "undefined" ? padString : " "
            );
            if (this.length > targetLength) {
                return String(this);
            } else {
                targetLength = targetLength - this.length;
                if (targetLength > padString.length) {
                    padString += padString.repeat(
                        targetLength / padString.length
                    );
                }
                return padString.slice(0, targetLength) + String(this);
            }
        };
    }
}

export const getBetweenTime = (init_time) => {
    padStartPoly();
    const current = new Date().getTime();
    const range = init_time - current;
    if (range < 0) return "";
    const day = Math.floor(range / (24 * 60 * 60 * 1000));
    const hour = String(Math.floor((range / (60 * 60 * 1000)) % 24));
    const min = String(Math.floor((range / (60 * 1000)) % 60));
    const sec = String(Math.floor((range / 1000) % 60));
    return `${day ? "0" + day : "00"}:${hour ? hour.padStart(2, "0") : "00"}:${
        min ? min.padStart(2, "0") : "00"
    }::${sec ? sec.padStart(2, "0") : "00"}`;
};

export const getBetweenTimeFromApi = (current, end, format = "str") => {
    padStartPoly();
    const range = end - current;
    if (range < 0) return "";
    const day = Math.floor(range / (24 * 60 * 60 * 1000));
    const hour = String(Math.floor((range / (60 * 60 * 1000)) % 24));
    const min = String(Math.floor((range / (60 * 1000)) % 60));
    const sec = String(Math.floor((range / 1000) % 60));
    if (format === "str") {
        return `${day ? "0" + day : "00"}天${
            hour ? hour.padStart(2, "0") : "00"
        }小时${min ? min.padStart(2, "0") : "00"}分钟${
            sec ? sec.padStart(2, "0") : "00"
        }秒`;
    } else if (format === "arr") {
        return [
            day ? "0" + day : "00",
            hour ? hour.padStart(2, "0") : "00",
            min ? min.padStart(2, "0") : "00",
            sec ? sec.padStart(2, "0") : "00",
        ];
    }
};

export const getScrollTop = () => {
    return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
    );
};

export const isEmpty = (v) => {
    switch (typeof v) {
        case "undefined":
            return true;
        case "string":
            if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length === 0)
                return true;
            break;
        case "boolean":
            if (!v) return true;
            break;
        case "number":
            if (v === 0 || isNaN(v)) return true;
            break;
        case "object":
            if (v === null || v.length === 0) return true;
            for (let i in v) {
                if (v.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
    }
    return false;
};

/**
 * 格式化数字
 * @param num 要格式化的数字
 * @param len 保留小数位数默认2
 * @param type 格式化方式0:四舍五入 1:进一  2:舍去 默认0
 * @return string
 */
export const fomatFloat = (num, len, type) => {
    len = len > 0 && len <= 20 ? len : 2;
    let result = parseFloat(num);
    num = isNaN(result) ? 0 : result;
    let numpow = Math.pow(10, len);
    let numcheng = accMul(num, numpow);
    if (type === 1) {
        // ceil进一
        result = Math.ceil(numcheng);
    } else if (type === 2) {
        // floor舍去
        result = Math.floor(numcheng);
    } else {
        // round四舍五入
        result = Math.round(numcheng);
    }
    result = accDiv(result, numpow);
    let s_x = result.toString();
    let pos_decimal = s_x.indexOf(".");
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += ".";
    }
    while (s_x.length <= pos_decimal + len) {
        s_x += "0";
    }
    return s_x;
};

// 乘法函数
function accMul(arg1, arg2) {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
    );
}
// 除法函数
function accDiv(arg1, arg2) {
    let t1 = 0;
    let t2 = 0;
    let r1;
    let r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
        t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 身份证号合法性校验
export const checkIDCard = (idVal) => {
    let res = false;
    let _IDRe18 =
        /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let _IDre15 =
        /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
    // 校验身份证：
    if (_IDRe18.test(idVal) || _IDre15.test(idVal)) {
        res = true;
    }
    return res;
};

/**
 * 支付宝账号合法性校验
 * 支付宝账号分为个人账号和企业账号: 个人账号可以是邮箱和手机号、企业账号只能是邮箱
 *
 */
export const checkAliAccount = (val) => {
    let res = false;
    let reg =
        /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/;

    if (reg.test(val)) {
        res = true;
    }
    return res;
};

// 随机数字
export const valueRandom = (val1, val2) => {
    return Math.floor(Math.random() * (val2 - val1 + 1) + val1);
};

/**
 * 获取指定区间范围随机数，包括lowerValue和upperValue
 */
export const randomFrom = (lowerValue, upperValue) => {
    return Math.floor(
        Math.random() * (upperValue - lowerValue + 1) + lowerValue
    );
};

/**
 * 截取字符串数字之前的部分
 * 例如 vivo -> vivo
 * miyuding01-01  ->  miyuding
 */

export const getStrBeforeNum = (val) => {
    let res = val.match(/\d+/);
    if (!res) {
        return val;
    } else {
        return val.split(res[0])[0];
    }
};

/**
 * 截取字符串中划线之前的部分
 */
export const getStrBeforeStrikethrough = (val) => {
    let res = val.match(/\-/);
    if (!res) {
        return val;
    } else {
        return val.split(res[0])[0];
    }
};

export const burialPointFun = (obj) => {
    if (window.location.origin.indexOf("localhost") > -1) {
        return;
    }

    if (isIOS()) {
        window?.webkit?.messageHandlers?.onLogEvent?.postMessage &&  window.webkit.messageHandlers.onLogEvent.postMessage(
            JSON.stringify(obj)
        );
    } else {
        window?.peanut_client?.onLogEvent && window.peanut_client.onLogEvent(JSON.stringify(obj));
    }
};

// 获取当前时间的时分秒
export const getCurrentTime = (type = "hh:mm:ss") => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const res = `${hours}:${minutes}:${seconds}`;
    if (type === "hh:mm:ss") {
        return res;
    } else {
        const res_ = res.split(":");
        return type == "hh" ? res_[0] : type == "mm" ? res_[1] : res_[2];
    }
};
// 获取年月日
export const getYearMonthDay = (type = "YY:MM:DD") => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，所以需要加1
    const day = now.getDate().toString().padStart(2, "0");
    if (type === "YY:MM:DD") {
        return `${year}-${month}-${day}`;
    } else {
        return type == "YY" ? year : type == "MM" ? month : day;
    }
};
