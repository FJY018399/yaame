function replaceTextOnPage(from, to) {
    function quote(str) {
        return (str + '').replace(/([.?*+^$[\\]\\\\(){}|-])/g, "\\\\$1");
    }

    let p_list = document.getElementsByTagName('p');
    let b_list = document.getElementsByTagName('b');
    let title_list = document.getElementsByTagName('title');
    let li_list = document.getElementsByTagName('title');
    let arr = [...p_list, ...b_list, ...title_list, ...li_list]
    for (let i = 0; i < arr.length; i++) {
        let node = arr[i];
        if (node.innerHTML) {
            node.innerHTML = node.innerHTML.replace(new RegExp(quote(from), 'g'), to);
        }
    }
}
var user_agent = navigator.userAgent.toLocaleLowerCase();

function isAndroid() {
    return (/android/i).test(user_agent);
};

/**
 * 从UA中获取信息
 */
function getDataFromUserAgent(key) {
    var data = '';
    var po = user_agent.indexOf(key);
    if (po > -1) {
        var str = user_agent.substring(po + key.length, user_agent.length);
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
function getDataArrayFromUserAgent () {
    var array = [];
    var po = user_agent.indexOf('ssy={');
    if (po > -1) {
        var str = user_agent.substring(po + 5, user_agent.length);
        po = str.indexOf('}');
        if (po > -1) {
            array = str.substring(0, po);
            array = str.split(';');
        }
    }
    return array;
};
function getChannel () {
    var array = getDataArrayFromUserAgent();

    return array[2];
};
function getQueryString (key) {
    if (typeof window !== 'undefined') {
        let url = location.search;
        let theRequest = {};
        if (url.indexOf('?') !== -1) {
            let str = url.substr(1);
            let strs = str.split('&');
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
            }
        }
        return theRequest[key] == null ? '' : theRequest[key];
    }
};
var app_type = getDataFromUserAgent('app_type=');
var channel = getQueryString('c') || getChannel() || 'default';

if(app_type === 'sweet') {
    if (getChannel() === 'vivo') {
        replaceTextOnPage('蘑菇语音', '欢欣西柚');
    } else {
        replaceTextOnPage('蘑菇语音', '西柚');
    }
    replaceTextOnPage('涌乐', '欢欣鲤跃');
} else if(getQueryString('app_type') === 'sweet') {
    replaceTextOnPage('蘑菇语音', '西柚');
    replaceTextOnPage('涌乐', '欢欣鲤跃');
}
if(app_type === 'cu') {
    replaceTextOnPage('蘑菇语音', 'CU语音');
    replaceTextOnPage('涌乐', '欢欣鲤跃');
} else if(getQueryString('app_type') === 'cu') {
    replaceTextOnPage('蘑菇语音', 'CU语音');
    replaceTextOnPage('涌乐', '欢欣鲤跃');
}


if (app_type === 'planet') {
    if (channel === 'appstore') {
        replaceTextOnPage('蘑菇语音', 'TuTu');
        document.getElementById('container').className = 'main dark';
        if (document.getElementById('tutu')) {
            document.getElementById('tutu').style = 'display: block';
        }
    } else {
        replaceTextOnPage('蘑菇语音', '蘑咕咕');
    }
    replaceTextOnPage('北京涌乐', '北京鲤跃互动文化');
} else if(getQueryString('app_type') === 'planet') {
    if (channel === 'appstore') {
        replaceTextOnPage('蘑菇语音', 'TuTu');
    } else {
        replaceTextOnPage('蘑菇语音', '蘑咕咕');
    }
    if (document.getElementById('tutu')) {
        document.getElementById('tutu').style = 'display: block';
    }
    replaceTextOnPage('北京涌乐', '北京鲤跃互动文化');
    // replaceTextOnPage('北京市丰台区', '沈阳市浑南区');
}