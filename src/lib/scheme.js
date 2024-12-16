
const requestScheme = (url) => {
    window.location.href = url;
};

export const sendMessage = (phone, msg) => {
    const scheme = `wl://sendmessage?phonenumber=${phone}&message=${msg}`;

    requestScheme(scheme);
};

export const chat = (uid) => {
    const scheme = `wl://chat?uid=${uid}`;

    requestScheme(scheme);
};