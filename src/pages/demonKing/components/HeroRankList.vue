<template>
    <div class="hurtRankList">
        <header class="list-header">
            <div>{{ $t('demonKingForms') }}</div>
            <div>{{ $t('highestDamage') }}</div>
            <div>{{ $t('killTime') }}</div>
        </header>
        <refresh ref="wlRefresh" @onRefresh="onRefresh">
            <div style="overflow: hidden scroll; padding-bottom: 1.5rem" v-if="list && list.length">
                <div v-for="(item,index) in list" :key="index" class="list-item">
                    <div class="img-box">
                        <img :src="item.monster_icon" alt="">

                        <div class="img-text">{{ item.monster_name }}</div>
                    </div>
                    <div v-if="item.harmful_warrior" class="info-box" @click="toDetails(item.harmful_warrior)">
                        <div class="user-avatar">
                            <img :src="item.harmful_warrior.avatar">
                        </div>
                        <div class="info-content">
                            <p class="no-wrap">{{ item.harmful_warrior.nick_name }}</p>
                            <p>{{ `${ $t('dealDamage') }: ${ item.harmful_warrior.harmful_blood_amount }` }}</p>
                        </div>
                    </div>

                    <div v-else class="info-box flex-box">
                        <span>{{ $t('fullHealth') }}</span>
                    </div>

                    <div v-if="item.kill_time" class="time-box">
                        <p class="user-name no-wrap">{{ formatDate(item.kill_time, 'MM.dd') }}</p>
                        <p class="info-small-p no-wrap">{{ formatDate(item.kill_time, 'hh:mm:ss') }}</p>
                    </div>
                </div>
            </div>

            <!--            </van-list>-->
        </refresh>
        <div v-show="!list.length" class="empty">
            <div><img src="http://imgcom.static.suishenyun.net/zanwushuju@1.5x-edc898.png" alt=""></div>
            <p>{{ $t('emptyList') }}</p>
        </div>
    </div>
</template>

<script>
    import { getDemonKingHero } from '@/lib/request/draw';
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


                userInfo: {}
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            async getList(page = 1) {
                let res = await getDemonKingHero({
                    activityType: 'BIG_MONSTER',
                    activity_cycle_flag: this.activity_cycle_flag,
                });
                if (res.status === 1000) {
                    this.list = res.data.content;
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
    margin-bottom: 0.5rem;
    height: 1rem;
}

.img-box {
    background: #2E197F;
    border-radius: 0.12rem;
    width: 1rem;
    height: 1rem;
    position: relative;
}
.img-text {
    width: 1.4rem;
    height: 1.4rem;
    position: absolute;
    left: -0.2rem;
    top: -0.2rem;
    background-image: url(https://yaame-static.yaame.io/admin/2e816a43f6f3d09da6426819fbc0685c.png);
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 1.06rem;
    text-align: center;
    transform: scale(0.714);
}
.img-box > img {
    width: 1rem;
    height: 1rem;
    //margin: 0.1rem;
}

.info-box {
    width: 4rem;
    color: #F3EDCD;
    font-size: 0.24rem;
    padding-left: 0.54rem;
    display: flex;
    .user-avatar {
        width: 0.9rem;
        height: 0.9rem;
        border: 0.02rem solid #FDF4D0;
        border-radius: 50%;
        margin-right: 0.2rem;

        img {
            width: 0.86rem;
            height: 0.86rem;
            border-radius: 50%;
        }
    }

    .info-content {
        width: 2.45rem;

    }
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
    width: 1.5rem;
    color: #fff;
    font-size: 0.24rem;
    margin-left: 0.2rem;
    padding-top: 0.2rem;
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
.flex-box {
    display: flex;
    align-items: center;
}
</style>