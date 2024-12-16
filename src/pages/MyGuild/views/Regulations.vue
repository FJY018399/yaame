<template>
    <div class="main">
        <Header :keep="true" color="blank">{{ $t('income_policy') }}</Header>
        <!-- 语音房间收益政策 -->
        <div class="audio-room">
            <p>{{ $t('voice_room_income_policy') }}</p>
            <p class="info-p">{{ $t('voice_room_income_policy_tip') }}</p>
            <p class="info-p">{{ $t('voice_room_income_policy_tip2') }}</p>
            <!-- 表格 -->
            <div class="sheet">
                <!-- 头部标题 -->
                <div class="head">
                    <div v-for="(item, index) in audioList" :key="index">{{ item }}</div>
                </div>
                <!-- 表格内容 -->
                <div class="content" v-for="(item, index) in voiceHead" :key="index">
                    <div class="right">{{ item.name }}</div>
                    <div class="lift" :style="{ flex: audioList.length === 3 ? 2 : 3 }">
                        <!-- 内容条数 -->
                        <div v-for="(ite, inx) in voiceData[item.index]" :key="inx" class="lift-content">
                            <!-- 内容 -->
                            <div v-for="(value, staInx) in ite" :key="staInx">{{ value }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 聊天收益政策 -->
        <div class="chat" v-if="chatData.length">
            <p>{{ $t('chat_income_policy') }}</p>
            <p class="info-p">{{ $t('chat_income_policy_tip') }}</p>
            <p class="info-p">{{ $t('chat_income_policy_tip2') }}</p>
            <p class="info-p">{{ $t('chat_income_policy_tip3') }}</p>
            <p class="info-p">{{ $t('chat_income_policy_tip4') }}</p>
            <!-- 表格 -->
            <div class="sheet">
                <!-- 头部标题 -->
                <div class="head">
                    <div v-for="(item, index) in chatList" :key="index">{{ item }}</div>
                </div>
                <!-- 表格内容 -->
                <div class="content" v-for="(item, index) in chatData" :key="index">
                    <div v-for="(ite, inx) in item" :key="inx">{{ ite }}</div>
                </div>
            </div>
        </div>

        <!-- 承接房 -->
        <div v-if="continueData.length" class="continue-room">
            <p>{{ $t('new_user_policy') }}</p>
            <!-- 表格 -->
            <div class="sheet">
                <!-- 头部标题 -->
                <div class="head">
                    <div v-for="(item, index) in continueRoom" :key="index">{{ item }}</div>
                </div>
                <!-- 表格内容 -->
                <div class="content" v-for="(item, index) in continueData" :key="index">
                    <div v-for="(ite, inx) in item" :key="inx">{{ ite }}</div>
                </div>
            </div>
        </div>

        <!-- 防止画面抖动loading -->
        <PageLoading v-if="loading"></PageLoading>
    </div>
</template>

<script setup>
    import Header from "@/components/common/header.vue";
    import { getCurrentInstance, onMounted, ref, set } from "vue";
    import request from "@/lib/request/contribution";
    import PageLoading from "@/components/common/page_loading.vue";

    // loading
    const loading = ref(true);
    // 获取实例
    const root = getCurrentInstance();
    const t = (value) => {
        return root.proxy.$i18n.t(value);
    };
    // 是否会长
    const status = Number(root.proxy.$route.query.is_guild_owner);

    // 语音房表头
    const audioList = ref([t('live_requirements'), t('income_requirements'), t('host_salary'), t('guild_master_rewards')]);
    // 聊天收益表头
    const chatList = ref([t('income_requirements'), t('host_salary'), t('guild_master_rewards')]);
    // 承接表头
    const continueRoom = ref([t('user_count_requirements'), t('first_day_rewards'), t('second_day_rewards'), t('guild_master_rewards')]);


    // 聊天收益数据
    const chatData = ref([]);
    // 承接数据
    const continueData = ref([]);
    // 语音房有几列
    const voiceHead = ref([]);
    // 语音房列对应数据
    const voiceData = ref({});
    // 获取页面数据
    const getData = async () => {
        try {
            const res = await request.getIncomeConfig();
            if (res.status !== 1000) return;
            voiceHead.value = res.data.level_config_groups;
            // 处理数据
            chatData.value = res.data.chat_level_configs ? res.data.chat_level_configs.map(item => [item?.target, (item?.anchor_income_percent * 100).toFixed() + '%', (item?.guild_income_percent * 100).toFixed() + '%']) : [];
            continueData.value = res.data.text_level_configs ? res.data.text_level_configs.map(item => [item?.target, item?.six_income, item?.three_income, (item?.guild_income_percent * 100).toFixed() + '%']) : [];
            // 处理等级匹配梯队
            res.data?.level_config_groups?.forEach((item, index) => {
                res.data?.level_configs?.forEach(level => {
                    if (item.index === level.group_index) {
                        if (Array.isArray(voiceData.value[item.index])) {
                            if (res.data.region_id === 'PHILIPPINES') {
                                voiceData.value[item.index].push([level.target, level.anchor_income, level.guild_income]);
                            } else {
                                voiceData.value[item.index].push([level.target, exchange(level.anchor_income), exchange(level.guild_income)]);
                            }
                        } else {
                            if (res.data.region_id === 'PHILIPPINES') {
                                voiceData.value[item.index] = [[level.target, level.anchor_income, level.guild_income]];
                            } else {
                                voiceData.value[item.index] = [[level.target, exchange(level.anchor_income), exchange(level.guild_income)]];
                            }
                        }
                    }
                });
            });
            console.log(voiceData.value);
            // 判断当前权限进行页面展示处理
            if (!status) {
                setPresident();
            } else {
                loading.value = false;
            }
        } catch (err) {
            console.log(err);
        }
    };

    // 换算美元为金币的计算方法 1美元=4000金币
    const exchange = (value) => {
        return value * 4000;
        // return value
    };

    // 去除数据展示
    const setPresident = () => {
        // 剔除表头
        audioList.value.pop();
        chatList.value.pop();
        continueRoom.value.pop();
        // 剔除表格数据
        chatData.value.forEach((item, index) => {
            item.pop();
        });
        continueData.value.forEach((item, index) => {
            item.pop();
        });
        // 去除语音公会收入
        for (let valueKey in voiceData.value) {
            voiceData.value[valueKey].forEach((item, index) => {
                item.pop();
            });
        }
        loading.value = false;
    };

    onMounted(() => {
        getData();
    });
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    padding: 2.25rem 0 .6rem;

    .audio-room {
        width: 6.9rem;
        margin: 0 auto;

        p {
            font-weight: 500;
            font-size: .26rem;
            color: #333333;
            line-height: .37rem;
        }
        .info-p {
            font-size: 0.22rem;
            color: #999;
            margin-left: 0.2rem;
            margin-top: 0.1rem;
        }

        .sheet {
            width: 6.9rem;
            margin-top: .2rem;
            background: #FFFFFF;
            border-radius: .24rem;
            overflow: hidden;

            .head {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 100%;
                height: 1.2rem;
                background: #EAF5EC;
                border-radius: .24rem .24rem 0 0;
                font-weight: 500;
                font-size: .24rem;
                color: #333333;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    flex: 1;
                    border-right: 0.01rem solid #D6DFE7;
                    text-align: center;
                }

                div:last-of-type {
                    border: none;
                }
            }

            .content {
                display: flex;
                font-weight: 400;
                font-size: .24rem;
                color: #333333;
                border-bottom:  0.01rem solid #EEEEEE;

                .right {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    border-right: 0.01rem solid #EEEEEE;
                }

                .lift {
                    display: flex;
                    flex-direction: column;

                    .lift-content {
                        display: flex;
                        flex: 1;
                        min-height: .72rem;
                        border-bottom: 0.01rem solid #EEEEEE;

                        div {
                            display: flex;
                            flex: 1;
                            justify-content: center;
                            align-items: center;
                            border-right: 0.01rem solid #EEE;
                        }

                        div:last-of-type {
                            border-right: none;
                        }
                    }

                    .lift-content:last-of-type {
                        border-bottom: none;
                    }
                }
            }
            .content:last-of-type {
                border-bottom: none;
            }
        }
    }

    .chat {
        width: 6.9rem;
        margin: .5rem auto 0;

        p {
            font-weight: 500;
            font-size: .26rem;
            color: #333333;
            line-height: .37rem;
        }
        .info-p {
            font-size: 0.22rem;
            color: #999;
            margin-left: 0.2rem;
            margin-top: 0.1rem;
        }

        .sheet {
            width: 6.9rem;
            margin-top: .2rem;
            background: #FFFFFF;
            border-radius: .24rem;
            overflow: hidden;

            .head {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 100%;
                height: 1.2rem;
                background: #EAF5EC;
                border-radius: .24rem .24rem 0 0;
                font-weight: 500;
                font-size: .24rem;
                color: #333333;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    flex: 1;
                    border-right: 0.01rem solid #D6DFE7;
                    text-align: center;
                }

                div:last-of-type {
                    border: none;
                }
            }

            .content {
                display: flex;
                width: 100%;
                height: .73rem;
                font-weight: 400;
                font-size: .24rem;
                color: #333333;
                border-bottom: .01rem solid #EEEEEE;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    border-right: .01rem solid #EEEEEE;
                }

                div:last-of-type {
                    border-right: none;
                }
            }
        }
    }

    .continue-room {
        width: 6.9rem;
        margin: .5rem auto 0;

        p {
            height: .37rem;
            font-weight: 500;
            font-size: .26rem;
            color: #333333;
            line-height: .37rem;
        }

        .sheet {
            width: 6.9rem;
            margin-top: .2rem;
            background: #FFFFFF;
            border-radius: .24rem;
            overflow: hidden;

            .head {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 100%;
                height: 1.2rem;
                background: #EAF5EC;
                border-radius: .24rem .24rem 0 0;
                font-weight: 500;
                font-size: .24rem;
                color: #333333;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    flex: 1;
                    border-right: 0.01rem solid #D6DFE7;
                    text-align: center;
                }

                div:last-of-type {
                    border: none;
                }
            }

            .content {
                display: flex;
                width: 100%;
                height: .73rem;
                font-weight: 400;
                font-size: .24rem;
                color: #333333;
                border-bottom: .01rem solid #EEEEEE;

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    border-right: .01rem solid #EEEEEE;
                }

                div:last-of-type {
                    border-right: none;
                }
            }
        }
    }
}
</style>