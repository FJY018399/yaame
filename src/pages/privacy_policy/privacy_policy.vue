<template>
    <div id="container" :class="['main', app_info.theme]" data-own="1">
        <page-loading v-if="loading"></page-loading>
        <p>{{ $t('ReleaseTime') }}<br />
            {{ $t('EffectiveTime') }}
        </p>
        <p>
            {{ $t('Title') }}
        </p>
        <p>
            {{ $t('t1') }}
        </p>
        <p>
            {{ $t('c1') }}
        </p>
        <p>
            {{ $t('t1-1') }}
        </p>
        <p>{{ $t('t1-2') }}</p>
        <p>{{ $t('t1-3') }}</p>
        <p>{{ $t('t1-4') }}</p>
        <p>{{ $t('t1-5') }}</p>
        <p>{{ $t('t1-6') }}</p>
        <p>{{ $t('t1-7') }}</p>
        <p>{{ $t('t1-7-1') }}</p>
        <p>{{ $t('t1-7-2') }}</p>
        <p>{{ $t('t1-7-3') }}</p>
        <p>{{ $t('t1-7-4') }}</p>
        <p>{{ $t('t1-7-5') }}</p>
        <p>{{ $t('t1-7-6') }}</p>
        <p>{{ $t('t1-7-7') }}</p>
        <p>{{ $t('t1-7-8') }}</p>
        <p>{{ $t('t1-7-9') }}</p>
        <p>{{ $t('t1-7-10') }}</p>
        <p>{{ $t('t2') }}</p>
        <p>{{ $t('t2-1') }}</p>
        <p>{{ $t('t2-2') }}</p>
        <p>{{ $t('t2-2-1') }}</p>
        <p>{{ $t('t2-3') }}</p>
        <p>{{ $t('t2-3-1') }}</p>
        <p>{{ $t('t2-3-2') }}</p>
        <p>{{ $t('t2-3-2-1') }}</p>
        <p>{{ $t('t2-3-2-2') }}</p>
        <p>{{ $t('t2-3-2-3') }}</p>
        <p>{{ $t('t2-3-3') }}</p>
        <p>{{ $t('t2-3-4') }}</p>
        <p>{{ $t('t2-4') }}</p>
        <p>{{ $t('t2-4-1') }}</p>
        <p>{{ $t('t2-4-2') }}</p>
        <p>{{ $t('t2-4-3') }}</p>
        <p>{{ $t('t2-4-4') }}</p>
        <p>{{ $t('t2-4-5') }}</p>
        <p>{{ $t('t2-5-1') }}</p>
        <p>{{ $t('t2-5-2') }}</p>
        <p>{{ $t('t2-5-3') }}</p>
        <p>{{ $t('t2-5-4') }}</p>
        <p>{{ $t('t2-5-5') }}</p>
        <p>{{ $t('t2-5-6') }}</p>
        <p>{{ $t('t2-5-7') }}</p>
        <p>{{ $t('t2-6') }}</p>
        <p>{{ $t('t2-6-1') }}</p>
        <p>{{ $t('t2-7') }}</p>
        <p>{{ $t('t2-7-1') }}</p>
        <p>{{ $t('t2-7-2') }}</p>
        <p>{{ $t('t2-7-2-1') }}</p>
        <p>{{ $t('t2-7-2-2') }}</p>
        <p>{{ $t('t2-7-2-3') }}</p>
        <p>{{ $t('t2-7-2-4') }}</p>
        <p>{{ $t('t2-7-2-5') }}</p>
        <p>{{ $t('t2-7-2-6') }}</p>
        <p>{{ $t('t2-7-2-7') }}</p>
        <p>{{ $t('t2-7-2-8') }}</p>
        <p>{{ $t('t2-7-2-9') }}</p>
        <p>{{ $t('t2-7-2-10') }}</p>
        <p>{{ $t('t2-7-2-11') }}</p>
        <p>{{ $t('t2-7-3') }}</p>
        <p>{{ $t('t3') }}</p>
        <p>{{ $t('t3-1') }}</p>
        <p>{{ $t('c3-1') }}</p>
        <p>{{ $t('t3-1-1') }}</p>
        <p>{{ $t('t3-1-2') }}</p>
        <p>{{ $t('t3-2') }}</p>
        <p>{{ $t('t3-2-1') }}</p>
        <p>{{ $t('t3-2-2') }}</p>
        <p>{{ $t('t4') }}</p>
        <p>{{ $t('t4-1') }}</p>
        <p>{{ $t('t4-1-1') }}</p>
        <p>{{ $t('t4-2') }}</p>
        <p>{{ $t('t4-2-1') }}</p>
        <p>{{ $t('c4-2-1') }}</p>
        <p>{{ $t('t4-2-2') }}</p>
        <p>{{ $t('c4-2-2') }}</p>
        <p>{{ $t('t4-2-3') }}</p>
        <p>{{ $t('c4-2-3') }}</p>
        <p>{{ $t('t4-2-4') }}</p>
        <p>{{ $t('c4-2-4') }}</p>
        <p>{{ $t('t4-2-5') }}</p>
        <p>{{ $t('c4-2-5') }}</p>
        <p>{{ $t('t4-2-6') }}</p>
        <p>{{ $t('c4-2-6') }}</p>
        <p>{{ $t('t4-2-7') }}</p>
        <p>{{ $t('c4-2-7') }}</p>
        <p>{{ $t('t4-2-8') }}</p>
        <p>{{ $t('c4-2-8') }}</p>
        <p>{{ $t('t5') }}</p>
        <p>{{ $t('t5-1') }}</p>
        <p>{{ $t('t5-1-1') }}</p>
        <p>{{ $t('t5-1-2') }}</p>
        <p>{{ $t('t5-1-3') }}</p>
        <p>{{ $t('t5-2') }}</p>
        <p>{{ $t('t5-2-1') }}</p>
        <p>{{ $t('t5-2-2') }}</p>
        <p>{{ $t('t5-2-3') }}</p>
        <p>{{ $t('t5-3') }}</p>
        <p>{{ $t('t5-3-1') }}</p>
        <p>{{ $t('t5-3-2') }}</p>
        <p>{{ $t('t5-3-3') }}</p>
        <p>{{ $t('t5-4') }}</p>
        <p>{{ $t('t5-4-1') }}</p>
        <p>{{ $t('t5-4-1-1') }}</p>
        <p>{{ $t('t5-4-1-2') }}</p>
        <p>{{ $t('t5-5') }}</p>
        <p>{{ $t('t5-5-1') }}</p>
        <p>{{ $t('t5-5-1-1') }}</p>
        <p>{{ $t('t5-5-1-2') }}</p>
        <p>{{ $t('t5-5-1-3') }}</p>
        <p>{{ $t('t5-6') }}</p>
        <p>{{ $t('t5-6-1') }}</p>
        <p>{{ $t('t5-6-1-1') }}</p>
        <p>{{ $t('t5-6-1-2') }}</p>
        <p>{{ $t('t5-6-1-3') }}</p>
        <p>{{ $t('t5-6-1-4') }}</p>
        <p>{{ $t('t5-6-1-5') }}</p>
        <p>{{ $t('t5-6-1-6') }}</p>
        <p>{{ $t('t5-6-2') }}</p>
        <p>{{ $t('t6') }}</p>
        <p>{{ $t('t6-1') }}</p>
        <p>{{ $t('t6-2') }}</p>
        <p>{{ $t('t6-3') }}</p>
        <p>{{ $t('t6-4') }}</p>
        <p>{{ $t('t6-5') }}</p>
        <p>{{ $t('t6-6') }}</p>
        <p>{{ $t('t7') }}</p>
        <p>{{ $t('t7-1') }}</p>
        <p>{{ $t('t7-2') }}</p>
        <p>{{ $t('t7-2-1') }}</p>
        <p>{{ $t('t7-2-1-1') }}</p>
        <p>{{ $t('t7-2-1-2') }}</p>
        <p>{{ $t('t7-2-1-3') }}</p>
        <p>{{ $t('t7-2-2') }}</p>
        <p>{{ $t('t7-3') }}</p>
        <p>{{ $t('t7-3-1') }}</p>
        <p>{{ $t('t7-3-2') }}</p>
        <p>{{ $t('t7-3-2-1') }}</p>
        <p>{{ $t('t7-3-2-2') }}</p>
        <p>{{ $t('t7-3-2-3') }}</p>
        <p>{{ $t('t7-3-2-4') }}</p>
        <p>{{ $t('t7-3-2-4') }}</p>
        <p>{{ $t('t7-3-2-5') }}</p>
        <p>{{ $t('t7-3-3') }}</p>
        <p>{{ $t('t7-3-4') }}</p>
        <p>{{ $t('t7-4') }}</p>
        <p>{{ $t('t7-4-1') }}</p>
        <p>{{ $t('t7-4-2') }}</p>
        <p>{{ $t('t7-4-3') }}</p>
        <p>{{ $t('t7-5') }}</p>
        <p>{{ $t('t7-5-1') }}</p>
        <p>{{ $t('t7-6') }}</p>
        <p>{{ $t('t7-6-1') }}</p>
        <p>{{ $t('t7-7') }}</p>
        <p>{{ $t('t7-7-1') }}</p>
        <p>{{ $t('t7-8') }}</p>
        <p>{{ $t('t7-8-1') }}</p>
        <p>{{ $t('t7-8-2') }}</p>
        <p>{{ $t('t7-8-3') }}</p>
        <p>{{ $t('t7-8-3-1') }}</p>
        <p>{{ $t('t7-8-3-2') }}</p>
        <p>{{ $t('t7-8-3-3') }}</p>
        <p>{{ $t('t7-8-3-4') }}</p>
        <p>{{ $t('t7-8-3-5') }}</p>
        <p>{{ $t('t7-8-3-6') }}</p>
        <p>{{ $t('t7-8-3-7') }}</p>
        <p>{{ $t('t7-8-3-8') }}</p>
        <p>{{ $t('t8') }}</p>
        <p>{{ $t('t8-1') }}</p>
        <p>{{ $t('t8-2') }}</p>
        <p>{{ $t('t9') }}</p>
        <p>{{ $t('t9-1') }}</p>
        <p>{{ $t('t9-2') }}</p>
        <p>{{ $t('t10') }}</p>
        <p>{{ $t('t10-1') }}</p>
        <p>{{ $t('t10-2') }}</p>
        <p>{{ $t('t10-3') }}</p>
        <p>{{ $t('t10-3-1') }}</p>
        <p>{{ $t('t10-3-2') }}</p>
        <p>{{ $t('t10-3-3') }}</p>
        <p>{{ $t('t10-3-4') }}</p>
        <p>{{ $t('t10-3-5') }}</p>
        <p>{{ $t('t10-3-6') }}</p>
        <p>{{ $t('t10-4') }}</p>
        <p>{{ $t('t11') }}</p>
        <p>{{ $t('t11-1') }}</p>
        <p>{{ $t('t11-2') }}</p>
        <p>{{ $t('t11-3') }}</p>
        

        
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
            document.title = 'Privacy Policy';
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
        white-space: pre-line;
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