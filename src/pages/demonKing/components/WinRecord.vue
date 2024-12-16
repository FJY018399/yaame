<!--
 * @Author: Se7enElk
 * @Date: 2022-03-04 17:09:04
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-25 14:43:21
 * @FilePath: /peanut_h5/src/pages/demonKing/components/WinRecord.vue
 * @Description: 大魔王中奖记录弹窗
-->
<template>
    <popup class="flexBox">
        <div class="winRecord">
            <img class="close-btn" src="https://yaame-static.yaame.io/admin/f9890c3f3df1d0edce6098ab86c7e3db.png" alt="close" @click="close()">
            <header class="header">{{ $t('winningRecords') }}</header>
            <div v-if="records_list && records_list.length" class="list-container">
                <div v-for="(item, index) in records_list" :key="index" class="list-item">
                    <p class="item-time no-wrap">
                        <span class="img-bg">
                            <img :src="item.record_extra_info.monster_icon" alt="">
                        </span>
                        <span class="img-bg">
                            <img :src="item.record_extra_info.weapon_icon" alt="">
                        </span>

                        <span>{{ formatDate(item.lottery_time, 'yyyy.MM.dd hh:mm') }}</span>
                        <span style="margin: 0 0.12rem">{{ $t('dealDamage') }}</span>
                        <span style="color: #59CB61">{{ item.record_extra_info.harm_blood_amount }}</span>
                    </p>
                    <div v-if="item.lottery_rewards && item.lottery_rewards.length" class="item-gift-list">
                        <div v-for="(ele,inx) in item.lottery_rewards" :key="inx" class="item-gift">
                            <img :src="ele.reward_icon" alt="">
                            <div class="num_box"><p>{{ ele.reward_amount }}</p></div>
                            <p v-if="ele.worth_diamonds" class="gift-name-container no-wrap">{{ ele.worth_diamonds }}
                                <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                            </p>
                        </div>
                    </div>
                    <div v-else class="item-gift-list flex-box">
                        <p>{{ $t('noRewards') }}</p>
                    </div>
                </div>
            </div>
            <div v-show="!records_list.length" class="empty">
                <div><img src="https://yaame-static.yaame.io/admin/dc3cb6bcef7440234687576644966201.png" alt=""></div>
                <p>{{ $t('notAttackedDemonKing') }}</p>
            </div>
        </div>
    </popup>
</template>

<script>
    import { formatDate } from '@/lib/utils';
    import { getPolLotteryLog } from '@/lib/request/draw';
    export default {
        name: 'WinRecord',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
            refresh: () => import('../../../components/common/refresh.vue'),
        },
        data() {
            return {
                page: 1,
                has_next: true,
                records_list: []
            };
        },
        mounted() {
            this.getRecords();
        },
        methods: {
            async getRecords(isRefresh = false) {
                let res = await getPolLotteryLog({ activity_type: 'BIG_MONSTER' });
                if (res.status !== 1000) {
                    return;
                }
                if (isRefresh) {
                    this.records_list = res.data.lottery_logs;
                } else {
                    this.records_list = this.records_list.concat(res.data.lottery_logs);
                }
            },
            async handleRefresh() {
                this.page = 1;
                await this.getRecords(true);
                setTimeout(() => {
                    this.$refs.wlRefresh.isLoading = false;
                }, 500);
            },
            loadMore() {
                if (this.has_next) {
                    this.page++;
                    this.getRecords();
                }
            },
            close() {
                this.$emit('close');
            },
            formatDate
        },
    };
</script>

<style lang="less" scoped>
.flexBox{
    display: flex;
    align-items: center;
    justify-content: center;
}
.winRecord{
    width: 6.16rem;
    height: 8.5rem;
    opacity: 0.9;
    background: #5132E5;
    border-radius: 0.2rem;
    padding-top: 0.48rem;
    color: #fff;
    position: relative;
}
.header{
    font-size: 0.36rem;
    font-weight: 700;
    text-align: center;
    width: 100%;
    margin-bottom: 0.4rem;
}
.list-container{
    height: 7rem;
    overflow-y: scroll;
}
.list-item{
    padding-left: 0.5rem;
    width: 5.66rem;
    margin-bottom: 0.3rem;
}
.item-time{
    font-size: 0.24rem;
    color: #FFFFFF;
    .img-bg {
        display: inline-block;
        background-color: #2e197f;
        border-radius: 0.08rem;
        width: 0.34rem;
        height: 0.34rem;
        margin-right: 0.13rem;
        img {
            width: 0.34rem;
            height: 0.34rem;

        }

    }

    span {
        display: inline-block;
    }
}
.item-gift-list{
    padding-top: 0.3rem;
    width: 100%;
    height: 1.7rem;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    flex-wrap: nowrap;
}
.item-gift{
    flex:none;
    width: 1rem;
    height: 1rem;
    background: #4218C9;
    border-radius: 0.12rem;
    margin-right: 0.2rem;
    position: relative;
}
.gift-name-container {
    width: 1.4rem;
    height: 0.3rem;
    line-height: 0.3rem;
    position: absolute;
    bottom: -0.4rem;
    left: -0.15rem;
    text-align: center;
    font-size: 0.24rem;
    transform: scale(0.75);
}
.gift-name-container > img {
    width: 0.2rem;
    height: auto;
    vertical-align: middle;
}
.item-gift> img {
    width: 0.8rem;
    height: 0.8rem;
    margin: 0.1rem;
}
.close-btn{
    position: absolute;
    width: 0.25rem;
    height: auto;
    right: 0.23rem;
    top: 0.23rem;
}
.num_box{
    position: absolute;
    top: -0.13rem;
    right: -0.1rem;
    height: 0.36rem;
    line-height: 0.36rem;
    text-align: center;
    padding: 0 0.12rem 0;
    background-color: #FF6161;
    color: #fff;
    font-weight: 700;
    border-radius: 0.18rem;
}
.num_box > p {
    transform: scale(0.833);
    font-size: 0.24rem;
}.empty{
    position: absolute;
    width: 4rem;
    height: 1.2rem;
    left: calc(50% - 2rem);
    top: calc(50% - 0.2rem);
    font-size: .24rem;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
}
.empty img{
    width: .54rem;
    height: auto;
    margin-bottom: .1rem;
}
.flex-box {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
    height: 0.8rem;
}
</style>