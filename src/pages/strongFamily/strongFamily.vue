<template>
    <div class="main" :style="{ backgroundImage: `url(${logoImg[locale]})`}">
        <!--标题-->
        <custom-header class="header" :safeHeightShow="false">{{ $t('Ultimate-Family') }}</custom-header>
        <!--规则-->
        <div class="rule" @click="showRule = !showRule">{{ $t('Rules') }}</div>
        <!--奖励-->
        <div class="award" @click="awardPage">{{ $t('Rewards') }}</div>
        <!--活动礼物-->
        <div class="event-gift">
            <div class="event-gift-header">{{ $t('Event-Gifts') }}</div>
            <p class="explain">{{ $t('Gifts-Leaderboard') }}</p>
            <!--奖励名字和钻石-->
            <div v-for="(item, index) in explainName" :key="index" class="explain-name" :class="`explain${index}`">
                <span>{{ item.name }}</span>
                <div class="explain-diamond">
                    <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                    {{ item.diamond }}
                </div>
            </div>
        </div>
        <!--活动时间-->
        <div class="activity-time">
            <div class="days" :style="{ left: days < 10 ? '1.47rem' : '1.4rem' }">{{ days }}</div>
            <div class="time-days">D</div>
            <div class="hours">{{ hours < 10 ? '0' + hours : hours }}</div>
            <div class="minutes">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
            <div class="seconds">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
        </div>
        <!--tab切换-->
        <div ref="tabTop" class="tab">
            <div class="tab-highlight" :style="{ left: tabStyle === 'LION' ? '0.04rem' : tabStyle === 'TIGER' ? '2.32rem' : '4.64rem' }"></div>
            <div v-for="(item, index) in tab" :key="index" class="tab-list" :class="{ 'tab-list-style': item.type === tabStyle }" @click="cutTab(item.type)">
                <img :src="item.img" alt="">
                {{item.name}}
            </div>
        </div>
        <!--排行-->
        <div class="rank-list">
            <div v-show="rankList.length" class="ranking" v-for="(item, index) in rankList" :key="index">
                <!--前三名-->
                <div class="ranking-common" :class="[`ranking-top${index}`]" v-if="index < 3">
                    <!--家族头像-->
                    <div class="family-img" @click="skip(item.scheme_url)">
                        <img :src="item.subject_icon" alt="">
                        <span>{{ 'TOP' + (index + 1) }}</span>
                    </div>
                    <!--家族名字和钻石-->
                    <div class="family-name" @click="skip(item.scheme_url)">
                        <span>{{ item.subject_name }}</span>
                        <div class="diamond">
                            <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                            {{ item.subject_score }}
                        </div>
                    </div>
                    <!--家族贡献成员-->
                    <div class="family-member">
                        <div class="family-member-header">{{ $t('topthree_gifters') }}</div>
                        <!--循环前三名列表-->
                        <div class="family-top-three" v-for="(list, index) in item.user_ranks" :key="index">
                            <img :src="list.subject_icon" alt="" @click="skip(list.scheme_url)">
                            <div class="diamond" @click="skip(list.scheme_url)">
                                <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                                {{ list.subject_score }}
                            </div>
                        </div>
                    </div>
                </div>
                <!--剩下排名-->
                <div class="ranking-common" v-else>
                    <!--家族头像-->
                    <div class="family-img" @click="skip(item.scheme_url)">
                        <img :src="item.subject_icon" alt="">
                        <span class="span-center">{{ 'TOP' + (index + 1) }}</span>
                    </div>
                    <!--家族名字和钻石-->
                    <div class="family-name" @click="skip(item.scheme_url)">
                        <span>{{ item.subject_name }}</span>
                        <div class="diamond">
                            <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                            {{ item.subject_score }}
                        </div>
                    </div>
                    <!--家族贡献成员-->
                    <div class="family-member">
                        <div class="family-member-header">{{ $t('topthree_gifters') }}</div>
                        <!--循环前三名列表-->
                        <div class="family-top-three" v-for="(list, index) in item.user_ranks" :key="index">
                            <img :src="list.subject_icon" alt="" @click="skip(list.scheme_url)">
                            <div class="diamond" @click="skip(list.scheme_url)">
                                <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                                {{ list.subject_score }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--排行缺省图-->
            <div v-show="!rankList.length" class="rank-lack">
                <div class="lack">
                    <img src="https://yaame-static.yaame.io/admin/27743ee93f871e33902789177876ac45.png" alt="">
                    <span>{{ $t('noleaderboard_data') }}</span>
                </div>
            </div>
        </div>

        <!--当前用户信息-->
        <div v-if="Object.keys(myFamilyRank).length" class="my-list">
            <div class="my-style">
                <!--家族头像-->
                <div class="my-img" @click="skip(myFamilyRank.family_scheme_url)">
                    <img :src="myFamilyRank.family_icon" alt="">
                    <span class="span-center">{{ 'TOP' + (!myFamilyRank.family_rank || myFamilyRank.family_rank > 99 || myFamilyRank.family_rank === -1 ? 99 + '+' : myFamilyRank.family_rank) }}</span>
                </div>
                <!--家族名字和钻石-->
                <div class="my-name" @click="skip(myFamilyRank.family_scheme_url)">
                    <span>{{ myFamilyRank.family_name }}</span>
                    <div class="my-diamond">
                        <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                        {{ myFamilyRank.family_score }}
                    </div>
                </div>
                <!--我的贡献-->
                <div class="family-member">
                    <div class="family-member-header">{{ $t('contribution') }}</div>
                    <div class="family-top-three" @click="skip(myFamilyRank.subject_scheme_url)">
                        <img :src="myFamilyRank.subject_icon" alt="">
                        <div class="diamond">
                            <img src="https://yaame-static.yaame.io/admin/13afc0df29bb9fbcfc0d7715b574f0ce.png" alt="">
                            {{ myFamilyRank.subject_score }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--加入公会-->
        <div v-else class="my-img">
            <div class="my-list-img" @click="skip(schemeUrl)">{{ $t('joinfamily') }}</div>
        </div>
        <!--阴影栏-->
        <div v-if="Object.keys(myFamilyRank).length" class="my-shadow"></div>
        <!--规则页-->
        <popup class="popup" v-show="showRule" @cancel="popupShow('showRule')">
            <div class="rule-page">
                <div class="rule-page-header">{{ $t('Rules') }}</div>
                <p>
                    {{ $t('eventtime') }}<br />
                    {{ $t('eventtime_range') }}<br /><br />
                    {{ $t('eventdescription') }}<br />
                    {{ $t('lionleaderboard') }}<br />
                    {{ $t('tigerleaderboard') }}<br />
                    {{ $t('dragonleaderboard') }}<br />
                    {{ $t('leaderboardrewards') }}<br />
                    {{ $t('familyrewards') }}<br />
                    {{ $t('interpretation_rights') }}<br />
                </p>
            </div>
            <div class="rule-page-close" @click="showRule = !showRule"></div>
        </popup>
        <!--奖励页-->
        <popup class="popup" v-show="showAward" @cancel="popupShow('showAward')">
            <div class="award-page">
                <div class="rule-page-header">{{ $t('Rewards') }}</div>
                <!--tab切换-->
                <div class="tab">
                    <div class="tab-highlight" :style="{ left: awardPageTab === 'LION' ? '0.04rem' : awardPageTab === 'TIGER' ? '1.88rem' : '3.72rem' }"></div>
                    <div v-for="(item, index) in awardTab" :key="index" class="tab-list" :class="{ 'tab-list-style': item.type === awardPageTab }" @click="cutAwardTab(item.type, index)">
                        {{item.name}}
                    </div>
                </div>
                
                <div class="top-tab">
                    <div v-for="(ele, inx) in topTab" :key="inx" :class="['top-tab-item', inx === topTabActive && 'active']" @click="topTabActive = ele.value">
                        {{ ele.name }}
                    </div>
                </div>
                <!--奖励详情-->
                <div class="award-particulars">
                    <!--总容器-->
                    <ul :style="{ left: -left + 'rem' }">
                        <!--每一个动物奖励一个li-->
                        <li class="lion">
                            <div v-for="(item, index) in lion[topTabActive]" :key="index" class="award-gift">
                                <div class="gift-day">{{ item.validity_date }}</div>
                                <img :src="item.reward_icon" alt="">
                                <div class="gift-name">{{ item.reward_name }}</div>
                                <div class="gift-explain">{{ item.reward_user === 'ALL' ? $t('allfamilymembersreceive') : $t('familyTop3Honors') }}</div>
                            </div>
                        </li>
                        <li class="tiger">
                            <div v-for="(item, index) in tiger[topTabActive]" :key="index" class="award-gift">
                                <div class="gift-day">{{ item.validity_date }}</div>
                                <img :src="item.reward_icon" alt="">
                                <div class="gift-name">{{ item.reward_name }}</div>
                                <div class="gift-explain">{{ item.reward_user === 'ALL' ? $t('allfamilymembersreceive') : $t('familyTop3Honors') }}</div>
                            </div>
                        </li>
                        <li class="dragon">
                            <div v-for="(item, index) in dragon[topTabActive]" :key="index" class="award-gift">
                                <div class="gift-day">{{ item.validity_date }}</div>
                                <img :src="item.reward_icon" alt="">
                                <div class="gift-name">{{ item.reward_name }}</div>
                                <div class="gift-explain">{{ item.reward_user === 'ALL' ? $t('allfamilymembersreceive') : $t('familyTop3Honors') }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!--关闭按钮-->
            <div class="rule-page-close" @click="showAward = !showAward"></div>
        </popup>
    </div>
</template>

<script setup>
    import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue';
    import { getHomeList, getRank, getPrize } from '@/lib/request/activity'
    import customHeader from "@/components/common/header.vue";
    import popup from "@/components/common/pop_up.vue";
    import { getLanguage } from "@/lib/device"
    // 获取国家
    let locale = getLanguage() || "en";
    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val) => {
        return root.proxy.$i18n.t(val);
    };
    // 头图国际化
    const logoImg = ref({
        "ar": "https://yaame-static.yaame.io/admin/d9b3d299738198213e56ae9704579414.png",
        "en": "https://yaame-static.yaame.io/admin/a6baf7c7b6b3b5c9b7ba8e78862ad5b3.png",
        "id": "https://yaame-static.yaame.io/admin/09314a2aff49f0dea752aed7c7ec8d5e.png",
        "zh-cn": "https://yaame-static.yaame.io/admin/ed32bc815890162409fdf2ead06a396f.png",
        "zh-tw": "https://yaame-static.yaame.io/admin/ed32bc815890162409fdf2ead06a396f.png",
    });
    // tab切换
    const tab = ref([
        {
            name: t('Lion'),
            type: "LION",
            img: "https://yaame-static.yaame.io/admin/cb594d827ba9fa86e48382c01e6c7c67.png"
        },
        {
            name: t('Tiger'),
            type: "TIGER",
            img: "https://yaame-static.yaame.io/admin/a776fd1a4b57761343699b9e4084a862.png"
        },
        {
            name: t('Dragon'),
            type: "DRAGON",
            img: "https://yaame-static.yaame.io/admin/d2113323eb4e42c30d70e932683ffebb.png"
        }
    ])
    let tabStyle = ref('LION');
    const cutTab = (value) => {
        tabStyle.value = value;
        // 调佣对应tab数据
        acquireRank(value);
    }
    // 奖励页tab切换
    const awardTab = ref([
        {
            name: t('Lion'),
            type: "LION",
        },
        {
            name: t('Tiger'),
            type: "TIGER",
        },
        {
            name: t('Dragon'),
            type: "DRAGON",
        }
    ])
    let awardPageTab = ref('LION');
    const left = ref(0);
    const cutAwardTab = (value, index) => {
        awardPageTab.value = value;
        // 控制奖励滑动
        left.value = index * 5.6
    };
    // 规则弹窗
    const showRule = ref(false);
    // 奖励弹窗
    const showAward = ref(false);

    // 奖励名字和钻石
    const explainName = ref([
        {
            name: t('Lion'),
            diamond: 2000
        },
        {
            name: t('Tiger'),
            diamond: 2000
        },
        {
            name: t('Dragon'),
            diamond: 2000
        }
    ])

    // 排行榜信息
    let rankList = ref([]);
    // 当前用户公会信息
    let myFamilyRank = ref({});
    // 跳转加入家族链接
    let schemeUrl = ref('');
    // 获取页面榜单数据
    const acquireRank = async (animal) => {
        /*
            animal: 查看那个tab数据
         */
        try {
            const res = await getRank({
                strongest_family_type: animal,
                page: 1,
                size: 30
            });
            if (res.status !== 1000) return;
            // 获取排行榜信息
            if (res.data.content) rankList.value = res.data.content;
            else rankList.value = []
            // 获取当前用户公会信息
            if (res.data.my_rank) myFamilyRank.value = res.data.my_rank;
            // 跳转家族地址
            if (res.data.scheme_url) schemeUrl.value = res.data.scheme_url;
        } catch (error) {
            console.log(error);
        }
    }
    // 狮数据
    const lion = ref([]);
    // 虎数据
    const tiger = ref([])
    // 龙数据
    const dragon = ref([]);
    // 获取奖励页奖励
    const getAward = async (animal) => {
        /*
            animal: 查看那个tab数据
         */
        try {
            const res = await getPrize({
                strongest_family_type: animal
            })
            if (res.status !== 1000) return;
            if (animal === 'LION' && res.data.reward_items) {
                lion.value = handleArray(res.data.reward_items);
            } else if (animal === 'TIGER' && res.data.reward_items) {
                tiger.value = handleArray(res.data.reward_items);

                console.log(tiger.value);
            } else if (animal === 'DRAGON' && res.data.reward_items) {
                dragon.value = handleArray(res.data.reward_items);
            }
            // lion.value[0] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/a6e3865947891144bd5742387071bb13.png",
            //     reward_name: t('Lion_Suit'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
            // lion.value[1] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/6649d426f8418255bfd3916738c0aa2d.png",
            //     reward_name: t('Black_Gold_Wings'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
            // tiger.value[0] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/15dcb94bd4c0f7dca74925a5238002c8.png",
            //     reward_name: t('Tiger_Suit'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
            // tiger.value[1] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/6649d426f8418255bfd3916738c0aa2d.png",
            //     reward_name: t('Black_Gold_Wings'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
            // dragon.value[0] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/8a855329cfe30292dab7794c7fc72c5d.png",
            //     reward_name: t('Dragon_Suit'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
            // dragon.value[1] = {
            //     object_type: "DUMMY_RESOURCE",
            //     reward_icon: "https://yaame-static.yaame.io/admin/6649d426f8418255bfd3916738c0aa2d.png",
            //     reward_name: t('Black_Gold_Wings'),
            //     reward_object: 0,
            //     validity_date: `30${t('day')}`,
            // }
        } catch (err) {
            console.log(err);
        }
    };

    let topTab = ref([
        {
            name: 'TOP 1',
            value: 0,
        }, {
            name: 'TOP 2',
            value: 1,
        }, {
            name: 'TOP 3',
            value: 2,
        }
    ]);

    let topTabActive = ref(0);
    // 处理数组数据为二维数组
    const handleArray = (list) => {
        // return list.reduce((acc, element) => {
        //     const index = element.reward_rank - 1;
        //     if (index >= 0 && index < 3) {
        //         acc[index].push(element);
        //     }
        //     return acc;
        // }, [[], [], []]);

        let arr = [[], [], []];

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.reward_rank === 1) {
                arr[0].push(element);
            } else if (element.reward_rank === 2) {
                arr[1].push(element);
            } else if (element.reward_rank === 3) {
                arr[2].push(element);
            }
        }
        return arr;
    }

    // tab吸顶
    let tabTop = ref();
    // 页面卷去高度
    const bodyTop = () => {
        if (!tabTop.value) return;
        // 获取动态的字体大小
        const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        // 算出屏幕到达的固定位置
        const targetPixeValue = window.pageYOffset / htmlSize;
        if (targetPixeValue >= 13.16) {
            tabTop.value.style.position = 'fixed';
            tabTop.value.style.top = '1.6rem';
        } else if (targetPixeValue < 13.16){
            tabTop.value.style.position = 'absolute';
            tabTop.value.style.top = '';
        }
    }

    // 定时器倒计时
    let timeOut = null;
    const openTiming = () => {
        timeOut = setInterval(() => {
            updateTime();
        },1000)
    }

    // 页面计时时间
    const targetDate = new Date("2024/4/29 00:00:00").getTime();
    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    // 时间倒计时
    const updateTime = () => {
        const now = new Date();
        const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // 转换为 UTC 时间
        const timeDifference = targetDate - utcNow.getTime();
        if (timeDifference > 0) {
            days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            hours.value = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            minutes.value = Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
            );
            seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
        } else {
            days.value = 0;
            hours.value = 0;
            minutes.value = 0;
            seconds.value = 0;
        }
    };


    // 打开奖励页
    const awardPage = () => {
        showAward.value = !showAward.value;
        getAward('LION');
        getAward('TIGER');
        getAward('DRAGON');
    };

    // 点击跳转到特定页
    const skip = (value) => {
        window.location.href = value;
    }

    // 点击空白进行隐藏
    const popupShow = (value) => {
        if (value === 'showRule') showRule.value = !showRule.value;
        else showAward.value = !showAward.value;
    }

    onMounted(() => {
        // 开启倒计时
        openTiming();
        // 获取默认tab数据
        acquireRank('LION');
        // 监听页面滚动事件
        document.addEventListener('scroll',bodyTop)
    })

    // 关闭定时器
    onBeforeUnmount(() => {
        clearInterval(timeOut);
    })
</script>

<style lang="less" scoped>
.main {
    position: relative;
    min-height: 7.71rem;
    padding-bottom: 2.35rem;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;
    .header {
        padding-top: .42rem;
    }
    //规则
    .rule,
    .award {
        position: fixed;
        top: 2.6rem;
        right: 0;
        min-width: 1.29rem;
        height: .53rem;
        padding: 0 0.1rem 0 0.2rem;
        background: url("https://yaame-static.yaame.io/admin/69b99057e784ce505f407500cc0355cd.png") no-repeat;
        background-size: 100% 100%;
        font-size: .25rem;
        text-align: center;
        color: #47220B;
        line-height: .53rem;
        font-weight: 600;
        z-index: 4;
    }
    //奖励
    .award {
        top: 3.92rem;
    }
    // 活动礼物样式
    .event-gift {
        position: relative;
        width: 6.76rem;
        height: 4.98rem;
        margin: 7.71rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/8d0bc14c4f6eaa34d61dc9dcb4e2b079.png") no-repeat;
        background-size: contain;
        .event-gift-header {
            position: absolute;
            top: .17rem;
            left: 50%;
            height: 0.3rem;
            line-height: .3rem;
            font-size: .3rem;
            font-weight: 600;
            color: #301307;
            transform: translateX(-50%);
        }
        .explain {
            position: absolute;
            top: 3.38rem;
            //bottom: .64rem;
            left: 50%;
            width: 5.5rem;
            font-size: .22rem;
            color: #FFFFDC;
            text-align: center;
            transform: translateX(-50%);
        }
        .explain-name {
            position: absolute;
            display: flex;
            top: 2.56rem;
            font-size: .22rem;
            font-weight: normal;
            flex-direction: column;
            align-items: center;
            span {
                width: 1rem;
                color: #FFFFFF;
                text-align: center;
            }
            .explain-diamond {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #FFCA5F;
                img {
                    width: .22rem;
                    height: .18rem;
                    margin-right: .04rem;
                }
            }
        }
        .explain0 {
            left: .96rem;
        }
        .explain1 {
            left: 2.88rem;
        }
        .explain2 {
            left: 4.8rem;
        }
    }
    // 活动时间样式
    .activity-time {
        position: relative;
        width: 6.14rem;
        height: 1.39rem;
        margin: .39rem auto .3rem;
        background: url("https://yaame-static.yaame.io/admin/df06c947b30a31c582ba9910eadbbdbe.png") no-repeat;
        background-size: contain;
        font-size: .24rem;
        font-weight: normal;
        color: #FFF4AA;
        div {
            display: inline-block;
            position: absolute;
            top: 0.53rem;
        }
        .days {
            left: 1.47rem;
        }
        .time-days {
            left: 2.13rem;
        }
        .hours {
            left: 2.89rem;
        }
        .minutes {
            right: 2.2rem;
        }
        .seconds {
            right: 1.4rem;
        }
    }
    // tab样式
    .tab {
        position: absolute;
        left: 50%;
        display: flex;
        width: 6.96rem;
        height: .82rem;
        margin-bottom: .36rem;
        align-items: center;
        justify-content: center;
        transform: translateX(-50%);
        background: url("https://yaame-static.yaame.io/admin/59951f79de4e9f70e88f740455afc77e.png") no-repeat;
        background-size: contain;
        z-index: 2;
        .tab-list {
            position: relative;
            display: flex;
            width: 2.28rem;
            height: .74rem;
            font-size: .28rem;
            font-weight: 600;
            color: #ECA25B;
            align-items: center;
            justify-content: center;
            &:nth-child(2) {
                img {
                    width: .54rem;
                    height: .36rem;
                }
            }
            &:nth-child(3) {
                img {
                    width: .46rem;
                    height: .48rem;
                }
            }
            &:nth-child(4) {
                img {
                    width: .46rem;
                    height: .5rem;
                }
            }
        }
        // 切换tab字体样式
        .tab-list-style {
            color: #260D03;
        }
        // 高亮样式
        .tab-highlight {
            position: absolute;
            left: .04rem;
            width: 2.28rem;
            height: .74rem;
            background: url("https://yaame-static.yaame.io/admin/c0d2755db95b7f693fcbb1c6b8c7a85f.png") no-repeat;
            background-size: contain;
        }
    }

    // 排名样式
    .rank-list {
        position: relative;
        margin-top: 1.48rem;
        .ranking {
            // 每一条排名的公共样式
            .ranking-common {
                position: relative;
                width: 6.96rem;
                height: 2.71rem;
                margin: 0 auto .2rem;
                background-image: url("https://yaame-static.yaame.io/admin/51d105a0e9e5bdf327d6964d5003a0f7.png");
                background-repeat: no-repeat;
                background-size: contain;
                .family-img {
                    position: absolute;
                    display: flex;
                    top: .63rem;
                    left: .33rem;
                    width: 1.44rem;
                    height: 1.44rem;
                    justify-content: center;
                    align-items: center;
                    background-image: url("https://yaame-static.yaame.io/admin/2b1b61747669f6070f9dcd8070f3cfc3.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                    img {
                        width: 1.37rem;
                        height: 1.37rem;
                        border-radius: .14rem;
                    }
                    span {
                        position: absolute;
                        top: 1.1rem;
                        left: 50%;
                        width: 1.6rem;
                        height: .76rem;
                        transform: translateX(-50%);
                        background-image: url("https://yaame-static.yaame.io/admin/65501c4b29a82118467b2eff988128a2.png");
                        background-repeat: no-repeat;
                        background-size: contain;
                        line-height: 0.95rem;
                        text-align: center;
                        font-size: .20rem;
                        font-weight: normal;
                        color: #FFDD58;
                    }
                    .span-center {
                        display: flex;
                        width: 1.19rem;
                        height: .6rem;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .family-name {
                    position: absolute;
                    display: flex;
                    top: .96rem;
                    left: 1.89rem;
                    flex-direction: column;
                    span {
                        width: 2.11rem;
                        font-size: .3rem;
                        font-weight: 600;
                        color: #FFE38B;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .diamond {
                        display: flex;
                        font-size: .24rem;
                        font-weight: 600;
                        color: #FFFFFF;
                        justify-content: flex-start;
                        align-items: center;
                        img {
                            width: .22rem;
                            height: .18rem;
                            margin-right: 0.1rem;
                        }
                    }
                }
                .family-member {
                    position: absolute;
                    top: .38rem;
                    right: .13rem;
                    font-size: .22rem;
                    font-weight: 600;
                    color: #FFFFFF;
                    .family-member-header {
                        width: 2.65rem;
                        height: .39rem;
                        line-height: .39rem;
                        margin-bottom: .12rem;
                        background-image: url("https://yaame-static.yaame.io/admin/d7060af9e5e0ff8fc09a749660e1ff0f.png");
                        background-repeat: no-repeat;
                        background-size: contain;
                        text-align: center;
                        font-weight: normal;
                    }
                    .family-top-three {
                        display: flex;
                        margin-bottom: 0.07rem;
                        padding-left: 0.3rem;
                        img {
                            float: left;
                            width: .5rem;
                            height: .5rem;
                            margin-right: .15rem;
                            border-radius: 50%;
                        }
                        .diamond {
                            float: left;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            img {
                                width: .22rem;
                                height: .18rem;
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
            //前三名样式
            .ranking-top0 {
                background-image: url("https://yaame-static.yaame.io/admin/9966a2f33e2df331f19274214c12460d.png");
                .family-img {
                    background-image: url("https://yaame-static.yaame.io/admin/702f6845fb598f2bc4a6bdc6fe05d4be.png");
                    span {
                        color: #FFDD58;
                        background-image: url("https://yaame-static.yaame.io/admin/c94d379536be47966008f605d8b1e514.png");
                    }
                }
                .family-member {
                    .family-member-header {
                        background-image: url("https://yaame-static.yaame.io/admin/9bd16816ccbb1f015c4f938490da59de.png");
                    }
                }
            }
            .ranking-top1 {
                background-image: url("https://yaame-static.yaame.io/admin/123dfb23c969e8e26b1ba8702be526f2.png");
                .family-img {
                    background-image: url("https://yaame-static.yaame.io/admin/af9e20322cb6994cd1c482d7819d3779.png");
                    span {
                        color: #D4F4FF;
                        background-image: url("https://yaame-static.yaame.io/admin/8846a7746da294f3ca91b6f0c1c76929.png");
                    }
                }
                .family-member {
                    .family-member-header {
                        background-image: url("https://yaame-static.yaame.io/admin/633bca47fcb825dfb6efd6411e1e9279.png");
                    }
                }
            }
            .ranking-top2 {
                background-image: url("https://yaame-static.yaame.io/admin/e345c876218907cf960a42a8fccffbab.png");
                .family-img {
                    background-image: url("https://yaame-static.yaame.io/admin/a091c58151fd1506a433648c17128b93.png");
                    span {
                        color: #FFD8B5;
                        background-image: url("https://yaame-static.yaame.io/admin/a5c7d28409cdb353854735346519d98e.png");
                    }
                }
                .family-member {
                    .family-member-header {
                        background-image: url("https://yaame-static.yaame.io/admin/d7060af9e5e0ff8fc09a749660e1ff0f.png");
                    }
                }
            }
        }
        .rank-lack {
            position: relative;
            height: 8.38rem;
            .lack {
                position: absolute;
                display: flex;
                top: 50%;
                left: 50%;
                flex-direction: column;
                align-items: center;
                font-size: .24rem;
                color: #C59044;
                transform: translate(-50%,-50%);
                img {
                    width: .84rem;
                    height: .82rem;
                }
                span {
                    width: 2.03rem;
                    text-align: center;
                }
            }
        }
    }

    // 当前用户样式
    .my-list {
        position: fixed;
        bottom: 0;
        width: 7.5rem;
        height: 2.22rem;
        background: url("https://yaame-static.yaame.io/admin/0e16a74772439f2370058f9edcd3a7a1.png") no-repeat;
        background-size: contain;
        z-index: 3;
        .my-style {
            .my-img {
                position: absolute;
                display: flex;
                top: .36rem;
                left: .33rem;
                width: 1.44rem;
                height: 1.44rem;
                justify-content: center;
                align-items: center;
                background-image: url("https://yaame-static.yaame.io/admin/2b1b61747669f6070f9dcd8070f3cfc3.png");
                background-repeat: no-repeat;
                background-size: contain;
                img {
                    width: 1.37rem;
                    height: 1.37rem;
                    border-radius: .14rem;
                }
                span {
                    position: absolute;
                    top: 1.1rem;
                    left: 50%;
                    width: 1.6rem;
                    height: .76rem;
                    transform: translateX(-50%);
                    background-image: url("https://yaame-static.yaame.io/admin/65501c4b29a82118467b2eff988128a2.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                    line-height: 0.95rem;
                    text-align: center;
                    font-size: .20rem;
                    font-weight: normal;
                    color: #FFDD58;
                }
                .span-center {
                    display: flex;
                    width: 1.19rem;
                    height: .6rem;
                    justify-content: center;
                    align-items: center;
                }
            }
            .my-name {
                position: absolute;
                display: flex;
                top: .69rem;
                left: 1.89rem;
                flex-direction: column;
                span {
                    width: 2.11rem;
                    font-size: .3rem;
                    font-weight: 600;
                    color: #FFE38B;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .my-diamond {
                    display: flex;
                    font-size: .24rem;
                    font-weight: 600;
                    color: #FFFFFF;
                    justify-content: flex-start;
                    align-items: center;
                    img {
                        width: .22rem;
                        height: .18rem;
                        margin-right: 0.1rem;
                    }
                }
            }
            .family-member {
                position: absolute;
                top: .67rem;
                right: .13rem;
                font-size: .22rem;
                font-weight: 600;
                color: #FFFFFF;
                .family-member-header {
                    width: 2.65rem;
                    height: .39rem;
                    margin-bottom: .12rem;
                    background-image: url("https://yaame-static.yaame.io/admin/d7060af9e5e0ff8fc09a749660e1ff0f.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                    text-align: center;
                    font-weight: normal;
                }
                .family-top-three {
                    display: flex;
                    padding-left: 0.3rem;
                    img {
                        float: left;
                        width: .5rem;
                        height: .5rem;
                        margin-right: .15rem;
                        border-radius: 50%;
                    }
                    .diamond {
                        float: left;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        img {
                            width: .22rem;
                            height: .18rem;
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
    // 加入公会样式
    .my-img {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2.37rem;
        background: url("https://yaame-static.yaame.io/admin/063253b2983d580628fdc38dbba4c61e.png") no-repeat;
        background-size: contain;
        z-index: 3;
        .my-list-img {
            position: fixed;
            display: flex;
            bottom: .4rem;
            left: 50%;
            width: 6.22rem;
            height: 1.29rem;
            justify-content: center;
            align-items: center;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/3bdb7769017b5c18c35504d5d3045b4d.png") no-repeat;
            background-size: contain;
            font-size: .3rem;
            color: #301307;
            font-weight: 600;
        }
    }
    // 当前用户信息阴影样式
    .my-shadow {
        position: fixed;
        bottom: 1.76rem;
        width: 7.5rem;
        height: 1.05rem;
        background: linear-gradient(180deg, rgba(48,19,7,0) 0%, #301307 100%);
        z-index: 2;
    }

    //规则页样式
    .rule-page,
    .award-page {
        width: 6.6rem;
        height: 9.48rem;
        margin: 1.43rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/c8aaba0af4c72c2bd77e18b2955b1816.png") no-repeat;
        background-size: contain;
        overflow: hidden;
        .rule-page-header {
            margin: .50rem auto 0;
            font-size: .34rem;
            font-weight: 600;
            color: #47220B;
            text-align: center;
        }
        p {
            width: 5.7rem;
            height: 7.1rem;
            margin: .54rem auto 0;
            font-size: .25rem;
            color: #FFB670;
        }
    }
    .rule-page-close {
        width: .7rem;
        height: .7rem;
        margin: .61rem auto;
        background: url("https://yaame-static.yaame.io/admin/04d7509a14786eca72f13ca9b607ed60.png") no-repeat;
        background-size: contain;
    }

    //奖励页样式
    .award-page {
        .rule-page-header {
            height: .34rem;
        }
        // tab样式
        .tab {
            position: relative;
            left: 50%;
            display: flex;
            width: 5.6rem;
            height: .66rem;
            margin-top: .5rem;
            margin-bottom: .24rem;
            align-items: center;
            justify-content: center;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/59951f79de4e9f70e88f740455afc77e.png") no-repeat;
            background-size: contain;
            z-index: 2;
            .tab-list {
                position: relative;
                display: flex;
                width: 2.28rem;
                height: .74rem;
                font-size: .28rem;
                font-weight: 600;
                color: #ECA25B;
                align-items: center;
                justify-content: center;
            }
            // 切换tab字体样式
            .tab-list-style {
                color: #260D03;
            }
            // 高亮样式
            .tab-highlight {
                position: absolute;
                left: .04rem;
                width: 1.84rem;
                height: .6rem;
                background: url("https://yaame-static.yaame.io/admin/c0d2755db95b7f693fcbb1c6b8c7a85f.png") no-repeat;
                background-size: contain;
                transition-duration: .3s;
            }
        }
        .top-tab {
            width: 5.6rem;
            height: 0.5rem;
            margin-left: 0.5rem;
            margin-bottom: 0.28rem;
            background: #581C03;
            border-radius: 0.25rem;
            display: flex;
            .top-tab-item {
                flex: 1;
                text-align: center;
                line-height: 0.5rem;
                font-size: 0.26rem;
                color: #BF4916;
                font-weight: 600;
                &.active {
                    width: 1.86rem;
                    height: 0.5rem;
                    background: linear-gradient( 180deg, #FFD271 0%, #F49B23 100%);
                    border-radius: 0.25rem;
                    text-align: center;
                    line-height: 0.5rem;
                    font-size: 0.26rem;
                    color: #832500;
                }
            }
        }

        // 具体奖励样式
        .award-particulars {
            width: 5.6rem;
            height: 6rem;
            margin: auto;
            overflow-x: hidden;
            ul {
                position: relative;
                width: 16.8rem;
                transition-duration: .3s;
                .lion,
                .tiger,
                .dragon {
                    display: flex;
                    float: left;
                    width: 5.6rem;
                    min-height: 6.5rem;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    .award-gift {
                        display: flex;
                        position: relative;
                        width: 2.16rem;
                        height: 2.14rem;
                        margin-bottom: .78rem;
                        justify-content: center;
                        background: url("https://yaame-static.yaame.io/admin/7b074018ce1281be6c6ccddd40ced917.png") no-repeat;
                        background-size: contain;
                        align-items: center;
                        font-size: .22rem;
                        &:last-of-type,
                        &:nth-last-child(2) {
                            margin-bottom: 0;
                        }
                        .gift-day {
                            position: absolute;
                            top: .1rem;
                            right: .16rem;
                            color: #FFE678;
                        }
                        img {
                            width: 1.4rem;
                        }
                        .gift-name {
                            position: absolute;
                            left: 50%;
                            bottom: .1rem;
                            transform: translateX(-50%);
                            color: #FFFFFF;
                            white-space: nowrap;
                        }
                        .gift-explain {
                            position: absolute;
                            min-height: .44rem;
                            bottom: -0.6rem;
                            width: 2.6rem;
                            color: #FFB670;
                            text-align: center;
                            line-height: .25rem;
                        }
                    }
                }
            }
        }
    }

    .popup {
        overflow: auto;
    }
}
</style>