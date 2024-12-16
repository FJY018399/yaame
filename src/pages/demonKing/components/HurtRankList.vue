<template>
    <div class="hurtRankList">
        <header class="list-header">
            <div>{{ $t('rankSort') }}</div>
            <div>{{ $t('nickName') }}</div>
            <div>{{ $t('hurtNum') }}</div>
        </header>
        <refresh ref="wlRefresh" @onRefresh="onRefresh">
            <div style="overflow: hidden scroll; padding-bottom: 1.9rem" v-if="list && list.length">
                <div v-for="(item,index) in list" :key="index" class="list-item" @click="toDetails(item)">
                    <div :class="['sort', 'sort-' + item.rank]">
                        <div v-if="item.rank <= 10" class="sort-img">
                            <p>NO.{{ item.rank }}</p>
                        </div>

                        <div v-else class="sort-text">
                            <p>NO.{{ item.rank }}</p>
                        </div>
                    </div>
                    <div class="img-box">
                        <img :src="item.avatar" alt="">
                    </div>
                    <div class="info-content">
                        <p class="user-name no-wrap">{{ item.nick_name }}</p>
                    </div>

                    <div class="time-box">
                        <p class="user-name no-wrap">{{ item.damage }}</p>
                    </div>
                </div>
            </div>
        </refresh>

        <div v-if="userInfo" class="userInfo">
            <div class="list-item">
                <div :class="['sort', 'sort-' + userInfo.rank]">
                    <div v-if="userInfo.rank <= 10" class="sort-img">
                        <p>NO.{{ userInfo.rank }}</p>
                    </div>

                    <div v-else class="sort-text">
                        <p>NO.{{ userInfo.rank || '99+' }}</p>
                    </div>
                </div>
                <div class="img-box">
                    <img :src="userInfo.avatar" alt="">
                </div>
                <div class="info-content">
                    <p class="user-name no-wrap">{{ userInfo.nick_name }}</p>
                </div>

                <div class="time-box">
                    <p class="user-name no-wrap">{{ userInfo.damage || '0' }}</p>
                </div>
            </div>
        </div>
        <div v-show="!list.length" class="empty">
            <div><img src="http://imgcom.static.suishenyun.net/zanwushuju@1.5x-edc898.png" alt=""></div>
            <p>{{ $t('emptyList') }}</p>
        </div>
    </div>
</template>

<script>
    import { getDemonKingDamage } from '@/lib/request/draw';
    import refresh from "@/components/common/refresh.vue";
    import { formatDate } from '@/lib/utils';

    export default {
        components: {
            refresh
        },
        props: {
            activity_cycle_flag: {
                type: String,
                default: ''
            },
            monster_id: {
                type: Number | null,
                default: null,
            }
        },
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                refreshing: false,
                has_next: true,
                page: 0,


                userInfo: false
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            async getList() {
                let res = await getDemonKingDamage({
                    activityType: 'BIG_MONSTER',
                    activity_cycle_flag: this.activity_cycle_flag,
                });
                if (res.status === 1000) {
                    this.list = res.data.rank_infos;
                    this.userInfo = res.data.my_rank;
                }
            },
            async onRefresh() {
                await this.getList();
                setTimeout(() => {
                    this.$refs.wlRefresh.isLoading = false;
                }, 500);
            },
            formatDate,

            toDetails(item) {
                if (item.uid) {
                    location.href = `wlyaame://trend/user?uid=${item.uid}`;
                }
            },
        },
    };
</script>

<style lang="less" scoped>
.hurtRankList {
    width: 6.9rem;
    min-height: 10rem;
    /* overflow-y: scroll; */
    padding-top: 0.36rem;
    position: relative;
}

.list-header {
    opacity: 0.6;
    display: flex;
    font-size: 0.2rem;
    color: #ffffff;
    font-weight: 400;
    margin-bottom: 0.28rem;
}

.list-header > div {
    transform: scale(0.833);
}

.list-header > div:nth-child(1) {
    width: 3.16rem;
    padding-left: 0.6rem;
}

.list-header > div:nth-child(2) {
    width: 2.34rem;
}

.list-header > div:nth-child(3) {
    width: 1.15rem;
}


.list-item {
    padding-left: 0.5rem;
    display: flex;
    margin-bottom: 0.4rem;
    height: 0.9rem;
}

.sort {
    width: 1.04rem;
    height: 0.9rem;
    font-size: 0.24rem;
    font-weight: normal;
    color: #55BB9C;
    padding-top: 0.26rem;
    margin-right: 0.33rem;
}
.sort-1 {
    .sort-img {
        background-image: url(https://yaame-static.yaame.io/admin/bb1a9987a6c8fc9e6ea95bc473632102.png);
        color: #FFCF62;
    }
}
.sort-2, .sort-3 {
    .sort-img {
    background-image: url(https://yaame-static.yaame.io/admin/57214188f72b874ee6e59b9d6f2f2cbd.png);
    color: #2044AA;
    }
}
.sort-img {
    width: 1.04rem;
    height: 0.38rem;
    background-image: url(https://yaame-static.yaame.io/admin/7dd29c0f7fc70370f42b64eb6e5ae789.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-left: 0.36rem;
    font-size: 0.24rem;
    color: #118360;
    padding-top: 0.04rem;
    p {
        transform: scale(0.833);
    }
}
.sort-text {
    width: 1.04rem;
    height: 0.38rem;
    text-align: center;
}
.img-box {
    width: 0.9rem;
    height: 0.9rem;
    border: 0.02rem solid #FDF4D0;
    border-radius: 50%;
    margin-right: 0.2rem;
}

.img-box > img {
    width: 0.86rem;
    height: 0.86rem;
    border-radius: 50%;
}

.info-box {
    width: 1.4rem;
    color: #fff;
    font-size: 0.24rem;
}

.info-content {
    width: 2.45rem;
    margin-left: 0.2rem;
    font-size: 0.24rem;
    font-weight: normal;
    color: #F3EDCD;
    line-height: 0.9rem;
}

.big-info {
    width: 1.7rem;
    color: #fff;
    font-size: 0.24rem;
}

.empty-box {
    width: 1.4rem;
    margin-right: 0.3rem;
    line-height: 1rem;
    color: #fff;
    font-size: 0.24rem;
}

.time-empty-box {
    width: 1.4rem;
    line-height: 1rem;
    color: #fff;
    font-size: 0.24rem;
    margin-left: 0.2rem;
}

.user-name {
    font-weight: 500;
}

.info-small-p {
    width: 2.04rem;
    margin-left: -0.17rem;
    transform: scale(0.83333);
}

.time-box {
    width: 1.28rem;
    color: #F3EDCD;
    font-size: 0.24rem;
    padding-top: 0.24rem;
}

.time-box > p {
    width: 1.5rem;
}

.empty {
    position: absolute;
    width: 4rem;
    height: 1.2rem;
    left: calc(50% - 2rem);
    top: calc(50% - 0.6rem);
    font-size: .24rem;
    color: rgba(255, 255,255, 0.8);
    text-align: center;

}

.empty img {
    width: .54rem;
    height: auto;
    margin-bottom: .1rem;
}
.userInfo {
    position: fixed;
    bottom: 0.4rem;
    left: 0.5rem;
    background-color: #4E30DC;
    width: 6.5rem;
    height: 1.34rem;
    border-radius: 0.1rem 0.1rem 0 0;
    display: flex;
    padding-left: 0.25rem;
    padding-top: 0.3rem;
    z-index: 49;
    .list-item {
        padding-left: 0;
    }
}
</style>