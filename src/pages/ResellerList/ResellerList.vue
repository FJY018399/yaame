<template>
    <div :style="{ 'background-image': `url(${getBackGroundImg()})` }" class="main">
        <CustomHeader style="position: fixed;" color="white">{{ $t('title') }}</CustomHeader>

        <div class="content">
            <refresh ref="wlRefresh" @onRefresh="handleRefresh">
                <ul v-infinite-scroll="loadMore" :infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="10" class="reseller-list"
                >
                    <li v-for="(item, index) in list" :key="index" class="reseller-item" @click="toDetails(item)">
                        <img class="reseller-item-img" :src="item.avatar" alt="">
                        <p class="reseller-item-name no-wrap">{{ item.nick_name }}</p>
                        <p class="reseller-item-id no-wrap">ID: {{ item.peanut_id }}</p>
                        <span v-if="item.im_status == 'ONLINE'" class="reseller-online"></span>
                    </li>
                </ul>
                <blackPage v-if="!list || !list.length" height="40vh"></blackPage>
            </refresh>
        </div>
    </div>
</template>

<script setup>
    import CustomHeader from '@/components/common/header.vue';
    import refresh from "@/components/common/refresh.vue";
    import blackPage from "@/components/common/blank_page.vue";
    import { ref, onMounted, computed } from "vue";
    import { getLanguage } from "@/lib/device";
    import { getResellerList } from './api';

    let language = computed(() => {
        let locale = getLanguage() || "en";
        if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
            let localEnum = {
                "zh-hk": "zh-tw",
                "zh-tw": "zh-tw",
                "zh-mo": "zh-tw",
                "zh-cn": "zh-cn",
                zh_cn: "zh-cn",
            };

            locale = localEnum[locale];
        }
        return locale;
    });

    const getBackGroundImg = () => {
        let img = "";
        switch (language.value) {
            case "zh-tw":
                img = 'https://yaame-static.yaame.io/admin/7b5777069cf1c23f34219ffb0c272082.png';
                break;
            case "zh-cn":
                img = 'https://yaame-static.yaame.io/admin/96c6fb3b54c836b288c26760aa76c4d1.png';
                break;
            case "en":
                img = 'https://yaame-static.yaame.io/admin/2711ef63407823989a664916dd586a6a.png';
                break;
            case "id":
                img = 'https://yaame-static.yaame.io/admin/2711ef63407823989a664916dd586a6a.png';
                break;
            case "ar":
                img = 'https://yaame-static.yaame.io/admin/35f39984d1987cab868b58304240ffa1.png';
                break;
            default:
                img = 'https://yaame-static.yaame.io/admin/2711ef63407823989a664916dd586a6a.png';
                break;
        }
        return img;
    };

    let list = ref([]);
    let page = ref(1);
    let hasNext = ref(true);
    const getList = async () => {
        try {
            let res = await getResellerList({
                page: page.value,
                size: 20,
            });
            if (res.status !== 1000) return;
            if (page.value === 1) {
                list.value = res.data.content;
            } else {
                list.value = list.value.concat(res.data.content);
            }
            
            hasNext.value = res.data.has_next;
        } catch (e) {
            throw new Error(e);
        }
    };

    let wlRefresh = ref(null);
    const handleRefresh = async () => {
        list.value = [];
        await getList();
        setTimeout(() => {
            wlRefresh.value.isLoading = false;
        }, 500);
    };

    const loadMore = () => {
        if (hasNext.value) {
            page.value++;
            getList();
        }
    };

    const toDetails = (item) => {
        if (item.uid) {
            location.href = `wlyaame://trend/user?uid=${item.uid}`;
        }
    }

    onMounted(async () => {
        await getList();
    });

</script>

<style scoped lang="less">
.main {
    width: 7.5rem;
    min-height: 100vh;
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 7rem;
    padding-bottom: 0.3rem;

    .content {
        width: 6.9rem;
        min-height: 40vh;
        background: #98E0FC;
        border-radius: 0.24rem;
        border: 0.02rem solid #FFFFFF;
        margin-left: 0.3rem;
        .reseller-list {
            padding: 0.3rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .reseller-item {
                width: 3.05rem;
                height: 3.27rem;
                background: #FFFFFF;
                border-radius: 0.18rem;
                margin-bottom: 0.2rem;
                position: relative;
                .reseller-item-img {
                    width: 1.45rem;
                    height: 1.45rem;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    left: 0.8rem;
                    top: 0.5rem;
                }
                .reseller-item-name {
                    width: 3.05rem;
                    font-size: 0.24rem;
                    color: #333333;
                    position: absolute;
                    left: 0;
                    top: 2.2rem;
                    text-align: center;
                }
                .reseller-item-id {
                    width: 3.05rem;
                    font-size: 0.20rem;
                    color: #999999;
                    position: absolute;
                    left: 0;
                    top: 2.57rem;
                    text-align: center;
                }
                .reseller-online{
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    background: #52CE97;
                    border: 0.01rem solid #FFFFFF;
                    border-radius: 50%;
                    position: absolute;
                    right: 0.96rem;
                    top: 1.7rem;
                }
            }
        }
    }
}
</style>