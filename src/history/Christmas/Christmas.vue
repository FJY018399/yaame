<template>
    <div class="main">
        <Header color="white" right_text=" " right_img="https://yaame-static.yaame.io/admin/4d009a5ee4b768327788473cfe50cbda.png" @rightCall="rightCallBack">{{ $t('christmasCarnival') }}</Header>

        <img :src="titleImgList[language]" class="title-img" alt="title" />

        <div class="reward" @click="rewardVisible = true;">{{ $t('rewards') }}</div>

        <div class="timeout">
            <div>{{ timeInfo.dayLeft }}</div>
            <div>{{ timeInfo.dayRight }}</div>
            <div>{{ timeInfo.hours }}</div>
            <div>{{ timeInfo.minutes }}</div>
            <div>{{ timeInfo.seconds }}</div>
        </div>

        <div class="pool-amount">
            <div class="pool-header">{{ $t('christmasJackpot') }}</div>
            <div class="pool-value">
                <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                {{ diamond }}</div>
        </div>

        <div class="bg-img">
            <div class="gift-container">
                <div v-for="(item, index) in rewardItemGroups" :key="index" class="gift-item">
                    <div class="left-gift">
                        <img :src="item.reward_item_vo_list[0].icon" alt="">
                    </div>
                    <div class="gift-process">
                        <div class="get-way">{{ $t(item.reward_id) }}</div>
                        <div v-if="item.reward_id !== 'activity4'" class="process">
                            <div :style="{ width: computedWidth(item) }" class="process-content"></div>
                            <p class="process-text">{{ item.gift_unit_num }}/10</p>
                        </div>
                        <div class="gift-name">{{ $t(item.reward_id + '-get') }}</div>

                        <div v-if="item.reward_id === 'activity4'" class="gift-btn" @click="buyVisible = true">{{ $t('buy') }}</div>
                    </div>
                    <div v-if="item.reward_id !== 'activity4'" class="right-gift">
                        <img :src="item.reward_item_vo_list[1].icon" alt="">
                    </div>
                    <div v-else class="right-gift">
                        <img src="https://yaame-static.yaame.io/admin/d7aaa78e238cb3238102fd46f0201487.png" alt="">
                    </div>
                </div>
            </div>

            <div class="tab-container">
                <div v-for="(item, index) in tabList" :key="index" :class="['tab-item', tabActive === item && 'active']" @click="handleTabClick(item)">
                    {{ $t(item) }}
                </div>
            </div>

            <div class="top-list">
                <div class="top2">
                    <div
                        :style="{ backgroundImage: `url(${top2.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top2)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/e20f21fb1d5d7c5945c11b67b36bb33e.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top2.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top2.subject_score }}
                    </div>
                </div>
                <div class="top1">
                    <div
                        :style="{ backgroundImage: `url(${top1.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top1)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/7906d5195c1a3b591c32bf68e4a8909b.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top1.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top1.subject_score }}
                    </div>
                </div>
                <div class="top3">
                    <div
                        :style="{ backgroundImage: `url(${top3.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top3)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/905f00e0890d895d6b85df8be7a695a1.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top3.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top3.subject_score }}
                    </div>
                </div>
            </div>

            <div v-if="list && list.length" class="list-container">
                <div v-for="(item, index) in list" :key="index"
                     class="list-item"
                >
                    <div class="sort">{{ item.subject_rank }}</div>
                    <div
                    :style="{ backgroundImage: `url(${item.subject_icon})` }"
                        class="user-avatar"
                        @click="toDetails(item)"
                    >
                        <img
                            src="https://yaame-static.yaame.io/admin/0424b854ccc58fe7ff731497096f03b3.png"
                            alt=""
                        />
                    </div>
                    <div class="user-info">
                        <p>{{ item.subject_name }}</p>
                        <p>ID:{{ item.peanut_id }}</p>
                    </div>
                    <div class="user-value">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ item.subject_score }}
                    </div>
                </div>
            </div>

            <div class="user-data">
                <div class="list-item">
                    <div class="sort">{{ my_rank.subject_rank || "99+" }}</div>
                    <div
                        :style="{ backgroundImage: `url(${my_rank.subject_icon})` }"
                        class="user-avatar"
                        @click="toDetails(my_rank)"
                    >
                        <img
                            src="https://yaame-static.yaame.io/admin/0424b854ccc58fe7ff731497096f03b3.png"
                            alt=""
                        />
                    </div>
                    <div class="user-info">
                        <p>{{ my_rank.subject_name }}</p>
                        <p>ID:{{ my_rank.peanut_id }}</p>
                    </div>
                    <div class="user-value">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ my_rank.subject_score || '-' }}
                    </div>
                </div>
            </div>
        </div>

        <popup v-if="ruleVisible" class="flex-box">
            <div class="rule-container">
                <div class="popup-header">{{ $t('eventRules') }}</div>

                <div :class="['rule-content', language]">
                    <p>{{ $t('eventTime') }}</p>
                    <p>{{ $t('eventTimeStart') }}</p>
                    <p>{{ $t('eventTimeEnd') }}</p>
                    <p>{{ $t('eventDescription') }}</p>
                    <p>{{ $t('eventDescription1') }}</p>
                    <p>{{ $t('eventDescription2') }}</p>
                    <p>{{ $t('eventDescription3') }}</p>
                    <p>{{ $t('eventDescription4') }}</p>
                    <p>{{ $t('eventDescription5') }}</p>
                    <p>{{ $t('eventDescription6') }}</p>
                    <p>{{ $t('eventDescription7') }}</p>
                    <p>{{ $t('eventDescription8') }}</p>
                    <p>{{ $t('eventDescription9') }}</p>
                    <p>{{ $t('eventDescription91') }}</p>
                    <p>{{ $t('eventDescription92') }}</p>
                    <p>{{ $t('eventDescription93') }}</p>
                    <p>{{ $t('eventDescription94') }}</p>
                </div>

                <div class="close-icon" @click="ruleVisible = false"></div>
            </div>
        </popup>

        <popup v-if="rewardVisible" class="flex-box">
            <div style="padding-top: 1.55rem;" class="rule-container">
                <div class="popup-header">{{ $t('rewards') }}</div>
                <div class="rule-content">
                    <div style="margin: 0;" class="pool-amount">
                        <div class="pool-header">{{ $t('totalDiamondsInJackpot') }}</div>
                        <div class="pool-value">{{ diamond }}</div>
                    </div>

                    <p class="title-p">{{ $t('top1GiftSenderStar') }}</p>
                    <p class="content-p">{{ $t('top1Reward') }}</p>
                    <p class="title-p">{{ $t('top2GiftSenderStar') }}</p>
                    <p class="content-p">{{ $t('top2Reward') }}</p>
                    <p class="title-p">{{ $t('top3GiftSenderStar') }}</p>
                    <p class="content-p">{{ $t('top3Reward') }}</p>
                    <p class="title-p">{{ $t('top4To10GiftSenderStar') }}</p>
                    <p class="content-p">{{ $t('top4To10Reward') }}</p>
                </div>
                <div class="close-icon" @click="rewardVisible = false"></div>
            </div>
        </popup>

        <popup v-if="buyVisible" class="flex-box">
            <div class="buy-container">
                <div style="width: 4rem;font-size: 0.3rem;margin-top: 0.1rem;" class="popup-header no-wrap">{{ $t('limitedVehicle') }}</div>

                <div class="svga-container">
                    <img src="https://yaame-static.yaame.io/admin/2187e901e9e10cfc691b7d7c166eea38.png" alt="">
                </div>
                <p class="gift-name">{{ $t('giftName') }}</p>
                <div class="buy-list">
                    <div v-for="(item, index) in buyList" :key="index" :class="['buy-item', buyActive === index && 'active']" @click="buyActive = index">
                        <p class="timing">{{ $t(item.key) }}</p>
                        <p><img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">{{ item.num }}</p>
                    </div>
                </div>
                <div class="buy-btn" @click="handleBuy">{{ $t('buy') }}</div>
                <div class="close-icon" @click="buyVisible = false"></div>
            </div>
        </popup>
    </div>
</template>
<script>
    import Header from '@/components/common/header.vue';
    import { computed, getCurrentInstance, onMounted, ref } from "vue";
    import { getLanguage } from "@/lib/device";
    import popup from '@/components/common/pop_up.vue';
    import request  from '@/lib/request/activity';
    import { Toast } from "vant";
    export default {
        components: {
            Header,
            popup
        },
        setup() {
            const root = getCurrentInstance();

            const t = (val) => {
                return root.proxy.$i18n.t(val)
            }
            let language = computed(() => {
                let locale = getLanguage() || "en";
                if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
                    let localEnum = {
                        'zh-hk': 'zh-tw',
                        'zh-tw': 'zh-tw',
                        'zh-mo': 'zh-tw',
                        'zh-cn': 'zh-cn',
                        'zh_cn': 'zh-cn',
                    };

                    locale = localEnum[locale];
                }
                return locale;
            });

            let titleImgList = ref({
                'zh-cn': 'https://yaame-static.yaame.io/admin/73c9227b63c036585ce6076f3ce6e4dd.png',
                'zh-tw': 'https://yaame-static.yaame.io/admin/c78d34cb6d34532122b43acfaa4cb2c7.png',
                'en': 'https://yaame-static.yaame.io/admin/4e199483561e7bd5615fef4df67d5310.png',
                'id': 'https://yaame-static.yaame.io/admin/ed2610a7bcde32f84c0590849b46a08f.png',
                'ar': 'https://yaame-static.yaame.io/admin/6cdc81dfd9723baf3a51c944bb754ebd.png',
            });

            let timeInfo = ref({
                dayLeft: 0,
                dayRight: "D",
                hours: "00",
                minutes: "00",
                seconds: "00",
            });

            let tabList = ref(['giftSender', 'star']);
            let tabActive = ref('giftSender');

            const handleTabClick = (item) => {
                tabActive.value = item;
                getRank();
            }

            const getDefaultUser = () => {
                return {
                    subject_icon:
                        "https://yaame-static.yaame.io/admin/3754bb61a4df0fae4e166999c2401876.png",
                    subject_name: "-",
                    subject_id: "",
                    subject_score: "-",
                    peanut_id: "-",
                    subject_rank: "",
                };
            };

            let top1 = ref(getDefaultUser());
            let top2 = ref(getDefaultUser());
            let top3 = ref(getDefaultUser());

            let list = ref([getDefaultUser()]);

            let my_rank = ref(getDefaultUser());

            const toDetails = (item) => {
                if (item.subject_id) {
                    location.href = `wlyaame://trend/user?uid=${item.subject_id}`;
                }
            }

            let ruleVisible = ref(false);
            const rightCallBack = () => {
                ruleVisible.value = true;
            }

            let rewardVisible = ref(false);

            let buyVisible = ref(false);

            let diamond = ref(0);
            let rewardItemGroups = ref([]);
            const getData = async () => {
                let res = await request.getChristmasIndex();
                if(res.status === 1000) {
                    diamond.value = res.data.diamond;
                    rewardItemGroups.value = res.data.reward_item_groups;
                }
            }
            const getRank = async () => {
                let res = await request.getChristmasRank({
                    page: 1,
                    size: 10,
                    activityTimeFrameType: 'CHRISTMAS',
                    activityTimeFrameRankType: tabActive.value === 'giftSender' ? 'SEND_GIFT' : 'RECEIVE_GIFT'
                });
                if(res.status === 1000) {
                    top1.value = res.data.content[0] || getDefaultUser();
                    top2.value = res.data.content[1] || getDefaultUser();
                    top3.value = res.data.content[2] || getDefaultUser();
                    list.value = res.data.content.slice(3) || [getDefaultUser()];
                    my_rank.value = res.data.my_rank || getDefaultUser();
                }
            }

            const computedWidth = (item) => {
                return item.gift_unit_num / 10 * 100 + '%';
            }
            const getCountdown = () => {
                // 获取当前时间
                const now = new Date();

                // 设置目标时间
                const target = new Date(Date.UTC(now.getUTCFullYear(), 11, 28));

                // 计算剩余时间
                const timeDiff = target.getTime() - now.getTime();

                // 确保目标日期在未来
                if (timeDiff <= 0) {
                    timeInfo.value = {
                        dayLeft: '0',
                        dayRight: "D",
                        hours: "00",
                        minutes: "00",
                        seconds: "00",
                    };
                    return;
                }

                // 将时间差转换为自然时间单位
                let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                let hours = Math.floor(
                    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                // 计算倒计时天数的十位数和个位数
                let dayLeft = Math.floor(days / 10);
                let dayRight = days % 10;

                // 天数不足10，设置个位数为"D"
                if (days < 10) {
                    dayLeft = dayRight;
                    dayRight = "D";
                }

                // 时、分、秒不足10，前面补0
                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                timeInfo.value = { dayLeft, dayRight, hours, minutes, seconds };
            }

            let buyList = ref([
                {
                    key: '1d',
                    value: 1,
                    num: '699',
                    flag: 'ONE_DAY',
                }, {
                    key: '7d',
                    value: 7,
                    num: '4600',
                    flag: 'SEVEN_DAY',
                }, {
                    key: '15d',
                    value: 15,
                    num: '9000',
                    flag: 'FIFTEEN_DAY',
                }
            ]);
            let buyActive = ref(0);

            const handleBuy = async () => {
                let res = await request.buyChristmasCar({
                    christmas_limit_type: buyList.value[buyActive.value].flag,
                });
                if(res.status === 1000) {
                    buyVisible.value = false;
                    getData();

                    Toast(t('buySuccess'));
                } else if (res.status === 6600) {
                    Toast(res.desc);
                    setTimeout(() => {
                        window.location.href = "wlyaame://mine/shop/diamond?popup=1";
                    }, 2000);
                } else {
                    Toast(res.desc);
                }
            }
            onMounted(() => {
                getData();
                getRank();
                getCountdown();
                setInterval(() => {
                    getCountdown();
                }, 1000);

                window.onPaySuccess = function () {
                    getData();
                    getRank();
                }
            });
            return {
                titleImgList,
                language,
                timeInfo,

                tabList,
                tabActive,
                handleTabClick,

                top1,
                top2,
                top3,
                list,
                toDetails,
                my_rank,

                ruleVisible,
                rightCallBack,

                rewardVisible,
                buyVisible,

                diamond,
                rewardItemGroups,
                computedWidth,

                buyActive,
                buyList,
                handleBuy,
            }
        }
    };
</script>
<style scoped lang="less">
.main {
    width: 7.5rem;
    min-height: 100vh;
    background-image: url(https://yaame-static.yaame.io/admin/bd6c2d47a45c4ae85d3e46cbc4e3495e.png);
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 7.66rem;
    padding-bottom: 2rem;
    .title-img {
        width: 7.5rem;
        height: auto;
        position: absolute;
        top: 0;
        left: 0;
    }
    .reward {
        display: inline-block;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0 0.12rem;
        text-align: center;
        position: absolute;
        right: 0;
        top: 2.9rem;
        background-color: #4077FF;
        color: #fff;
        font-size: 0.24rem;
        border-top-left-radius: 0.12rem;
        border-bottom-left-radius: 0.12rem;
    }
    .timeout {
        width: 3.28rem;
        height: 0.72rem;
        position: absolute;
        left: 50%;
        top: 6.48rem;
        transform: translateX(-50%);
        background-image: url(https://yaame-static.yaame.io/admin/311a433a89c0b7a8aa4423653aa7957f.png);
        background-repeat: no-repeat;
        background-size: contain;
        div {
            position: absolute;
            top: 0.18rem;
            text-align: center;
            font-size: 0.24rem;
            color: #fff;
            line-height: 0.38rem;
            &:nth-child(1) {
                width: 0.36rem;
                height: 0.38rem;
                left: 0.24rem;

            }
            &:nth-child(2) {
                width: 0.36rem;
                height: 0.38rem;
                left: 0.64rem;
            }
            &:nth-child(3) {
                width: 0.52rem;
                height: 0.38rem;
                left: 1.16rem;
            }
            &:nth-child(4) {
                width: 0.52rem;
                height: 0.38rem;
                left: 1.84rem;
            }
            &:nth-child(5) {
                width: 0.52rem;
                height: 0.38rem;
                left: 2.52rem;
            }
        }
    }
    .pool-amount {
        width: 5.4rem;
        height: 1.75rem;
        background-image: url(https://yaame-static.yaame.io/admin/f53b18dcf1f2b16bd3166927e75a36c0.png);
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 1.05rem;
        position: relative;
        .pool-header {
            display: inline-block;
            height: 0.36rem;
            line-height: 0.36rem;
            position: absolute;
            top: 0.5rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.26rem;
            color: #FFFFFF;
            text-align: center;
            white-space: nowrap;
            &::after {
                content: '';
                display: inline-block;
                position: absolute;
                width: 0.2rem;
                height: 0.22rem;
                background-image: url(https://yaame-static.yaame.io/admin/4233188d9c2ed95f3e51644251938c18.png);
                background-size: contain;
                background-repeat: no-repeat;
                top: 0.07rem;
                left: -0.36rem;
            }
            &::before {
                content: '';
                display: inline-block;
                position: absolute;
                width: 0.2rem;
                height: 0.22rem;
                background-image: url(https://yaame-static.yaame.io/admin/244942b577d4d7b3d22a8e6c9ea69389.png);
                background-size: contain;
                background-repeat: no-repeat;
                top: 0.07rem;
                right: -0.3rem;
            }
        }
        .pool-value {
            width: 5.4rem;
            position: absolute;
            top: 0.85rem;
            left: 0;
            text-align: center;
            font-size: 0.4rem;
            color: #FCFFB0;
            img {
                width: 0.4rem;
                height: auto;
                vertical-align: middle;
            }
        }
    }

    .gift-container {
        width: 6.8rem;
        height: 8.45rem;
        margin-top: 0.4rem;
        margin-left: 0.35rem;
        background-image: url(https://yaame-static.yaame.io/admin/f79b51bf92327f0459f45760a8d59e7f.png);
        background-size: contain;
        background-repeat: no-repeat;
        padding: 0.94rem 0.5rem 0;

        .gift-item {
            width: 5.8rem;
            height: 1.22rem;
            margin-bottom: 0.61rem;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .left-gift {
                width: 1.22rem;
                height: 1.22rem;
                background-image: url(https://yaame-static.yaame.io/admin/557668c8b761c340947f72a9f59642f1.png);
                background-repeat: no-repeat;
                background-size: contain;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 0.8rem;
                    height: auto;
                }
            }
            .gift-process {
                width: 2.9rem;
                height: 1.22rem;
                .get-way {
                    width: 2.9rem;
                    text-align: center;
                    font-size: 0.22rem;
                    color: #FFFFFF;
                    margin-bottom: 0.06rem;
                }
                .process {
                    width: 2.9rem;
                    height: 0.28rem;
                    border-radius: 0.17rem;
                    position: relative;
                    background: #16259F;
                    padding-top: 0.02rem;
                    .process-content {
                        width: 20%;

                        height: 0.24rem;
                        border-radius: 0.17rem;
                        background-image: linear-gradient(0deg, #D40325 0%, #FF6E44 100%);
                    }
                    .process-text {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 2.9rem;
                        height: 0.28rem;
                        text-align: center;
                        font-size: 0.24rem;
                        color: #FFFFFF;
                    }
                }
                .gift-name {
                    width: 2.9rem;
                    text-align: center;
                    font-size: 0.26rem;
                    color: #FCFFB0;
                    margin-top: 0.06rem;
                    font-weight: 600;
                }
                .gift-btn {
                    margin-left: 0.3rem;
                    width: 2.3rem;
                    height: 0.66rem;
                    text-align: center;
                    line-height: 0.66rem;
                    font-size: 0.28rem;
                    color: #FCFFB0;
                    background-image: url(https://yaame-static.yaame.io/admin/14965d5a82977d14cec33ecd34f0f404.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    margin-top: 0.04rem;
                }
            }
            .right-gift {
                width: 1.22rem;
                height: 1.22rem;
                background-image: url(https://yaame-static.yaame.io/admin/32912cfba66a0c813b5f9db4689b6be9.png);
                background-repeat: no-repeat;
                background-size: contain;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 0.8rem;
                    height: auto;
                }
            }
        }
    }

    .tab-container {
        width: 6.3rem;
        height: 1.1rem;
        background: #0B1A95;
        border-radius: 0.55rem;
        margin-top: 0.8rem;
        margin-left: 0.6rem;
        padding: 0.15rem 0.18rem;
        display: flex;
        .tab-item {
            flex: 1;
            text-align: center;
            line-height: 0.8rem;
            font-size: 0.34rem;
            color: #6270E7;
            &.active {
                background-image: linear-gradient(0deg, #3354E5 0%, #1CC4D2 99%);
                border-radius: 0.45rem;
                color: #FCFFB0;
            }
        }
    }

    .top-list {
        width: 6.58rem;
        height: 4.02rem;
        margin-left: 0.46rem;
        display: flex;
        position: relative;
        justify-content: space-between;
        margin-top: 0.5rem;
        .top1 {
            width: 2.3rem;
            height: 4.02rem;
            background-image: url(https://yaame-static.yaame.io/admin/68f22aeeca2c12f949d6dbbc5488244f.png);
            background-repeat: no-repeat;
            background-size: contain;
            position: relative;

            .avatar {
                width: 1.2rem;
                height: 1.2rem;
                margin-top: 0.2rem;
                margin-left: 0.2rem;
                top: 0.82rem;
                left: 0.35rem;
                background-size: 1.2rem 1.2rem;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 50%;
                position: relative;

                .dress {
                    position: absolute;
                    top: -0.2rem;
                    left: -0.2rem;
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }

            .top-name {
                width: 2.3rem;
                top: 2.42rem;
                text-align: center;
            }

            .top-diamond {
                width: 1.7rem;
                height: 0.38rem;
                text-align: center;
                line-height: 0.38rem;
                position: absolute;
                top: 2.87rem;
                left: 0.3rem;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }

                font-size: 0.26rem;
                font-weight: 600;
                color: #724b36;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/dba3a0bce3ef2b36019f0ebc1ce45534.png);
            }
        }

        .top2 {
            background-image: url(https://yaame-static.yaame.io/admin/b934d283028797e83f5dd6a6f610eae5.png);
            background-repeat: no-repeat;
            background-size: contain;

            .top-diamond {
                background-image: url(https://yaame-static.yaame.io/admin/f0dc5d6f1ec5ed578ea0eac392680dd5.png);
            }
        }

        .top3 {
            background-image: url(https://yaame-static.yaame.io/admin/6b4c66f5ce53940cb34c27dfbe044a19.png);
            background-repeat: no-repeat;
            background-size: contain;

            .top-diamond {
                background-image: url(https://yaame-static.yaame.io/admin/1024b1ced56f890cbb5b0f4a2f704b5b.png);
            }
        }

        .top2,
        .top3 {
            width: 1.98rem;
            height: 3.56rem;
            position: relative;
            top: 0.34rem;

            .avatar {
                width: 1.1rem;
                height: 1.1rem;
                top: 0.7rem;
                left: 0.24rem;
                background-size: 1.1rem 1.1rem;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 50%;
                position: relative;
                margin: 0.2rem;

                .dress {
                    width: 1.5rem;
                    height: 1.5rem;
                    position: absolute;
                    top: -0.2rem;
                    left: -0.2rem;
                }
            }

            .top-name {
                width: 1.98rem;
                top: 2.2rem;
                text-align: center;
            }

            .top-diamond {
                width: 1.7rem;
                height: 0.38rem;
                text-align: center;
                line-height: 0.38rem;
                position: absolute;
                top: 2.59rem;
                left: 0.14rem;
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }

                font-size: 0.26rem;
                font-weight: 600;
                color: #724b36;
            }
        }

        .top-name {
            font-size: 0.26rem;
            font-weight: 600;
            color: #ffffff;
            position: absolute;
        }
    }

    .list-container {
        width: 6.58rem;
        min-height: 5rem;
        margin-left: 0.46rem;
        padding-top: 0.4rem;

        .list-item {
            width: 6.58rem;
            height: 1.3rem;
            background-image: url(https://yaame-static.yaame.io/admin/20b4c345bbaa2c7bad6bde7a9ec331f8.png);
            background-repeat: no-repeat;
            background-size: contain;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            padding-left: 0.2rem;
            padding-right: 0.3rem;
            position: relative;
            z-index: 2;

            .sort {
                width: 0.6rem;
                height: 0.6rem;
                background-image: url(https://yaame-static.yaame.io/admin/f7902a513595682ac613f8860c51584f.png);
                background-repeat: no-repeat;
                background-size: contain;
                line-height: 0.6rem;
                text-align: center;
                font-size: 0.3rem;
                font-weight: 500;
                color: #0d4a96;
            }

            .user-avatar {
                width: 0.98rem;
                height: 0.98rem;
                background-size: contain;
                background-repeat: no-repeat;
                margin-left: 0.2rem;
                border-radius: 50%;

                img {
                    width: 0.98rem;
                    height: 0.98rem;
                }
            }

            .user-info {
                width: 2.5rem;
                font-size: 0.24rem;
                font-weight: 500;
                color: #ffffff;
                margin-left: 0.18rem;
            }

            .user-value {
                width: 1.6rem;
                font-size: 0.26rem;
                font-weight: 600;
                color: #ffffff;
                text-align: right;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }
            }
        }
    }

    .user-data {
        width: 7.5rem;
        height: 1.84rem;
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        background-image: url(https://yaame-static.yaame.io/admin/1fcc6c0db91e240385251764b32266fa.png);
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 0.46rem;

        .list-item {
            width: 6.58rem;
            height: 1.3rem;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            padding-left: 0.2rem;
            padding-right: 0.3rem;

            .sort {
                width: 0.6rem;
                height: 0.6rem;
                line-height: 0.6rem;
                text-align: center;
                font-size: 0.3rem;
                font-weight: 500;
                color: #fff;
            }

            .user-avatar {
                width: 0.98rem;
                height: 0.98rem;
                background-size: contain;
                background-repeat: no-repeat;
                margin-left: 0.2rem;
                border-radius: 50%;

                img {
                    width: 0.98rem;
                    height: 0.98rem;
                }
            }

            .user-info {
                width: 2.5rem;
                font-size: 0.24rem;
                font-weight: 500;
                color: #ffffff;
                margin-left: 0.18rem;
            }

            .user-value {
                width: 1.6rem;
                font-size: 0.26rem;
                font-weight: 600;
                color: #ffffff;
                text-align: right;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }
            }
        }
    }
    .bg-img {
        width: 7.5rem;
        height: auto;
        background-image: url(https://yaame-static.yaame.io/admin/e97938a10f44da56df48f0f638ec1947.png);
        background-size: 11.58rem auto;
        background-repeat: no-repeat;
        background-position: -1.54rem -1.4rem;
        position: relative;
        z-index: 1;
    }

    .flex-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .rule-container {
            width: 6rem;
            height: 7.7rem;
            padding: 1.85rem 0.44rem 0;
            font-size: 0.26rem;
            color: #FFFFFF;
            background-image: url(https://yaame-static.yaame.io/admin/20cab6977d071e0c3c09a272a6fec384.png);
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            .rule-content {
                width: 5.28rem;
                height: 5.4rem;
                margin: 0 auto;
                overflow-y: scroll;
                overflow-x: hidden;
                &.ar {
                    text-align: right;
                }
                p {
                    margin-bottom: 0.2rem;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
        .popup-header {
            width: 2rem;
            height: 0.4rem;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.34rem;
            color: #FFFFFF;
            position: absolute;
            top: 0.3rem;
            left: 50%;
            transform: translateX(-50%);
        }
        .close-icon {
            width: 0.6rem;
            height: 0.6rem;
            background-image: url(https://yaame-static.yaame.io/admin/35e4ff8b6c9bf27f672b96ddbdd174ef.png);
            background-size: contain;
            background-repeat: no-repeat;
            position: absolute;
            bottom: -1rem;
            right: 50%;
            transform: translateX(50%);
        }
        .buy-container {
            width: 6rem;
            height: 8.16rem;
            padding-top: 1.5rem;
            font-size: 0.26rem;
            color: #FFFFFF;
            background-image: url(https://yaame-static.yaame.io/admin/3d8470d65ff1436349d4f365f0b0472a.png);
            background-size: 6rem 8.16rem;
            background-repeat: no-repeat;
            position: relative;
            .svga-container {
                width: 3.54rem;
                height: 3.54rem;
                background: #1534BB;
                border-radius: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 1.28rem;
                #canvas {
                    width: 3rem;
                    height: 3rem;
                }
                img {
                    width: 3rem;
                    height: 3rem;
                }
            }
            .gift-name {
                width: 6rem;
                text-align: center;
                font-size: 0.26rem;
                color: #FFFFFF;
                margin-top: 0.08rem;
            }
            .buy-list {
                width: 6rem;
                padding:  0 0.7rem;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;
                margin-top: 0.3rem;
                .buy-item {
                    width: 1.4rem;
                    height: 0.92rem;
                    border-radius: 0.1rem;
                    background: #1534BB;
                    border: 0.02rem solid #1534BB;
                    padding-top: 0.02rem;
                    &.active {
                        border: 0.02rem solid #FCFFB0;
                    }
                    .timing {
                        width: 1.4rem;
                        font-size: 0.3rem;
                        color: #FCFFB0;
                        letter-spacing: 0;
                        text-align: center;
                    }
                    p {
                        width: 1.4rem;
                        font-size: 0.26rem;
                        color: #fff;
                        letter-spacing: 0;
                        text-align: center;
                        img {
                            width: 0.26rem;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
                }

            }

            .buy-btn {
                width: 3.5rem;
                height: 0.8rem;
                line-height: 0.8rem;
                background-image: url(https://yaame-static.yaame.io/admin/d9e77c2cb6ca46514005f58d1860ab47.png);
                background-size: contain;
                background-repeat: no-repeat;
                margin-top: 0.32rem;
                margin-left: 1.24rem;
                text-align: center;
            }
        }
    }
}
.title-p {
    font-size: 0.34rem;
    color: #FCFFB0;
    letter-spacing: 0;
    text-align: center;
    font-weight: 500;
    margin-bottom: 0.12rem;
    margin-top: 0.12rem;
}
.content-p {
    font-size: 0.26rem;
    color: #FFFFFF;
    letter-spacing: 0;
    font-weight: 500;
}
</style>

