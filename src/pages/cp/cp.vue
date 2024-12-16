<template>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>
<script>
import { isIOS } from "../../lib/device";

export default {
    mounted() {
        if (isIOS()) {
            window.webkit.messageHandlers.onLogEvent.postMessage(
                JSON.stringify({
                    event_name: "page_view_cp",
                    cid: -1003,
                    md: 108,
                    args_name: "page_view_cp",
                })
            );
        } else {
            window.peanut_client.onLogEvent(
                JSON.stringify({
                    event_name: "page_view_cp",
                    cid: -1003,
                    md: 108,
                    args_name: "page_view_cp",
                })
            );
        }
    },
};
</script>
<style scoped lang="less"></style>
