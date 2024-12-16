<template>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" pulling-text="' '" loosing-text="' '" loading-text="' '">
    <div class="main" :style="{ backgroundImage: `url(${logoImg[locale]})` }">
        <custom-header color="blank">{{ $t('not_sincere') }}</custom-header>
        <!--规则-->
        <div class="rule fix-div" @click="showRule = true">{{ $t('rule') }}</div>
        <div class="reward fix-div" @click="toReward">{{ $t('reward') }}</div>
        <!--奖励-->
        <!--时间倒计时-->
        <div class="time">
            <div class="times">{{ days }}</div>
            <div class="times">D</div>
            <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
            <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
            <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
        </div>
        <!--tab-->
        <div class="tab">
            <div class="opt-for" :style="{ left: tabStyle === 'seek' ? '-0.08rem' : '3.01rem' }"></div>
            <div class="tabs" v-for="(item, index) in Tab" :key="index" @click="cutTab(item.type)">{{ item.name }}</div>
        </div>
        <!--寻找真爱-->
        <div v-show="tabStyle === 'seek'" class="seek-love" :class="[ Object.keys(loverData).length ? 'seek-lover' : '']">
            <!--搜索-->
            <div v-if="!Object.keys(loverData).length && !invite" class="search-frame">
                <div class="clear" @click="clear" v-show="clearButton"></div>
                <input type="text" :placeholder="$t('input_yaame_id')" v-model="searchValue" maxlength="20" @input="usernameRule">
                <div class="search" @click="search">{{ $t('Search') }}</div>
            </div>
            <!--列表-->
            <div v-show="!Object.keys(loverData).length && !invite" class="love-list">
                <div ref="lastLover" class="love" v-for="(item, index) in loveList" :key="item.uid" :style="{ left: Left[index] + 'rem', top: Top[index] + 'rem' }">
                    <img class="head" :src="item.avatar" alt="" @click="skip(item.scheme_url)">
                    <div class="love-name" @click="skip(item.scheme_url)">{{ item.nick }}</div>
                    <div class="like" @click="likeInvite(item)"></div>
                    <div class="no-like" @click="removeCurrent(item.uid, $event.currentTarget.parentNode, index)"></div>
                </div>
            </div>
            <!--缺省图-->
            <div v-show="!loveList.length && !Object.keys(loverData).length" class="lack">
                <span>{{ $t('input_correct_yaame_id') }}</span>
            </div>
            <!--刷新-->
            <div v-if="!Object.keys(loverData).length || invite" class="refresh" @click="refresh">{{ $t('refresh') }}</div>
            <!--爱人进度-->
            <div v-if="Object.keys(loverData).length" class="lover-plan">
                <span class="header">{{ $t('my_lover') }}</span>
                <div class="img"></div>
                <div class="head-invite" @click="skip(userRanking.scheme_url)">
                    <img :src="userData.avatar" alt="">
                    <span @click="skip(userRanking.scheme_url)">{{ userData.nick_name }}</span>
                </div>
                <div class="head-accept" @click="skip(userRanking.cp_scheme_url)">
                    <img :src="loverData.avatar" alt="">
                    <span @click="skip(userRanking.cp_scheme_url)">{{ loverData.nick_name }}</span>
                </div>
                <div class="schedule">
                    <div class="twig" :style="{ width: valueExp + 'rem' }"></div>
                </div>
                <span class="level">lv.{{ schedule.level }}</span>
                <span class="next-level">lv.{{ schedule.next_level }}</span>
            </div>
            <!--邀请界面-->
            <div v-show="invite" class="invite">
                <div class="you">
                    <div class="img-head" @click="skip(inviteUser.scheme_url)">
                        <img :src="inviteUser.avatar" alt="">
                    </div>
                    <div class="nick" @click="skip(inviteUser.scheme_url)">{{ inviteUser.nick }}</div>
                    <div class="id" @click="skip(inviteUser.scheme_url)">ID: {{ inviteUser.uid }}</div>
                    <!--详细信息-->
                    <div class="danmu">
                        <div @click="skip(inviteUser.scheme_url)" v-if="inDetail.guild_info_tag && Object.keys(inDetail.guild_info_tag).length" class="guild-info-tag">{{ inDetail.guild_info_tag.guild_name }}</div>
                        <div @click="skip(inviteUser.scheme_url)" v-if="inDetail.vip && Object.keys(inDetail.vip).length" class="vip" :style="{ backgroundImage: `url(${inDetail.vip.level_badge_icon})` }"></div>
                        <div @click="skip(inviteUser.scheme_url)" v-if="inDetail.noble && inDetail.noble.noble_level_badge && Object.keys(inDetail.noble.noble_level_badge).length" class="noble" :style="{ backgroundImage: `url(${inDetail.noble.noble_level_badge.level_badge_icon})` }"></div>
                        <div @click="skip(inviteUser.scheme_url)" v-if="inDetail.user_family && Object.keys(inDetail.user_family).length" class="user-family">
                            <img :src="inDetail.user_family.level_badge" alt="">
                            <span>{{ inDetail.family_name }}</span>
                        </div>
                    </div>
                </div>
                <div class="launch-invite">
                    <div class="award">
                        <img :src="userData.gift_icon" alt="">
                    </div>
                    <div class="text">{{ $t('send_lover_invitation') }}</div>
                    <p>{{ $t('after_acceptance') }}</p>
                    <div class="marry" @click="inviteUser.statue || !statue ? '' : marry()" :style="{ backgroundImage: `url(${inviteUser.statue || !statue ? 'https://yaame-static.yaame.io/admin/49ea1d934bc84b702173d423ec2c6aa9.png' : 'https://yaame-static.yaame.io/admin/56b780620a5a4b3173f6be02f924d357.png'})` }">
                        {{ inviteUser.statue || !statue ? $t('already_invited') : $t('proposal') }}<div v-if="inviteUser.statue || !statue"></div> <div v-else>(<img src="https://yaame-static.yaame.io/admin/5a2a786415c4f187530764edd420f69c.png" alt="">3999)</div>
                    </div>
                    <p>{{ $t('after_refusal') }}</p>
                </div>
            </div>
        </div>
        <!--真爱排行-->
        <div v-show="tabStyle === 'row'" class="love-ranking">
            <!--前三-->
            <div class="ranking-top" :class="`ranking-top${index}`" v-for="(item, index) in 3" :key="index">
                <!--翅膀-->
                <div class="wing"></div>
                <!--头像-->
                <div class="head-invite" @click="skip(rankingThree[index].scheme_url)">
                    <img v-if="rankingThree[index]" :src="rankingThree[index].invite_avatar" alt="">
                    <div v-else class="img"></div>
                </div>
                <div class="head-accept" @click="skip(rankingThree[index].cp_scheme_url)">
                    <img v-if="rankingThree[index]" :src="rankingThree[index].accept_avatar" alt="">
                    <div v-else class="img"></div>
                </div>
                <!--爱心-->
                <div class="love-img"></div>
                <!--名字-->
                <div v-if="rankingThree[index]" class="invite-nick" @click="skip(rankingThree[index].scheme_url)">{{ rankingThree[index].invite_nick }}</div>
                <div v-if="rankingThree[index]" class="accept-nick" @click="skip(rankingThree[index].cp_scheme_url)">{{ rankingThree[index].accept_nick }}</div>
                <!--得分-->
                <div v-if="rankingThree[index]" class="score">
                    <img src="https://yaame-static.yaame.io/admin/080daf4e7cef0863dff62c2e8215bed4.png" alt="">
                    {{ rankingThree[index].score }}
                </div>
            </div>
            <!--剩下排名-->
            <div class="ranking-last">
                <div class="last" v-for="(item, index) in rankingLast" :key="item.accept_uid">
                    <span>{{ 4 + index }}</span>
                    <div class="user-head">
                        <div class="img"></div>
                        <div @click="skip(item.scheme_url)"><img :src="item.invite_avatar" alt=""></div>
                        <div @click="skip(item.cp_scheme_url)"><img :src="item.accept_avatar" alt=""></div>
                    </div>
                    <div class="name">
                        <p @click="skip(item.scheme_url)">{{ item.invite_nick }}</p>
                        <p @click="skip(item.cp_scheme_url)">{{ item.accept_nick }}</p>
                    </div>
                    <div class="score">
                        <img src="https://yaame-static.yaame.io/admin/080daf4e7cef0863dff62c2e8215bed4.png" alt="">
                        {{ item.score }}
                    </div>
                </div>
            </div>
            <!--缺省图-->
            <div v-if="!rankingThree.length" class="lack">
                <span>{{ $t('no_one_on_the_list') }}</span>
            </div>
        </div>
        <!--底部个人排行-->
        <div v-if="Object.keys(userRanking).length && tabStyle === 'row'" class="my-ranking">
            <span>{{ userRanking.rank === 0 || userRanking.rank > 99 ? '99+' : userRanking.rank }}</span>
            <div class="user-head">
                <div class="img"></div>
                <div @click="skip(userRanking.scheme_url)"><img :src="userRanking.invite_avatar" alt=""></div>
                <div @click="skip(userRanking.cp_scheme_url)"><img :src="userRanking.accept_avatar" alt=""></div>
            </div>
            <div class="name">
                <p @click="skip(userRanking.scheme_url)">{{ userRanking.invite_nick }}</p>
                <p @click="skip(userRanking.cp_scheme_url)">{{ userRanking.accept_nick }}</p>
            </div>
            <div class="score">
                <img src="https://yaame-static.yaame.io/admin/080daf4e7cef0863dff62c2e8215bed4.png" alt="">
                {{ userRanking.score }}
            </div>
        </div>
        <!--邀请爱人展示-->
        <div v-if="!Object.keys(userRanking).length && tabStyle === 'row'" class="invite-lover" @click="tabStyle = 'seek'">
            <span>{{ $t('invite_lover') }}</span>
        </div>

        <rule v-show="showRule" @close="showRule = false"></rule>
    </div>
    </van-pull-refresh>
</template>

<script setup>
    import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
    import { Toast } from "vant";
    import rule from './components/rule.vue';
    import {
        getHomeInfoApi,
        getRankInfotList,
        getRemove,
        getSearch,
        getSuggestList,
        postInviteApi,
        postUserDetailApi
    } from "./api";
    import customHeader from "../../components/common/header.vue";
    import { getLanguage } from "@/lib/device"

    const root = getCurrentInstance()
    const router = root.proxy.$router;
    const t = (value) => {
        return root.proxy.$i18n.t(value);
    }

    let showRule = ref(false);
    const toReward = () => {
        router.push({ name: "reward" });
    }

    // 获取国家
    let locale = getLanguage() || "en";
    // 头图国际化
    const logoImg = ref({
        "ar": "https://yaame-static.yaame.io/admin/82984f1a2a71543896faa2a6142086b8.png",
        "en": "https://yaame-static.yaame.io/admin/111004a811091ea473d245f7ec15e884.png",
        "id": "https://yaame-static.yaame.io/admin/6ca491c82f765c9afab30e13ce7bad41.png",
        "zh-cn": "https://yaame-static.yaame.io/admin/6bd207fc1c535d9f218c772c8a34cb28.png",
        "zh-tw": "https://yaame-static.yaame.io/admin/7ac1f6f98dcb10637740a3993682e5b3.png",
    });

    // tab
    const Tab = ref([
        {
            name: t('find_love'),
            type: 'seek'
        },
        {
            name: t('love_ranking'),
            type: 'row'
        },
    ]);
    let tabStyle = ref('seek');
    const cutTab = (value) => {
        tabStyle.value = value;
        if (value === 'row') rankInfoList();
    };
    // 刷新
    const refresh = async () => {
        searchValue.value = ''; // 清空输入框
        statue.value = false; // 充值邀请高亮
        invite.value = false; // 关闭邀请界面
        newData.value = true; // 是否请求最新的九条数据
        loveList.value.forEach((item, index) => {
            // lastLover.value[index].style.scale = 0;
            lastLover.value[index].style.transform = 'scale(0)';
        })
        await getUserData();
        newData.value = false;
    }

    // 喜欢/邀请
    const invite = ref(false);
    const inviteUser = ref({});
    const statue = ref(true);
    // 用户详细信息
    const inDetail = ref({
        family_name: '',
        guild_info_tag: {},
        noble: {},
        user_family: {},
        vip: {}
    });
    const likeInvite = async (item) => {
        invite.value = true;
        inviteUser.value = item;
        try {
            const res = await postUserDetailApi({ req_uid: item.uid });
            if (res.status !== 1000) return;
            for (let valueKey in inDetail.value) {
                inDetail.value[valueKey] = res.data.be_serious_user[valueKey]
            }
        } catch (err) {
            console.log(err);
        }
    }
    // 发起邀请
    const marry = async () => {
        try {
            const res = await postInviteApi({ relation_uid: inviteUser.value.uid })
            if (res.status !== 1000) {
                if (res.status === 6600) {
                    Toast(t('insufficient_diamonds'));
                    setTimeout(() => {
                        window.location.href = "wlyaame://mine/shop/diamond?popup=1";
                    }, 500)
                    return;
                }
                if (res.status === 10014) { // 发起邀请成功
                    Toast(res.desc);
                    statue.value = false;
                    return;
                }
                Toast(res.desc);
                invite.value = false;
                await getUserData();
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }
    // 搜索
    const searchValue = ref('');
    const search = async () => {
        try {
            if (loveList.value.length === 9 && searchValue.value.length === 0) { // 移除单个搜索用户动画
                return;
            }
            if (searchValue.value.length === 0) { // 输入框为零展示之前九条数据
                await getUserData();
                return;
            }
            if (searchValue.value.length === 1) { // 为1展示缺省图
                loveList.value.forEach((item, index) => {
                    // lastLover.value[index].style.scale = 0;
                    lastLover.value[index].style.transform = 'scale(0)';
                })
                setTimeout(() => {
                    loveList.value = [];
                }, 500)
                return;
            }
            if (loveList.value.length === 1) { // 移除单个搜索用户动画
                // lastLover.value[0].style.scale = 0;
                lastLover.value[0].style.transform = 'scale(0)';
                setTimeout(() => {
                    loveList.value.pop();
                }, 500)
            }
            const res = await getSearch({ yaameId: searchValue.value });
            if (res.status !== 1000) {
                Toast(res.desc)
                return;
            }
            // 移除九条数据动画
            loveList.value.forEach((item, index) => {
                // lastLover.value[index].style.scale = 0;
                lastLover.value[index].style.transform = 'scale(0)';
            })
            // 等待动画结束消除数据
            if (Object.keys(res.data).length === 0) {
                setTimeout(() => {
                    loveList.value = [];
                },500)
                return;
            }
            // 等待移除结束更换数据
            setTimeout(() => {
                loveList.value = [res.data.be_serious_user];
                nextTick(() => {
                    lastLover.value[0].style.transform = 'scale(0)';
                })
            },500)
            setTimeout(() => {
                nextTick(() => {
                    lastLover.value[0].style.transform = 'scale(1)';
                })
            },600)
        } catch (err) {
            console.log(err);
        }
    }
    // 清除搜索框
    const clearButton = ref(false);
    const clear = () => {
        searchValue.value = '';
        clearButton.value = false;
        getUserData();
    }
    // 输入框内容检测
    const regex = /[^a-zA-Z0-9]/g;
    const usernameRule = () => {
        if (searchValue.value.length > 0) clearButton.value = true;
        else clearButton.value = false;
        if (regex.test(searchValue.value)) {
            searchValue.value = searchValue.value.replace(regex, "");
        }
    }

    // 不喜欢操作
    const lastLover = ref(null);
    // 节流阀
    let throttle = ref(false);
    const removeCurrent = async (uid, ref, inx) => {
        try {
            if (throttle.value) return;
            throttle.value = true;
            // newData是否刷新新数据
            newData.value = true;
            await suggestList(1);
            newData.value = false;
            ref.style.transform = 'scale(0)';
            setTimeout(() => {
                loveList.value = loveList.value.filter(item => item.uid !== uid);
            }, 500)
            if (inx > 4) {
                loveList.value.push(oneLover.value[0]);
                setTimeout(() => {
                    lastLover.value[8].style.transform = 'scale(1)';
                    throttle.value = false;
                }, 1000)
            } else {
                setTimeout(() => {
                    loveList.value.push(oneLover.value[0]);
                }, 500)
                setTimeout(() => {
                    lastLover.value[8].style.transform = 'scale(1)';
                    throttle.value = false;
                }, 1500)
            }
            const res = await getRemove({ remove_id: uid });
            if (res.status !== 1000) Toast(res.desc);
        } catch (err) {
            console.log(err);
        }
    }

    // 用户信息、是否有lover关系
    const userData = ref({});
    const loverData = ref({});
    // 进度数据
    const schedule = ref({});
    let valueExp = ref(0);
    // 页面时间
    const timeBegin = ref(0);
    const timeEnd = ref(0);
    // isLoading
    const isLoading = ref(false);
    const getUserData = async () => {
        try {
            invite.value = false;
            statue.value = true; // 重置
            const res = await getHomeInfoApi(); // 获取页面信息
            if (res.status !== 1000) {
                // 保证活动结束还能继续展示推荐列表
                // 获取推荐列表信息
                await suggestList(9, false);
                // 展示数据动画
                loveList.value.forEach((item, index) => {
                    lastLover.value[index].style.transform = 'scale(0)';
                })
                setTimeout(() => {
                    loveList.value.forEach((item, index) => {
                        lastLover.value[index].style.transform = 'scale(1)';
                    })
                });
                return;
            };
            userData.value = res.data;
            timeBegin.value = res.data.activity_begin_time;
            timeEnd.value = res.data.activity_end_time;
            // 判断是否存在lover关系
            if (!res.data.user_cp_love_info) {
                // 获取推荐列表信息
                await suggestList(9, false);
                // 展示数据动画
                loveList.value.forEach((item, index) => {
                    lastLover.value[index].style.transform = 'scale(0)';
                })
                setTimeout(() => {
                    loveList.value.forEach((item, index) => {
                        lastLover.value[index].style.transform = 'scale(1)';
                    })
                });
                return;
            }
            loverData.value = res.data.user_cp_love_info;
            schedule.value = res.data.user_cp_love_info.cp_level_info;
            // 计算当前进度
            setTimeout(() => {
                valueExp.value = loverData.value.cp_exp * (4.04 / schedule.value.max_value);
            })
        } catch (err) {
            console.log(err);
        }
    };

    // 寻找真爱
    const loveList = ref([]);
    let oneLover = ref([]);
    let Left = ref([0.13, 2.53, 4.93, 0.13, 2.53, 4.93, 0.13, 2.53, 4.93]);
    let Top = ref([0, 0, 0, 3.54, 3.54, 3.54, 7.09, 7.09, 7.09]);
    // 是否请求最新数据
    const newData = ref(false);
    const suggestList = async (value) => {
        try {
            const res = await getSuggestList({ limit: value, isRefresh: newData.value });
            if (res.status !== 1000) return;
            // 判断获取几条
            if (value > 1) loveList.value = res.data.list;
            else oneLover.value = res.data.list;
        } catch (err) {
            console.log(err);
        }
    };

    // 排行榜信息
    let rankingThree = ref([]); // 前三名数据
    let rankingLast = ref([]); // 后面剩下数据
    let userRanking = ref({});
    const rankInfoList = async () => {
        try {
            const res = await getRankInfotList({
                page: 1,
                size: 50
            });
            if (res.status !== 1000) return;
            userRanking.value = res.data.own_rank_info ? res.data.own_rank_info : {};
            processRanking(res.data.be_serious_rank_list);
        } catch (err) {
            console.log(err);
        }
    };
    // 处理排名数据
    const processRanking = (data) => {
        rankingThree.value = data.splice(0, 3);
        rankingLast.value = data;
    };
    // 页面计时时间
    let days = ref(0);
    let hours = ref(0);
    let minutes = ref(0);
    let seconds = ref(0);
    const updateTime = () => {
        const now = new Date().getTime();
        const timeDifference = timeEnd.value - now;
        if (timeDifference > 0) {
            days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
        } else {
            days.value = 0;
            hours.value = 0;
            minutes.value = 0;
            seconds.value = 0;
        }
    };

    // 跳转个人主页
    const skip = (value) => {
        window.location.href = value;
    }

    // 定时器倒计时
    let timeOut = null;
    const openTiming = () => {
        timeOut = setInterval(() => {
            updateTime();
        },1000)
    }

    // 下拉刷新
    const onRefresh = async () => {
        loverData.value = {}
        // 获取排行榜信息
        await rankInfoList();
        // 获取当前用户是否有lover
        await getUserData();
        isLoading.value = false;
    }

    onMounted(() => {
        // 开启倒计时
        openTiming();
        // 获取排行榜信息
        rankInfoList();
        // 获取当前用户是否有lover
        getUserData();
    });
    onBeforeUnmount(() => {
        clearTimeout(timeOut);
    })
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    background: url("https://yaame-static.yaame.io/admin/90b7a6ab8831babbda0a6cc8b6673b9d.png") no-repeat;
    background-size: contain;
    overflow: hidden;
    .fix-div {
        min-width: 1.1rem;
        height: 0.52rem;
        text-align: center;
        line-height: 0.52rem;
        position: fixed;
        right: 0;
        background: linear-gradient( 180deg, #74D4FF 0%, #6275FF 100%);
        border: 0.02rem solid #D0ECFF;
        font-size: 0.3rem;
        color: #FFFFFF;
        border-top-left-radius: 0.12rem;
        border-bottom-left-radius: 0.12rem;
        z-index: 9;
        &.rule{
            top: 2.88rem;
        }
        &.reward{
            top: 3.71rem;
        }
    }
    //时间计时
    .time {
        position: relative;
        margin: 9rem auto 0;
        overflow: hidden;

        .times {
            float: left;
            width: .34rem;
            height: .4rem;
            line-height: .4rem;
            font-size: .28rem;
            color: #F3ECFF;
            text-align: center;
            margin-left: 1.9rem;
        }

        .times:nth-child(2) {
            margin-left: .33rem;
        }

        .times:nth-child(3) {
            margin-left: .49rem;
        }

        .times:nth-child(4) {
            margin-left: .6rem;
        }

        .times:nth-child(5) {
            margin-left: .55rem;
        }
    }

    //tab样式
    .tab {
        position: relative;
        display: flex;
        width: 6.2rem;
        height: .88rem;
        margin: .72rem auto 0;
        justify-content: space-around;
        align-items: center;
        background: #8197EF;
        border-radius: .44rem;
        border: .02rem solid #DFF1FF;
        font-size: .28rem;
        color: #FFFFFF;

        .tabs {
            position: relative;
            flex: 1;
            z-index: 1;
            text-align: center;
        }

        .opt-for {
            position: absolute;
            top: 0;
            left: -.14rem;
            width: 3.2rem;
            height: .98rem;
            background: url("https://yaame-static.yaame.io/admin/5875fc0b71a2d0a46476a848a2c799b3.png") no-repeat;
            background-size: contain;
            transition-duration: .3s;
        }
    }

    //寻找真爱样式
    .seek-love,
    .love-ranking {
        position: relative;
        width: 7.3rem;
        margin: .4rem auto 0.45rem;
        background: #92B9FB;
        border-radius: .26rem;
        border: .01rem solid #E3E3FF;
        background: url("https://yaame-static.yaame.io/admin/f621700dd35e4d2687f626beafa94d2f.png") no-repeat;
        background-size: contain;
        font-size: .26rem;
        color: #A5B1B8;
        // 搜索样式
        .search-frame {
            display: flex;
            position: absolute;
            top: .31rem;
            left: 50%;
            justify-content: center;
            align-items: center;
            transform: translateX(-50%);

            .clear {
                position: absolute;
                top: 50%;
                left: 2.85rem;
                width: .2rem;
                height: .2rem;
                transform: translateY(-50%);
                background: url("https://yaame-static.yaame.io/admin/eaf53573099def90079986eec783627c.png") no-repeat;
                background-size: contain;
            }

            input {
                width: 3.3rem;
                height: .7rem;
                padding: 0 .45rem;
                margin-right: .12rem;
                background-color: #D3E5FF;
                border-radius: .35rem;
                appearance: none;
                border: none;
                outline: none;
            }
            input::placeholder {
                color: #A5B1B8;
            }

            .search {
                display: flex;
                width: 1.3rem;
                height: .54rem;
                line-height: .54rem;
                justify-content: center;
                align-items: center;
                background: linear-gradient(90deg, #3162F7 0%, #2FABFC 100%);
                border-radius: .27rem;
                color: #fff;
            }
        }

        // 真爱列表
        .love-list {
            //display: flex;
            position: absolute;
            top: 1.46rem;
            //flex-direction: row;
            //flex-wrap: wrap;

            .love {
                position: absolute;
                width: 2.25rem;
                height: 3.38rem;
                //margin: 0 .15rem .16rem 0;
                background: url("https://yaame-static.yaame.io/admin/51566da3b2b23822bdfc001092f5a0db.png") no-repeat;
                background-size: contain;
                transition-duration: .5s;
                // scale: 0;
                transform: scale(0);

                .head {
                    position: absolute;
                    top: .78rem;
                    left: 50%;
                    width: 1rem;
                    height: 1rem;
                    transform: translateX(-50%);
                    border-radius: 50%;
                    border: .04rem solid #A6BAF7;
                    background: #CDDFFE;
                }

                .love-name {
                    position: absolute;
                    width: .88rem;
                    top: 1.91rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: .22rem;
                    color: #6C8BE8;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: center;
                }

                .like,
                .no-like {
                    position: absolute;
                    top: 2.38rem;
                    left: .39rem;
                    width: .48rem;
                    height: .48rem;
                    background-image: url("https://yaame-static.yaame.io/admin/eb4b3247eb59fb6210737022e8f0efce.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                }

                .like {
                    left: 1.39rem;
                    background-image: url("https://yaame-static.yaame.io/admin/42130d5ded3aeddeb54cfc5461906668.png");
                }
            }

            .love:nth-child(3n) {
                margin-right: 0;
            }
        }

        //刷新列表
        .refresh {
            display: flex;
            position: absolute;
            bottom: .18rem;
            left: 50%;
            width: 2.66rem;
            height: .97rem;
            padding-right: .1rem;
            justify-content: center;
            align-items: center;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/f4a1fb46b5f99a13a3a654eec26f51e0.png") no-repeat;
            background-size: contain;
            font-size: .26rem;
            color: #FFFFFF;
        }

        //和爱人进度
        .lover-plan {
            position: relative;
            width: 6.82rem;
            height: 4.31rem;
            background: url("https://yaame-static.yaame.io/admin/85e2e044a6c8f6f006c6ab915ad29403.png") no-repeat;
            background-size: contain;
            .header {
                position: absolute;
                top: .4rem;
                left: 50%;
                height: .33rem;
                transform: translateX(-50%);
                line-height: .33rem;
                text-align: center;
                font-size: .24rem;
                color: #FFFFFF;
            }
            .img {
                position: absolute;
                top: 1.69rem;
                left: 2.94rem;
                width: .92rem;
                height: .54rem;
                background: url("https://yaame-static.yaame.io/admin/aa154970cffb1b4fa964be988a3e03b5.png") no-repeat;
                background-size: contain;
            }
            .head-invite,
            .head-accept {
                position: absolute;
                top: 1.27rem;
                left: 1.59rem;
                display: flex;
                width: 1.38rem;
                height: 1.38rem;
                justify-content: center;
                align-items: center;
                background: url("https://yaame-static.yaame.io/admin/96ec19be2f24614a3357ef8022364d7d.png") no-repeat;
                background-size: contain;
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    margin-top: 0.05rem;
                }
                span {
                    position: absolute;
                    top: 1.46rem;
                    width: 1.38rem;
                    height: .3rem;
                    line-height: .3rem;
                    font-size: .22rem;
                    color: #EB68A9;
                    text-align: center;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }
            .head-accept {
                left: 3.85rem;
            }

            .schedule {
                position: absolute;
                display: flex;
                align-items: center;
                top: 3.19rem;
                left: 50%;
                width: 4.04rem;
                height: .15rem;
                transform: translateX(-50%);
                background: #F5BCD8;
                border-radius: .08rem;
                border: .01rem solid #FEDB7D;
                overflow: hidden;
                .twig {
                    position: absolute;
                    width: 2rem;
                    height: .13rem;
                    background: #FF5D9F;
                    border-radius: .08rem;
                    border: .01rem solid #FEDB7D;
                    transition-duration: .5s;
                }
                span {
                    position: absolute;
                    top: .23rem;
                    height: .22rem;
                    line-height: .22rem;
                    font-size: .16rem;
                    color: #EB68A9;
                }
                span:nth-child(1) {
                    left: 0;
                }
                span:nth-child(2) {
                    right: 0;
                }
            }
            .level,
            .next-level {
                position: absolute;
                left: 1.39rem;
                bottom: .67rem;
                font-size: .16rem;
                color: #EB68A9;
            }
            .next-level {
                left: 5.2rem;
            }
        }
    }

    .seek-love {
        height: 13.32rem;
        .invite {
            .you {
                width: 6.5rem;
                height: 4.2rem;
                margin: 0.47rem auto 0;
                background: linear-gradient( 180deg, #DCEBFF 0%, #F1F4FF 100%);
                border-radius: .49rem;
                border: .04rem solid #7FA3FF;
                overflow: hidden;
                color: #799CFF;
                .danmu {
                    display: flex;
                    width: 3rem;
                    margin: auto;
                    justify-content: center;
                    align-items: flex-end;
                    flex-wrap: wrap;
                    .guild-info-tag {
                        display: flex;
                        height: .37rem;
                        margin: 0 .1rem;
                        justify-content: center;
                        align-items: center;
                        padding: 0 .1rem;
                        background-color: #9F45F9;
                        color: #fff;
                        font-size: .22rem;
                        border-radius: 0.1rem;
                    }
                    .vip {
                        width: .88rem;
                        height: .3rem;
                        margin: 0 .1rem;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }
                    .noble {
                        width: .42rem;
                        height: .37rem;
                        margin: 0 .1rem;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }
                    .user-family {
                        display: flex;
                        height: .37rem;
                        margin: 0 .1rem;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: .3rem;
                            height: .3rem;
                        }
                        span {
                            height: .3rem;
                            margin-left: .05rem;
                            padding: 0 .1rem;
                            background-color: #9F45F9;
                            color: #fff;
                            font-size: .22rem;
                            border-radius: 0.1rem;
                            white-space: nowrap;
                        }
                    }
                }
                .img-head {
                    display: flex;
                    width: 1.75rem;
                    height: 1.75rem;
                    justify-content: center;
                    align-items: center;
                    margin: .35rem auto .16rem;
                    border: .04rem solid #98B1FF;
                    border-radius: 50%;
                    img {
                        width: 1.65rem;
                        height: 1.65rem;
                        border-radius: 50%;
                    }
                }
                .nick {
                    height: .37rem;
                    margin: 0 auto .03rem;
                    line-height: .37rem;
                    font-size: .26rem;
                    text-align: center;
                }
                .id {
                    height: .33rem;
                    font-size: .24rem;
                    text-align: center;
                }
            }
            .launch-invite {
                width: 6.92rem;
                height: 6.85rem;
                margin: 0.19rem auto 0;
                background: url("https://yaame-static.yaame.io/admin/420d8099ac7e0a4c1ab1092879cce01b.png") no-repeat;
                background-size: contain;
                overflow: hidden;
                font-size: .20rem;
                color: #90ADFE;
                .award {
                    display: flex;
                    width: 1.98rem;
                    height: 1.98rem;
                    margin: 1.78rem auto 0;
                    justify-content: center;
                    align-items: center;
                    background: url("https://yaame-static.yaame.io/admin/52a358c9d165ab0e66c06a991f1573e9.png") no-repeat;
                    background-size: contain;
                    img {
                        width: 1.7rem;
                    }
                }
                .text {
                    width: 90%;
                    height: .37rem;
                    margin: .06rem auto 0;
                    line-height: .37rem;
                    font-size: .26rem;
                    color: #799CFF;
                    text-align: center;
                }
                p {
                    width: 90%;
                    height: .28rem;
                    margin: auto;
                    line-height: .28rem;
                    text-align: center;
                }
                .marry {
                    display: flex;
                    width: 3.1rem;
                    height: .96rem;
                    justify-content: center;
                    align-items: center;
                    margin: .21rem auto 0;
                    padding-bottom: 0.1rem;
                    background: url("https://yaame-static.yaame.io/admin/56b780620a5a4b3173f6be02f924d357.png") no-repeat;
                    background-size: contain;
                    font-size: .26rem;
                    color: #FFFFFF;
                    div {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: .26rem;
                            height: .22rem;
                        }
                    }
                }
            }
        }
        .lack {
            position: absolute;
            display: flex;
            justify-content: center;
            top: 2.29rem;
            left: 50%;
            width: 1rem;
            height: 1.2rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/86d5dbcbd82130f333e1fa90c9d85098.png") no-repeat;
            background-size: contain;
            span {
                position: absolute;
                top: 1.64rem;
                font-size: .24rem;
                color: #FFFFFF;
                white-space: nowrap;
            }
        }
    }

    .love-ranking {
        min-height: 12.56rem;
        padding-bottom: 2.07rem;
        // 前三排名样式
        .ranking-top {
            position: absolute;
            top: 3.46rem;
            width: 3.51rem;
            height: 1.38rem;
            background-image: url("https://yaame-static.yaame.io/admin/121474fc8897f6f92b4eb44bda0914ef.png");
            background-repeat: no-repeat;
            background-size: contain;
            font-size: .2rem;
            color: #3B66CC;

            .wing {
                position: absolute;
                top: 1.06rem;
                left: 50%;
                width: 1.46rem;
                height: 1.58rem;
                transform: translateX(-50%);
                background-image: url("https://yaame-static.yaame.io/admin/3c8024eb670d9501f18193b6f1d4d477.png");
                background-repeat: no-repeat;
                background-size: contain;
            }

            .head-invite,
            .head-accept {
                position: absolute;
                top: .31rem;
                left: .98rem;
                display: flex;
                width: .9rem;
                height: .9rem;
                justify-content: center;
                align-items: center;
                background-image: url("https://yaame-static.yaame.io/admin/04da31be98e35cfa45ddad1799947c27.png");
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: .8rem;
                    height: .8rem;
                    border-radius: 50%;
                }

                .img {
                    width: .8rem;
                    height: .8rem;
                    border-radius: 50%;
                    background: #ABACCC url("https://yaame-static.yaame.io/admin/240748f39165ff524e773b0fe4ed7773.png") no-repeat;
                    background-size: .26rem .3rem;
                    background-position: center;
                }
            }

            .head-accept {
                left: 1.59rem;
            }

            .love-img {
                position: absolute;
                top: .57rem;
                left: 1.5rem;
                width: .35rem;
                height: .35rem;
                background: url("https://yaame-static.yaame.io/admin/94c07eb2829d333e316a2abc0a374eb6.png") no-repeat;
                background-size: contain;
            }

            .invite-nick,
            .accept-nick {
                position: absolute;
                top: 1.55rem;
                left: 50%;
                width: 1.23rem;
                height: .28rem;
                transform: translateX(-50%);
                line-height: .28rem;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .accept-nick {
                top: 1.82rem;
            }

            .score {
                position: absolute;
                top: 2.04rem;
                left: 50%;
                height: .28rem;
                display: flex;
                justify-content: center;
                align-items: baseline;
                transform: translateX(-50%);

                img {
                    width: .18rem;
                    height: .15rem;
                }
            }
        }

        .ranking-top0 {
            top: .18rem;
            left: 50%;
            width: 5.25rem;
            height: 2.06rem;
            transform: translateX(-50%);
            background-image: url("https://yaame-static.yaame.io/admin/44a5b8dc0da3d9b17150a7f477e464d7.png");
            font-size: .22rem;
            color: #B46E09;

            .wing {
                top: 1.36rem;
                width: 1.79rem;
                height: 1.94rem;
                background-image: url("https://yaame-static.yaame.io/admin/8c3d563a03d1ad0d1ca7c7a76c9308dc.png");
            }

            .head-invite,
            .head-accept {
                top: .4rem;
                left: 1.53rem;
                width: 1.3rem;
                height: 1.3rem;
                background-image: url("https://yaame-static.yaame.io/admin/32f6ba6abed73340a114c1f1904c71c2.png");

                img {
                    width: 1.2rem;
                    height: 1.2rem;
                }
                .img {
                    width: 1.2rem;
                    height: 1.2rem;
                    background-size: .4rem .46rem;
                }
            }

            .head-accept {
                left: 2.44rem;
            }

            .love-img {
                top: .72rem;
                left: 2.27rem;
                width: .66rem;
                height: .66rem;
            }

            .invite-nick,
            .accept-nick {
                position: absolute;
                top: 1.97rem;
                left: 50%;
                width: 1.32rem;
                height: .30rem;
                transform: translateX(-50%);
                line-height: .30rem;
            }

            .accept-nick {
                top: 2.3rem;
            }

            .score {
                top: 2.58rem;
                height: .3rem;

                img {
                    width: .19rem;
                    height: .16rem;
                }
            }
        }

        .ranking-top1 {
            left: .05rem;
        }

        .ranking-top2 {
            left: 3.7rem;
            background-image: url("https://yaame-static.yaame.io/admin/b1eca0ef693e457eabc5d33c6027aa79.png");
            color: #E34195;

            .wing {
                background-image: url("https://yaame-static.yaame.io/admin/36bfc9c388a4ab5943ff7386b8ccd001.png");
            }

            .head-invite,
            .head-accept {
                background-image: url("https://yaame-static.yaame.io/admin/6527ecf8982379d20603a14a7c2003ab.png");
            }
        }

        //剩下排名样式
        .ranking-last {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 6.26rem;

            .last {
                display: flex;
                width: 7.01rem;
                height: 1.9rem;
                margin-bottom: .2rem;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                background: url("https://yaame-static.yaame.io/admin/1a81ed753a2bec9aa9bbd6b8c820120a.png") no-repeat;
                background-size: contain;
                font-size: .26rem;
                color: #799CFF;

                span {
                    display: flex;
                    justify-content: center;
                    width: .16rem;
                    height: .37rem;
                    margin: 0 .2rem 0 .44rem;
                }

                .user-head {
                    position: relative;
                    display: flex;

                    .img {
                        position: absolute;
                        top: .28rem;
                        left: .66rem;
                        width: .38rem;
                        height: .38rem;
                        background: url("https://yaame-static.yaame.io/admin/94c07eb2829d333e316a2abc0a374eb6.png") no-repeat;
                        background-size: contain;
                        z-index: 1;
                    }

                    div {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: .94rem;
                        height: .94rem;
                        background: url("https://yaame-static.yaame.io/admin/04da31be98e35cfa45ddad1799947c27.png") no-repeat;
                        background-size: contain;

                        img {
                            width: .84rem;
                            height: .84rem;
                            border-radius: 50%;
                        }
                    }

                    div:nth-child(3) {
                        left: -.16rem;
                    }
                }

                .name {
                    margin: 0 0.69rem 0 .02rem;

                    p {
                        width: 1.93rem;
                        height: .33rem;
                        font-size: .24rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }

                .score {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: .19rem;
                        height: .16rem;
                        margin-right: .06rem;
                    }
                }
            }
        }

        .lack {
            position: absolute;
            display: flex;
            justify-content: center;
            top: 6.84rem;
            left: 50%;
            width: 1rem;
            height: 1.2rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/86d5dbcbd82130f333e1fa90c9d85098.png") no-repeat;
            background-size: contain;

            span {
                position: absolute;
                top: 1.64rem;
                font-size: .24rem;
                color: #FFFFFF;
                white-space: nowrap;
            }
        }
    }

    .seek-lover {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 5.08rem;
    }

    //个人排行
    .my-ranking,
    .invite-lover {
        position: fixed;
        bottom: 0;
        width: 7.5rem;
        height: 2.07rem;
        padding-top: 0.6rem;
        background: url("https://yaame-static.yaame.io/admin/82072a95bfe5d57a5e5d7d9049b2cc66.png") no-repeat;
        background-size: contain;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: .26rem;
        color: #799CFF;
        z-index: 2;

        span {
            display: flex;
            justify-content: center;
            width: .16rem;
            height: .37rem;
            margin: 0 .2rem 0 .44rem;
        }

        .user-head {
            position: relative;
            display: flex;

            .img {
                position: absolute;
                top: .28rem;
                left: .66rem;
                width: .38rem;
                height: .38rem;
                background: url("https://yaame-static.yaame.io/admin/94c07eb2829d333e316a2abc0a374eb6.png") no-repeat;
                background-size: contain;
                z-index: 1;
            }

            div {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: .94rem;
                height: .94rem;
                background: url("https://yaame-static.yaame.io/admin/04da31be98e35cfa45ddad1799947c27.png") no-repeat;
                background-size: contain;

                img {
                    width: .84rem;
                    height: .84rem;
                    border-radius: 50%;
                }
            }

            div:nth-child(3) {
                left: -.16rem;
            }
        }

        .name {
            margin: 0 0.69rem 0 .02rem;

            p {
                width: 1.93rem;
                height: .33rem;
                font-size: .24rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        .score {
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: .19rem;
                height: .16rem;
                margin-right: .06rem;
            }
        }
    }

    // 邀请爱人
    .invite-lover {
        font-size: .26rem;
        color: #FFFFFF;
        z-index: 2;

        span {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: .18rem;
            left: 50%;
            width: 3.74rem;
            height: .87rem;
            margin: 0;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/1afc6009e852c1505bcf41180da54509.png") no-repeat;
            background-size: contain;
        }
    }
}
</style>
