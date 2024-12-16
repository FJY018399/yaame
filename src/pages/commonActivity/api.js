import http, { getBaseUrl } from "../../lib/http";

export const getCommonActivity = async (options) => {
    let url = await getBaseUrl("get", `/yaame/api/h5/auth/image/content/${options.activity_id}`);
    return http(url, "get");
};
