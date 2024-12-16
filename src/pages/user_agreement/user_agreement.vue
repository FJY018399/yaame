<!--
 * @Author: Elk
 * @Date: 2023-04-19 10:16:43
 * @FilePath: /yaame-h5/src/pages/user_agreement/user_agreement.vue
 * @Description: 
-->
<template>
    <div id="container" :class="['main', app_info.theme]" data-own="1">
        <page-loading v-if="loading"></page-loading>
        <p>{{ $t('t1') }}</p>
        <p>{{ $t('c1') }}</p>
        <p>{{ $t('t1-1') }}</p>
        <p>{{ $t('t1-2') }}</p>
        <p>{{ $t('t1-3') }}</p>
        <p>{{ $t('t2') }}</p>
        <p>{{ $t('t2-1') }}</p>
        <p>{{ $t('t2-2') }}</p>
        <p>{{ $t('t2-3') }}</p>
        <p>{{ $t('t3') }}</p>
        <p>{{ $t('t3-1') }}</p>
        <p>{{ $t('t3-1-1') }}</p>
        <p>{{ $t('t3-1-2') }}</p>
        <p>{{ $t('t3-2') }}</p>
        <p>{{ $t('t3-2-1') }}</p>
        <p>{{ $t('t3-2-1-1') }}</p>
        <p>{{ $t('t3-2-1-2') }}</p>
        <p>{{ $t('t3-2-1-3') }}</p>
        <p>{{ $t('t3-2-1-4') }}</p>
        <p>{{ $t('t3-2-1-5') }}</p>
        <p>{{ $t('t3-2-2') }}</p>
        <p>{{ $t('t3-3') }}</p>
        <p>{{ $t('t3-3-1') }}</p>
        <p>{{ $t('t3-3-2') }}</p>
        <p>{{ $t('t3-3-3') }}</p>
        <p>{{ $t('t3-4') }}</p>
        <p>{{ $t('t3-4-1') }}</p>
        <p>{{ $t('t3-4-1-1') }}</p>
        <p>{{ $t('t3-4-1-2') }}</p>
        <p>{{ $t('t3-4-1-3') }}</p>
        <p>{{ $t('t3-5') }}</p>
        <p>{{ $t('t3-5-1') }}</p>
        <p>{{ $t('t3-5-2') }}</p>
        <p>{{ $t('t3-6') }}</p>
        <p>{{ $t('t3-6-1') }}</p>
        <p>{{ $t('t4') }}</p>
        <p>{{ $t('t4-1') }}</p>
        <p>{{ $t('t4-1-1') }}</p>
        <p>{{ $t('t4-2') }}</p>
        <p>{{ $t('t4-2-1') }}</p>
        <p>{{ $t('t4-2-2') }}</p>
        <p>{{ $t('t4-3') }}</p>
        <p>{{ $t('t4-3-1') }}</p>
        <p>{{ $t('t4-3-1-a') }}</p>
        <p>{{ $t('t4-3-1-b') }}</p>
        <p>{{ $t('t4-3-1-c') }}</p>
        <p>{{ $t('t4-3-1-d') }}</p>
        <p>{{ $t('t4-3-1-e') }}</p>
        <p>{{ $t('t4-3-1-f') }}</p>
        <p>{{ $t('t4-3-1-g') }}</p>
        <p>{{ $t('t4-4') }}</p>
        <p>{{ $t('t4-4-1') }}</p>
        <p>{{ $t('t5') }}</p>
        <p>{{ $t('t5-1') }}</p>
        <p>{{ $t('t5-1-1') }}</p>
        <p>{{ $t('t5-2') }}</p>
        <p>{{ $t('t5-2-1') }}</p>
        <p>{{ $t('t5-2-1-a') }}</p>
        <p>{{ $t('t5-2-1-b') }}</p>
        <p>{{ $t('t5-2-1-c') }}</p>
        <p>{{ $t('t5-2-1-d') }}</p>
        <p>{{ $t('t5-2-1-e') }}</p>
        <p>{{ $t('t5-2-1-f') }}</p>
        <p>{{ $t('t5-2-1-g') }}</p>
        <p>{{ $t('t5-2-1-h') }}</p>
        <p>{{ $t('t5-2-2') }}</p>
        <p>{{ $t('t5-2-2-a') }}</p>
        <p>{{ $t('t5-2-2-b') }}</p>
        <p>{{ $t('t5-2-2-c') }}</p>
        <p>{{ $t('t5-2-2-d') }}</p>
        <p>{{ $t('t5-2-2-e') }}</p>
        <p>{{ $t('t5-2-2-f') }}</p>
        <p>{{ $t('t5-2-2-g') }}</p>
        <p>{{ $t('t5-2-2-h') }}</p>
        <p>{{ $t('t5-2-3') }}</p>
        <p>{{ $t('t5-3') }}</p>
        <p>{{ $t('t5-3-1') }}</p>
        <p>{{ $t('t6') }}</p>
        <p>{{ $t('t6-1') }}</p>
        <p>{{ $t('t6-1-1') }}</p>
        <p>{{ $t('t6-2') }}</p>
        <p>{{ $t('t6-2-1') }}</p>
        <p>{{ $t('t6-2-1-a') }}</p>
        <p>{{ $t('t6-2-1-b') }}</p>
        <p>{{ $t('t6-2-1-c') }}</p>
        <p>{{ $t('t6-2-1-d') }}</p>
        <p>{{ $t('t6-2-1-e') }}</p>
        <p>{{ $t('t6-2-1-f') }}</p>
        <p>{{ $t('t6-2-1-g') }}</p>
        <p>{{ $t('t6-2-1-h') }}</p>
        <p>{{ $t('t6-2-1-i') }}</p>
        <p>{{ $t('t6-2-1-j') }}</p>
        <p>{{ $t('t6-3') }}</p>
        <p>{{ $t('t6-3-1') }}</p>
        <p>{{ $t('t6-3-2') }}</p>
        <p>{{ $t('t6-3-2-a') }}</p>
        <p>{{ $t('t6-3-2-b') }}</p>
        <p>{{ $t('t6-3-2-c') }}</p>
        <p>{{ $t('t6-3-2-d') }}</p>
        <p>{{ $t('t6-3-2-e') }}</p>
        <p>{{ $t('t6-3-2-f') }}</p>
        <p>{{ $t('t6-3-3') }}</p>
        <p>{{ $t('t7') }}</p>
        <p>{{ $t('t7-1') }}</p>
        <p>{{ $t('t7-2') }}</p>
        <p>{{ $t('t7-3') }}</p>
        <p>{{ $t('t7-4') }}</p>
        <p>{{ $t('t8') }}</p>
        <p>{{ $t('t8-1') }}</p>
        <p>{{ $t('t8-2') }}</p>
        <p>{{ $t('t8-3') }}</p>
        <p>{{ $t('t8-4') }}</p>
        <p>{{ $t('t8-5') }}</p>
        <p>{{ $t('t8-5-a') }}</p>
        <p>{{ $t('t8-5-b') }}</p>
        <p>{{ $t('t8-6') }}</p>
        <p>{{ $t('t8-7') }}</p>
        <p>{{ $t('t8-9') }}</p>
        <p>{{ $t('t8-10') }}</p>
        <p>{{ $t('t8-11') }}</p>
        <p>{{ $t('t8-12') }}</p>
        <p>{{ $t('t8-13') }}</p>
        <p>{{ $t('t9') }}</p>
        <p>{{ $t('t9-1') }}</p>
        <p>{{ $t('t9-2') }}</p>
        <p>{{ $t('t9-3') }}</p>
        <p>{{ $t('t9-4') }}</p>
        <p>{{ $t('t10') }}</p>
        <p>{{ $t('t10-1') }}</p>
        <p>{{ $t('t10-2') }}</p>
        <p>{{ $t('t10-3') }}</p>
        <p>{{ $t('t11') }}</p>
        <p>{{ $t('t11-1') }}</p>
        <p>{{ $t('t11-2') }}</p>
        <p>{{ $t('t11-2-a') }}</p>
        <p>{{ $t('t11-2-b') }}</p>
        <p>{{ $t('t11-2-c') }}</p>
        <p>{{ $t('t11-2-d') }}</p>
        <p>{{ $t('t12') }}</p>
        <p>{{ $t('t12-1') }}</p>
        <p>{{ $t('t12-2') }}</p>
        <p>{{ $t('t12-3') }}</p>
        <p>{{ $t('t12-4') }}</p>
        <p>{{ $t('t12-5') }}</p>
        <p>{{ $t('t12-6') }}</p>
        <p>{{ $t('t12-7') }}</p>
        <p>{{ $t('t12-8') }}</p>
        <p>{{ $t('t12-9') }}</p>
        <p>{{ $t('t12-9-1') }}</p>
        <p>{{ $t('t12-9-1-1') }}</p>
        <p>{{ $t('t12-9-1-2') }}</p>
        <p>{{ $t('t12-9-2') }}</p>
        <p>{{ $t('t12-9-3') }}</p>
        <p>{{ $t('t12-9-3-1') }}</p>
        <p>{{ $t('t12-9-3-2') }}</p>
        <p>{{ $t('t12-10') }}</p>

        <p>{{ $t('t13') }}</p>
        <p>{{ $t('c13') }}</p>
    </div>
</template>
<script>
    import app_config from '../../lib/app_info.js';
    import { getAppType, getChannel } from '../../lib/device.js';
    import pageLoading from '../../components/common/page_loading.vue';
    import { getQueryString } from '../../lib/utils';
    export default {
        components: {
            pageLoading
        },
        data() {
            return {
                loading: true,
                app_info: app_config.app_info,
                app_type: getQueryString('app_type') || getAppType() || 'peanut'
            };
        },
        mounted() {
            let self = this;
            document.title = 'User Agreement';
            this.$nextTick(() => {
                self.loading = false;
            });
        },
    };
</script>
<style scoped>
    .main{
        padding: .3rem .4rem;
        text-align: justify;
    }

    .main.dark{
        background: #121212;
        
    }
    .main.dark .title{
        color: rgba(255, 255, 255, 0.8);
    }
    .main.dark p{
        color: rgba(255, 255, 255, 0.6);
    }
    .main.dark b{
        color: rgba(255, 255, 255, 0.8);
    }

    .main .title {
        margin-top: .6rem;
        font-size: 0.4rem;
        font-weight: bold;
        color: #393939;
        width: 100%;
        text-align: center;
    }

    .main p {
        margin-top: .4rem;
        line-height: 1.5;
        font-size: 0.32rem;
        color: #666;
        text-align: justify;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        word-break: break-all;
    }

    .main b {
        color: #2A2A2A;;
        font-weight: bold;
    }
    .font-bold{
        font-weight: bold;
        text-align: center;
        width: 100%;
    }
</style>