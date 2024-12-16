<template>
    <div
        :style="{ paddingTop: safe_height + 0.88 + 0.3 + 'rem' }"
        :class="['main', language]"
    >
        <customHeader
            :keep="true"
            :keepColor="false"
            :language="language"
            color="blank"
            back_color="#f4f8fb"
            style="position: fixed"
            >{{ $t('title') }}</customHeader
        >
        <p class="title-p">{{ $t('FamilyProfile') }}</p>

        <p class="content-p">
            {{ $t('content-1') }}
        </p>

        <p
            style="margin-top: 0.6rem"
            class="title-p"
        >
            {{ $t('FamilyLevel') }}
        </p>

        <p
            :style="{ marginBottom: '.2rem' }"
            class="content-p"
        >
            {{ $t('family_level_description_1') }}
        </p>

        <div class="frame">
            <div class="level-table">
                <div class="table-header">
                    <div>{{ $t('level') }}</div>
                    <div>{{ $t('battle_power') }}</div>
                    <div>{{ $t('adminCnt') }}</div>
                    <div>{{ $t('memberCnt') }}</div>
                    <div>{{ $t('levelBadge') }}</div>
                    <div>{{ $t('avatar_frame') }}</div>
                </div>
                <div
                    v-for="item in level_items_list"
                    :key="item.level"
                    class="content"
                >
                    <div>{{ item.level }}</div>
                    <div>{{ item.min_value }}</div>
                    <div>{{ item.admin_cnt }}</div>
                    <div>{{ item.member_cnt }}</div>
                    <div>
                        <img
                            :src="item.level_badge"
                            alt=""
                        />
                    </div>
                    <div>
                        <img
                            v-if="item.avatar_frame_icon"
                            :src="item.avatar_frame_icon"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>

        <p
            style="margin-top: 0.5rem; margin-bottom: 0.2rem"
            class="content-p"
        >
            {{ $t('family_level_description_2') }}
        </p>

        <div
            style="margin-top: 0.2rem"
            class="task-table"
        >
            <div class="table-header">
                <div style="text-align: left">{{ $t('daily_task') }}</div>
                <div style="text-align: right">{{ $t('battle_power') }}</div>
            </div>
            <div
                v-for="(item, index) in point_items_list"
                :key="index"
                class="content"
            >
                <div style="text-align: left">{{ item.task }}</div>
                <div style="text-align: right">
                    <img
                        src="https://yaame-static.yaame.io/admin/61f4abccbb9f356ec2d245dba1c03e0d.png"
                        alt=""
                    />+{{ item.point }}
                </div>
            </div>
        </div>

        <p
            style="margin-top: 0.6rem"
            class="title-p"
        >
            {{ $t('Family_list') }}
        </p>
        <p
            style="margin-top: 0"
            class="content-p"
        >
            {{ $t('family_power_ranking') }}
        </p>
        <p class="content-p">{{ $t('family_list') }}</p>

        <p
            style="margin-top: 0.6rem"
            class="title-p"
        >
            {{ $t('FamilyPrivilege') }}
        </p>
        <p
            style="margin-top: 0.2rem"
            class="content-p"
        >
            {{ $t('family_badge_description') }}
        </p>
        <div
            style="margin-top: 0.2rem"
            class="img-container"
        >
            <div
                :style="{ backgroundColor: family_rule_example_config.bg_color }"
                class="img-info"
            >
                <div class="img-box">
                    <img
                        :src="family_rule_example_config.family_icon"
                        alt=""
                    />
                </div>
                <div class="info-box">{{ family_rule_example_config.desc }}</div>
            </div>
        </div>
        <p
            :style="{ marginTop: '0.2rem', marginBottom: '.2rem' }"
            class="content-p"
            v-if="familyUserLevel?.length"
        >
            {{ $t('family_gift_battle_power', { n: familyOwnerLoginPoint }) }}
        </p>

        <div
            class="frame three"
            v-if="familyUserLevel?.length"
        >
            <div class="level-table">
                <div class="table-header">
                    <div>{{ $t('family_gift_battle_power_2') }}</div>
                    <div>{{ $t('chief_reward') }}</div>
                    <div
                        v-for="i in maxMember"
                        :key="i"
                    >
                        {{ $t('top_reward', { n: i }) }}
                    </div>
                </div>
                <div
                    v-for="(item, index) in familyUserLevel"
                    :key="index"
                    class="content"
                >
                    <div>{{ String(item.combat_power).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</div>
                    <div>{{ String(item.family_owner_reward).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</div>
                    <div
                        v-for="ite in maxMember"
                        :key="ite"
                    >
                        {{ String(item?.rank_rewards[ite - 1]?.reward || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                    </div>
                </div>
            </div>
        </div>

        <p
            style="margin-top: 0.2rem"
            class="content-p"
            v-if="familyUserLevel?.length"
        >
            {{ $t('family_level_rewards') }}
        </p>
        <div
            class="frame two"
            style="margin-top: 0.2rem"
            v-if="familyUserLevel?.length"
        >
            <div class="level-table">
                <div class="table-header">
                    <div>{{ $t('family_level') }}</div>
                    <div>{{ $t('avatar_frame_repeat') }}</div>
                    <div>{{ $t('entry_effect') }}</div>
                </div>
                <div
                    v-for="item in family_level_dress_up_reward_items"
                    :key="item.level"
                    class="content"
                >
                    <div>LV.{{ item.min_level }} - LV.{{ item.max_level }}</div>
                    <div>
                        <img
                            class="icon"
                            :src="item.icon"
                            alt=""
                        />
                    </div>
                    <div :style="{ opacity: item.animation_icon ? 1 : 0.4 }">
                        <img
                            v-if="item.animation_icon"
                            :src="item.animation_icon"
                            alt=""
                        />{{ item.animation_icon ? '' : '——' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import pageLoading from '../../components/common/page_loading.vue';
import customHeader from '../../components/common/header.vue';
import request from '../../lib/request/family.js';
import { getSafeHeight, getLanguage } from '../../lib/device.js';
export default {
    components: {
        customHeader,
        // pageLoading,
    },
    data() {
        return {
            safe_height: 0,
            decorate_configs: [],
            family_level_animation_reward_list: [],
            family_level_avatar_reward_group_list: [],
            level_items_list: [],
            point_items_list: [],
            rank_items_list: [],
            family_level_dress_up_reward_items: [],

            familyUserLevel: [],
            family_rule_example_config: {
                family_icon: '',
                desc: '',
                bg_color: '',
            },
            maxMember: 0,
            familyOwnerLoginPoint: 0,
        };
    },
    mounted() {
        const safe_area = getSafeHeight() || 40;
        this.safe_height = (safe_area * 2) / 100;

        this.getData();
    },
    computed: {
        language() {
            return getLanguage();
        },
    },
    methods: {
        async getData() {
            try {
                let res = await request.getFamilyRule();
                if (res.status !== 1000) return;
                this.decorate_configs = res.data.decorate_configs;
                this.family_level_animation_reward_list = res.data.family_level_animation_reward_list;
                this.family_level_avatar_reward_group_list = res.data.family_level_avatar_reward_group_list;
                this.level_items_list = res.data.level_items_list;
                this.point_items_list = res.data.point_items_list;
                this.rank_items_list = res.data.rank_items_list;
                this.family_rule_example_config = res.data.family_rule_example_config;
                this.family_level_dress_up_reward_items = res.data.family_level_dress_up_reward_items;

                this.familyUserLevel = res.data.family_rule_privileges || [];
                this.familyOwnerLoginPoint = res.data?.family_owner_login_point || 0;
                this.familyUserLevel?.length &&
                    this.familyUserLevel?.map((item) => {
                        const count = item?.rank_rewards?.length || 0;
                        count > this.maxMember && (this.maxMember = count);
                    });
            } catch (e) {
                console.log(e);
            }
        },
    },
};
</script>
<style scoped lang="less">
.main {
    width: 7.5rem;
    background: #f4f8fb;
    padding: 0 0.3rem 0.3rem 0.3rem;
    &.ar {
        text-align: right !important;
    }
    .title-p {
        font-size: 0.3rem;
        font-weight: 600;
        color: #999999;
    }
    .content-p {
        margin-top: 0.2rem;
        width: 6.9rem;
        font-size: 0.26rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
    }
    .frame {
        width: 6.9rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        padding: 0.4rem 0.1rem;
        overflow-x: auto;
        .level-table {
            width: 7.56rem;
            min-height: 1rem;
            .table-header {
                display: flex;
                justify-content: space-between;
                font-size: 0.24rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                div {
                    flex: 1;
                    text-align: center;
                }
            }
            .content {
                display: flex;
                justify-content: space-between;
                font-size: 0.24rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                margin-top: 0.4rem;
                div {
                    flex: 1;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        width: 0.48rem;
                        height: 0.48rem;
                    }
                }
            }
        }
    }
    .two {
        padding: 0.4rem 0 0.4rem;
        overflow: hidden;
        .level-table {
            width: 6.9rem;
            .table-header {
                div:nth-child(3) {
                    flex: 2;
                }
            }
            .content {
                div:nth-child(3) {
                    flex: 2;
                }
                img {
                    width: 2.25rem !important;
                }
                .icon {
                    width: 0.48rem !important;
                }
            }
        }
    }
    .three {
        .level-table {
            width: 9rem;
        }
    }

    .task-table {
        width: 6.9rem;
        min-height: 1rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        padding: 0.4rem 0.2rem 0.4rem 0.4rem;
        .table-header {
            display: flex;
            justify-content: space-between;
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
            text-align: center;
            div {
                flex: 1;
                &:nth-child(1) {
                    text-align: center;
                }
                &:nth-child(2) {
                    text-align: center;
                }
            }
        }
        .content {
            display: flex;
            justify-content: space-between;
            font-size: 0.24rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333;
            margin-top: 0.4rem;
            div {
                &:nth-child(1) {
                    flex: 1;
                    text-align: center;
                }
                &:nth-child(2) {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    min-width: 0.8rem;
                }
                img {
                    width: 0.28rem;
                    height: 0.28rem;
                    margin-right: 0.08rem;
                }
            }
        }
    }
    .rank-title {
        width: 6.9rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: center;
        margin: 0.5rem 0;
    }
    .rank-table {
        width: 6.9rem;
        min-height: 1rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        padding: 0.4rem;
        .table-header {
            display: flex;
            justify-content: space-between;
            font-size: 0.24rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            div {
                &:nth-child(1) {
                    width: 1rem;
                    text-align: left;
                }
                &:nth-child(2) {
                    text-align: center;
                    flex: 1;
                }
                &:nth-child(3) {
                    width: 2rem;
                    text-align: right;
                }
            }
        }
        .content {
            display: flex;
            justify-content: space-between;
            font-size: 0.24rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333;
            margin-top: 0.4rem;
            div {
                &:nth-child(1) {
                    width: 1rem;
                    text-align: left;
                }
                &:nth-child(2) {
                    text-align: center;
                    flex: 1;
                }
                &:nth-child(3) {
                    width: 2rem;
                    text-align: right;
                }
            }
        }
    }
    .img-container {
        width: 6.9rem;
        height: 1.92rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            display: block;
            width: 2.9rem;
            height: 0.92rem;
            border-radius: 0.24rem;
        }
        .img-info {
            width: 2.7rem;
            height: 0.92rem;
            display: flex;
            padding: 0.04rem;
            justify-content: space-between;
            align-items: center;
            border-radius: 0.24rem;
            .img-box {
                width: 1.1rem;
                height: 0.84rem;
                border-radius: 0.2rem;
                display: flex;
                justify-content: center;
                align-items: center;

                background: #f1f4f7;
                img {
                    width: 0.7rem;
                    height: 0.7rem;
                }
            }
            .info-box {
                flex: 1;
                padding-left: 0.2rem;
                line-height: 0.92rem;
                font-size: 0.3rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                text-align: center !important;
            }
        }
    }
    .dress-table {
        width: 6.9rem;
        min-height: 1rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        padding: 0.3rem 0.18rem;
        padding-bottom: 0;
        font-size: 0.26rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        div {
            width: 2rem;
            height: 2.73rem;
            .img-container {
                width: 2rem;
                height: 2rem;
                border-radius: 0.24rem;
                border: 0.02rem solid #d9d9d9;
                display: flex;
                justify-content: center;
                align-items: center;

                background: #dee5eb;
                img {
                    display: block;
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }
            .name {
                text-align: center;
                margin-top: 0.1rem;
            }
        }
    }
    .long-table {
        width: 6.9rem;
        min-height: 1rem;
        border-radius: 0.24rem;
        border: 0.02rem solid #d9d9d9;
        padding: 0.3rem;
        padding-bottom: 0;
        font-size: 0.26rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        div {
            .img-container {
                width: 6.3rem;
                height: 2rem;
                background: #dee5eb;
                border-radius: 0.24rem;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    display: block;
                    width: 5.9rem;
                    height: auto;
                }
            }
            .name {
                text-align: center;
                margin-bottom: 0.34rem;
                margin-top: 0.1rem;
            }
        }
    }
}
</style>
