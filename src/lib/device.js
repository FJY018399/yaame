// UserAgent
// const user_agent = process.client ? navigator.userAgent.toLocaleLowerCase() : '';
const user_agent = navigator.userAgent.toLocaleLowerCase();
/**
 * 从UA中获取信息
 */
const getDataFromUserAgent = (key) => {
    let data = '';
    let po = user_agent.indexOf(key);
    if (po > -1) {
        let str = user_agent.substring(po + key.length, user_agent.length);
        po = str.indexOf(';');
        if (po > -1) {
            data = str.substring(0, po);
        } else {
            po = str.indexOf('}');
            if (po > -1) {
                data = str.substring(0, po);
            }
        }
    }
    return data;
};

/**
 * 获取UA信息，返回数组
 */
const getDataArrayFromUserAgent = () => {
    let array = [];
    let po = user_agent.indexOf('ssy={');
    if (po > -1) {
        let str = user_agent.substring(po + 5, user_agent.length);
        po = str.indexOf('}');
        if (po > -1) {
            array = str.substring(0, po);
            array = str.split(';');
        }
    }
    return array;
};

/**
 * 是否文缘
 */
export const isPeanut = () => {
    return (/wlyaame/g.test(user_agent));
};

/**
 * 是否微信
 */
export const isWechat = () => {
    return (/micromessenger/i).test(user_agent);
};
/**
 * 是否android
 */
export const isAndroid = () => {
    return (/android/i).test(user_agent);
};

/**
 * 是否ios系统
 */
export const isIOS = () => {
    return (/iphone/i).test(user_agent) || (/ipad/i).test(user_agent) || (/ios/i).test(user_agent);
};

/**
 * 获取屏幕高度
 */
export const getDeviceHeight = () => {
    const client_height = document.documentElement.clientHeight;
    const client_width = document.documentElement.clientWidth;

    // 屏幕宽度根据适配自动计算为7.5rem
    return client_height * 7.5 / client_width;
};

/**
 * 获取屏幕分辨率
 */
export const getResolution = () => {
    const screen_height = window.screen.height;
    const screen_width = window.screen.width;

    return `${screen_width}*${screen_height}`;
};

/**
 * rem转px
 * @param {*} val 
 */
export const rem2Px = (val) => {
    const percent = document.documentElement.attributes['data-percent'];
    if (!percent) return val;

    return val * percent.value;
};

/**
 * px转rem
 * @param {*} val 
 */
export const px2Rem = (val) => {
    const percent = document.documentElement.attributes['data-percent'];

    if (!percent) return val;

    return val / percent.value;
};

/**
 * 获取app版本
 */
export const getVersion = () => {
    let array = getDataArrayFromUserAgent();

    return array[1];
};

/**
 * 获取用户uid
 */
export const getUid = () => {
    return getDataFromUserAgent('suid=') || window.localStorage.getItem('maybe_uid');
};

/**
 * 获取用户uid
 */
export const getUidForUser = () => {
    let uidMatch = user_agent.match(/;uid=([^;]*)/);
    if (uidMatch && uidMatch.length > 1) {
        let uid = uidMatch[1];
        return uid;
    } else {
        return false
    }
};

/**
 * 获取用户位置经度
 */
export const getLon = () => {
    return getDataFromUserAgent('lon=');
};

/**
 * 获取手机安全区域高度
 */
export const getSafeHeight = () => {
    return getDataFromUserAgent('status_bar_h=');
};

/**
 * 获取用户位置纬度
 */
export const getLat = () => {
    return getDataFromUserAgent('lat=');
};

/**
 * 获取设备adcode
 */
export const getAdcode = () => {
    return getDataFromUserAgent('ad_code=');
};

/**
 * 获取设备app_type
 */
export const getAppType = () => {
    return getDataFromUserAgent('app_type=');
};

/**
 * 获取设备app_key
 */
export const getAppKey = () => {
    return getDataFromUserAgent('app_key=');
};

/**
 * 获取设备city_code
 */
export const getCityCode = () => {
    return getDataFromUserAgent('city_code=');
};

/** 
 * 获取设备ver_code 
 */
export const getVerCode = () => {
    return getDataFromUserAgent('ver_code=').replace(/\./g, '');
};

/** 
 * 获取国家 
 */
export const getLanguage = () => {
    return getDataFromUserAgent('language=').replace(/\./g, '');
};

/** 
 * 获取设备ver_name  例：1.1.0
 */
export const getVerName = () => {
    return getVersion() ? getVersion().replace('v', '') : '';
};

/** 
 * 获取设备province 
 */
export const getProvince = () => {
    return getDataFromUserAgent('province=');
};

/**
 * 获取设备device id
 */
export const getDeviceId = () => {

    return getDataFromUserAgent('device_id=');
};

/**
 * 获取内部版本号参数
 */
export const getXVerCode = () => {
    return getDataFromUserAgent('x_ver_code=');
};
export const getDevid = () => {
    let devid = window.localStorage.getItem('wl_devid');
    if (!devid) {
        devid = isPeanut() ? getDeviceId() : generateUUID();
        window.localStorage.setItem('wl_devid', devid);
    }
    return devid;

    function generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === 'function') {
            // use high-precision timer if available
            d += performance.now();
        }
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
};

/**
 * 获取app渠道
 */
export const getChannel = () => {
    let array = getDataArrayFromUserAgent();

    return array[2];
};

/**
 * 获取视频广告标识
 */
export const getVideoAd = () => {
    return getDataFromUserAgent('video_ad=');
};

/**
 * 获取地区标识
 */
export const getRegionId = () => {
    return getDataFromUserAgent('region_id=');
};

/**
 * 判断当前版本号是否大于传入的版本号
 * 大于 return true
 * 小于或等于 return false
 */
export const isVersionMoreThan = (v = '1.0.0') => {
    let current_version = getVerName();
    if (!current_version) {
        return false;
    }
    let _current_version = toNum(current_version);
    let _v = toNum(v);
    return _current_version > _v;

    function toNum(a) {
        a = a.toString();
        let c = a.split('.');
        return c.map(item => (`0000${item}`).slice(-4)).join('');
    }
};
/**
 * 判断当前版本号是否小于传入的版本号
 * 小于 return true
 * 大于或等于 return false
 */
export const isVersionLessThan = (v = '1.0.0') => {
    let current_version = getVerName();
    if (!current_version) {
        return false;
    }
    let _current_version = toNum(current_version);
    let _v = toNum(v);
    return _current_version < _v;

    function toNum(a) {
        a = a.toString();
        let c = a.split('.');
        return c.map(item => (`0000${item}`).slice(-4)).join('');
    }
};

export const getUp = () => {
    return (/ipad/i).test(user_agent) ? 'IPAD' : '';
    // return 'IPAD';
};

/**
 * 获取token
 */
export const getAuthToken = () => {
    // 检查是否运行在 localhost 上
    if (window.location.origin.includes('localhost')) {
        return Promise.resolve(); // 返回一个已解决的 Promise
    }
    
    // 定义处理令牌获取的函数
    const tokenHandler = (resolve, reject) => {
        window.authToken = (token) => {
            resolve(token);
        };
    };

    // 确定平台并调用适当的方法
    const platformMethod = isIOS() ? 
        () => window.webkit.messageHandlers.getAuthToken.postMessage('getAuthToken') :
        () => window.peanut_client.getAuthToken();
    
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        tokenHandler(resolve, reject); // 设置令牌处理程序
        platformMethod(); // 调用适当的平台方法
    });
};

/**
 * 获取ios版本号
 */
export const IosVersion = () => {
    // 匹配 iPhone 型号和操作系统版本号
    let match = user_agent.match(/iphone\s*.*?os\s(\d+_\d+_\d+)/i);

    if (match) {
        let iPhoneModel = match[0].trim();  // 提取 iPhone 型号
        // console.log("iPhone Model:", iPhoneModel);  // 输出 iPhone 型号
        // console.log("OS Version:", osVersion);  // 输出 OS 版本号
        // 提取 OS 版本号
        return match[1].split('_')[0];
    } else {
        return null;
    }
}