export const local_storage = {
    get(key) {
        let obj = window.localStorage.getItem(key);
        let entry = JSON.parse(obj);

        if (entry == null) {
            return null;
        }

        if (entry.endTime !== 0) {
            if (entry.endTime - new Date().getTime() <= 0) {
                window.localStorage.removeItem(key);
                return null;
            }
        }

        if (entry.data == null) {
            return null;
        }

        return entry.isObject ? JSON.parse(entry.data) : entry.data;
    },
    check(key) {
        return !(window.localStorage.getItem(key) == null);
    },
    set(key, value, timestamp) {
        window.localStorage.removeItem(key);

        if (!value) return;

        let entry = {};

        entry.endTime = !timestamp ? 0 : new Date().getTime() + timestamp;
        entry.isObject = value instanceof Object;
        entry.data = entry.isObject ? JSON.stringify(value) : value;

        window.localStorage.setItem(key, JSON.stringify(entry));
    }
};
export const cookie_storage = {
    get(key) {
        let res = '';
        let reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        let arr = document.cookie.match(reg);

        if (arr) {
            res = unescape(arr[2]);
        }

        return res;
    },
    set(key, value) {

        let expires = new Date().getTime() + 365 * 24 * 60 * 60 * 1000;

        document.cookie = key + '=' + value + ';expires=' + expires;
    }
};

export const session_storage = {
    get(key) {
        let obj = window.sessionStorage.getItem(key);
        let entry = JSON.parse(obj);

        if (entry == null) {
            return null;
        }

        if (entry.endTime !== 0) {
            if (entry.endTime - Date.now() <= 0) {
                window.sessionStorage.removeItem(key);
                return null;
            }
        }

        if (entry.data == null) {
            return null;
        }

        return entry.isObject ? JSON.parse(entry.data) : entry.data;
    },
    check(key) {
        return !!window.sessionStorage.getItem(key);
    },
    set(key, value, timestamp) {
        window.sessionStorage.removeItem(key);
        if (!value) return;
        let entry = {};
        entry.endTime = !timestamp ? 0 : Date.now() + timestamp;
        entry.isObject = value instanceof Object;
        entry.data = entry.isObject ? JSON.stringify(value) : value;
        window.sessionStorage.setItem(key, JSON.stringify(entry));
    }
};