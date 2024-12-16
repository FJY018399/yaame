<template>
    <div class="main">
        <Header color="white">Puncak Kompetisi</Header>
        <div class="reward-container">
            <div class="list-tab">
                <div v-for="(item, index) in listTabList" :key="index"
                     :class="['tab-item', rewardTabActive === index && 'active']" @click="rewardTabActive = index"
                >
                    {{ item.name }}
                </div>
            </div>

            <div v-show="rewardTabActive === 0" class="gift">
                <div v-for="(item, index) in reward_gift_items" :key="index" :class="['rank-container-' + index]">
                    <div v-if="index === 0" class="reward-title reward-0">Rank 1</div>
                    <div v-if="index === 1" class="reward-title reward-1">Rank 2</div>
                    <div v-if="index === 2" class="reward-title reward-2">Rank 3</div>
                    <div v-if="index === 3" class="reward-title reward-3">Rank 4-10</div>

                    <div v-if="index === 0" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[3].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[3].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 1" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 2" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="rewardTabActive === 1" class="gift">
                <div v-for="(item, index) in reward_star_items" :key="index" :class="['rank-container-' + index]">
                    <div v-if="index === 0" class="reward-title reward-0">Rank 1</div>
                    <div v-if="index === 1" class="reward-title reward-1">Rank 2</div>
                    <div v-if="index === 2" class="reward-title reward-2">Rank 3</div>
                    <div v-if="index === 3" class="reward-title reward-3">Rank 4-10</div>

                    <div v-if="index === 0" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[3].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[3].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 1" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 2" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="rewardTabActive === 2" class="gift">
                <div v-for="(item, index) in reward_room_items" :key="index" :class="['rank-container-' + index]">
                    <div v-if="index === 0" class="reward-title reward-0">Rank 1</div>
                    <div v-if="index === 1" class="reward-title reward-1">Rank 2</div>
                    <div v-if="index === 2" class="reward-title reward-2">Rank 3</div>
                    <div v-if="index === 3" class="reward-title reward-3">Rank 4-10</div>

                    <div v-if="index === 0" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 1" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                    <div v-if="index === 2" class="flex-content">
                        <div v-for="(ele, inx) in item.reward_items" v-show="inx < 2" :key="inx" class="normal-item">
                            <div class="normal-img">
                                <img :src="ele.icon" alt="">
                            </div>
                            <p class="normal-name">{{ ele.gift_name }}</p>
                            <p v-if="ele.diamond_worth" class="normal-value">
                                <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                {{ ele.diamond_worth }}
                            </p>
                            <p v-if="ele.validity_date" class="normal-value">
                                {{ ele.validity_date }}
                            </p>
                        </div>

                        <div class="big-item">
                            <div class="big-img">
                                <img :src="item.reward_items[2].icon" alt="">
                            </div>
                            <p class="big-name">{{ item.reward_items[2].gift_name }}</p>
                            <p class="big-value">
                                {{ item.reward_items[2].validity_date }}
                            </p>
                        </div>
                        <div class="big-item">
                            <div class="big-img">
                                <img src="https://yaame-static.yaame.io/admin/55d1e751a76f608247dfa9ab7556fe1d.png" alt="">
                            </div>
                            <p class="big-name">Piala Yaame</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getGiftInfoAPI } from '../api';
import Header from "@/components/common/header.vue";
// 获取奖品
let reward_gift_items = ref([]);
let reward_room_items = ref([]);
let reward_star_items = ref([]);
const getGiftInfo = async () => {
    let res = await getGiftInfoAPI();
    if (res.status !== 1000) return;
    reward_gift_items.value = res.data.reward_gift_items;
    reward_room_items.value = res.data.reward_room_items;
    reward_star_items.value = res.data.reward_star_items;
};

let rewardTabActive = ref(0);
let listTabList = ref([
    {
        name: 'Spender',
    },
    {
        name: 'Star',
    },
    {
        name: 'Agency',
    },
]);

onMounted(() => {
    getGiftInfo();
});
</script>

<style lang="less" scoped>
.main {
    width: 7.5rem;
    min-height: 100vh;
    position: relative;
    font-size: 0.24rem;
    color: #fff;
    background-size: 7.5rem auto;
    background-repeat: no-repeat;
    background-image: url(https://yaame-static.yaame.io/admin/00f6beb04ee3c8462161109a09822aeb.png);
    padding-top: 3.85rem;
    .reward-container {
        position: relative;

        .list-tab {
            width: 7.5rem;
            height: 0.87rem;
            display: flex;
            margin-top: 0.48rem;
            justify-content: space-between;

            .tab-item {
                width: 2.5rem;
                height: 0.68rem;
                line-height: 0.68rem;
                font-size: 0.34rem;
                text-align: center;
                font-weight: normal;
                color: #E8DDBB;
                background-image: url(https://yaame-static.yaame.io/admin/753a8e208c4d5e6b8f34176010fa75f8.png);
                background-size: 2.5rem auto;
                background-repeat: no-repeat;

                &.active {
                    background-image: url(https://yaame-static.yaame.io/admin/42cdeb80aa3a152a5e927b6a2c21f3b8.png);
                    margin-top: -0.28rem;
                    height: 1rem;
                    line-height: 1.2rem;
                }
            }
        }

        .gift {
            width: 7.5rem;
        }

        .reward-title {
            width: 6.45rem;
            height: 1.11rem;
            text-align: center;
            background-size: 6.45rem auto;
            background-repeat: no-repeat;
            font-size: 0.28rem;
            font-weight: normal;
            color: #FFFFFF;
            line-height: 1.58rem;
            position: absolute;
            top: -0.88rem;
            left: 0.42rem;
            &.reward-0 {
                background-image: url(https://yaame-static.yaame.io/admin/d21b9d89cebc5c08e50902f600b449c7.png);
                color: #975C19;
            }

            &.reward-1 {
                background-image: url(https://yaame-static.yaame.io/admin/5318670177efb1ab4d7a541ea6717625.png);
                color: #5F5F8E;
            }

            &.reward-2 {
                background-image: url(https://yaame-static.yaame.io/admin/4f7b64d82c13fd10739dcb06e8d68d9a.png);
                color: #9A512C;
            }

            &.reward-3 {
                background-image: url(https://yaame-static.yaame.io/admin/384bcc3f1c87199ffea6c57006a12d6f.png);
            }

        }
        .rank-container-0 {
            width: 7.3rem;
            height: 8.47rem;
            background-image: url(https://yaame-static.yaame.io/admin/5a136547513864717c2bf8d74d6914d6.png);
            background-size: contain;
            background-repeat: no-repeat;
            margin-left: 0.1rem;
            position: relative;
            padding: 0.63rem 0.35rem 0;
            margin-top: 1.16rem;
        }
        .rank-container-1{
            width: 7.3rem;
            height: 8.49rem;
            background-image: url(https://yaame-static.yaame.io/admin/1917c59deba48a60d5b05a5c4f2270c7.png);
            background-size: contain;
            background-repeat: no-repeat;
            margin-left: 0.1rem;
            position: relative;
            padding: 0.63rem 0.35rem 0;
            margin-top: 1.16rem;
        }
        .rank-container-2 {
            width: 7.3rem;
            height: 8.49rem;
            background-image: url(https://yaame-static.yaame.io/admin/31676abb0b6539a6211a197165a9ae45.png);
            background-size: contain;
            background-repeat: no-repeat;
            margin-left: 0.1rem;
            position: relative;
            padding: 0.63rem 0.35rem 0;
            margin-top: 1.16rem;
        }
        .flex-content {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            width: 6.6rem;
            margin-top: 0.3rem;
            .normal-item {
                width: 2rem;
                height: 2.7rem;
                margin-bottom: 0.3rem;
                .normal-img {
                    width: 2rem;
                    height: 2.12rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-image: url(https://yaame-static.yaame.io/admin/a017e28bc5efe30f3c5fefa4aa1889f1.png);
                    background-repeat: no-repeat;
                    background-size: 2rem auto;
                    padding-top: 0.12rem;
                    img {
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                }
                .normal-name {
                    width: 2rem;
                    text-align: center;
                    font-size: 0.22rem;
                    font-weight: normal;
                    color: #FFFFFF;
                    margin-top: 0.1rem;
                }
                .normal-value {
                    width: 2rem;
                    text-align: center;
                    font-size: 0.22rem;
                    font-weight: normal;
                    color: #FFE678;
                    img {
                        width: 0.22rem;
                        height: auto;
                        vertical-align: middle;
                    }
                }
            }
            .big-item {
                width: 3rem;
                height: 3.8rem;
                margin-bottom: 0.3rem;
                .big-img {
                    width: 3rem;
                    height: 3.2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-image: url(https://yaame-static.yaame.io/admin/f3996cab14557e8e42c108606df09860.png);
                    background-repeat: no-repeat;
                    background-size: 3rem auto;
                    padding-top: 0.2rem;
                    img {
                        width: auto;
                        height: 2.4rem;
                    }
                }
                .big-name {
                    width: 3rem;
                    text-align: center;
                    font-size: 0.24rem;
                    font-weight: normal;
                    color: #FFFFFF;
                    margin-top: 0.1rem;
                }
                .big-value {
                    width: 3rem;
                    text-align: center;
                    font-size: 0.24rem;
                    font-weight: normal;
                    color: #FFE678;
                    img {
                        width: 0.22rem;
                        height: auto;
                        vertical-align: middle;
                    }
                }
            }
        }

        .close-icon {
            width: 0.7rem;
            height: 0.7rem;
            position: absolute;
            bottom: -1rem;
            right: 50%;
            transform: translateX(50%);
        }
    }
}
</style>