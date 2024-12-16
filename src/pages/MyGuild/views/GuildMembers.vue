<template>
    <div
        :style="{ paddingTop: safe_height + 1.08 + 'rem' }"
        class="main"
    >
        <Header
            :keep="true"
            :keepColor="false"
            style="position: fixed"
            >{{ $t('GuildMembers') }}</Header
        >
        <!-- 搜索框 -->
        <div class="search-box">
            <VanSearch
                v-model="yaameId"
                left-icon=" "
                shape="round"
                background="transparent"
                :placeholder="$t('enter_yaame_id')"
            />
            <div
                @click="getData"
                class="search-btn"
            >
                {{ $t('seek') }}
            </div>
        </div>
        <refresh
            ref="wlRefresh"
            @onRefresh="handleRefresh"
        >
            <div
                v-infinite-scroll="loadMore"
                :infinite-scroll-immediate-check="true"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
                class="content"
            >
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    class="item"
                >
                    <img
                        :src="item.avatar"
                        class="avatar"
                        alt=""
                    />
                    <div class="info">
                        <div class="name">{{ item.nick_name }}</div>
                        <div class="time">
                            {{ $t('joinTime') }}
                            {{ formatDate(item.create_time, 'yyyy-MM-dd hh:mm:ss') }}
                        </div>
                    </div>
                    <div
                        v-if="uid !== item.uid && (is_guild_owner === 1 || delete_authority === 1)"
                        class="btn"
                        @click="handelDelete(item)"
                    >
                        {{ $t('Delete') }}
                    </div>
                </div>

                <!-- 缺省图 -->
                <div
                    v-if="list.length === 0"
                    class="lack"
                >
                    <img
                        src="https://yaame-static.yaame.io/admin/a22559969bf26aaf7cb81beaa0f08f85.png"
                        alt=""
                    />
                    {{ $t('streamer_not_found_in_guild') }}
                </div>
            </div>
        </refresh>

        <div
            v-if="is_guild_owner !== 0 || add_authority === 1"
            class="submit-btn"
            @click="submit"
        >
            {{ $t('invite') }}
        </div>
        <!-- <div class="submit-btn" @click="submit">
			{{ is_guild_owner === 0 ? $t('exit') : $t('invite') }}
		</div> -->

        <!-- 退出公会弹窗 -->
        <popup
            v-if="quitVisible"
            class="flex-box"
        >
            <div class="container">
                <p class="container-title">Tips</p>
                <div class="container-content">
                    <!-- Are you sure to quit from this agency? <br />
					No-paid salary can not be settled if you quit from the agency -->
                    {{ $t('exitGuildTip') }} <br />
                    {{ $t('exitGuildTip1') }}
                </div>
                <div class="container-footer">
                    <div @click="handelQuit">{{ $t('confirm') }}</div>
                    <div @click="quitVisible = false">{{ $t('cancel') }}</div>
                </div>
            </div>
        </popup>

        <popup
            v-if="deleteVisible"
            class="flex-box"
        >
            <div class="container">
                <p class="container-title">Tips</p>
                <div class="container-content">
                    {{ $t('removeUserTip1', [selectUser.nick_name]) }}
                    <br />
                    {{ $t('exitGuildTip2') }}
                </div>
                <div class="container-footer">
                    <div @click="deleteConfirm">{{ $t('confirm') }}</div>
                    <div @click="deleteVisible = false">{{ $t('cancel') }}</div>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
import { formatDate } from '../../../lib/utils.js';
import refresh from '../../../components/common/refresh.vue';
import popup from '../../../components/common/pop_up.vue';

import Header from '@/components/common/header.vue';
import { getSafeHeight } from '@/lib/device';
import request from '@/lib/request/withdraw';

import { Toast } from 'vant';
import { getUidForUser } from '../../../lib/device.js';
export default {
    components: {
        Header,
        refresh,
        popup,
    },
    data() {
        return {
            safe_height: 0,
            page: 1,
            list: [],
            has_next: true,
            is_guild_owner: Number(this.$route.query.is_guild_owner),
            add_authority: Number(this.$route.query.add_authority),
            delete_authority: Number(this.$route.query.delete_authority),
            selectUser: {
                uid: null,
                nick_name: '-',
            },
            quitVisible: false,
            deleteVisible: false,
            // 获取当前用户uid
            uid: Number(getUidForUser()),
            // 搜索yaameID
            yaameId: '',
        };
    },
    methods: {
        async getData() {
            try {
                let params = {
                    page: this.page,
                    size: 20,
                    yaame_id: '',
                };
                if (this.yaameId) {
                    params.yaame_id = this.yaameId;
                } else {
                    delete params.yaame_id;
                }
                let res = await request.getGuildsUsersList(params);
                if (res.status === 1000) {
                    if (this.page === 1) {
                        this.list = res.data.content || [];
                    } else {
                        this.list = this.list.concat(res.data.content);
                    }
                    this.has_next = res.data.has_next;
                } else {
                    Toast(res.desc);
                    this.list = [];
                }
            } catch (error) {
                console.log(error);
            }
        },
        handelDelete(item) {
            this.selectUser = item;
            this.deleteVisible = true;
        },
        handleRefresh() {
            this.page = 1;
            this.getData();
            setTimeout(() => {
                this.$refs.wlRefresh.isLoading = false;
            }, 500);
        },
        formatDate,
        /**
         * @description: 下拉加载钩子fun
         */
        loadMore() {
            if (this.has_next) {
                this.page++;
                this.getData();
            }
        },
        submit() {
            this.$router.push('/GuildInvite');
        },
        async handelQuit() {
            try {
                let res = await request.quitGuildsUsers({});
                if (res.status === 1000) {
                    // this.page = 1;
                    // this.getData();
                    this.quitVisible = false;

                    Toast(this.$t('exitSuccess'));
                    setTimeout(() => {
                        location.href = 'wlyaame://main/tab?index=3';
                    }, 3000);
                } else {
                    Toast(res.desc);
                }
            } catch (error) {
                console.log(error);
            }
        },
        async deleteConfirm() {
            try {
                let res = await request.deleteGuildsUsers({
                    delete_uid: this.selectUser.uid,
                });
                if (res.status === 1000) {
                    this.page = 1;
                    this.getData();
                    this.deleteVisible = false;
                    Toast(this.$t('deleteSuccess', [this.selectUser.nick_name]));
                } else {
                    Toast(res.desc);
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        let safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100;

        this.getData();
    },
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
    position: relative;

    .search-box {
        position: relative;
        width: 6.9rem;
        margin: 0 auto 0.3rem;

        .search-btn {
            position: absolute;
            top: 50%;
            right: 0.1rem;
            transform: translateY(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.47rem;
            height: 0.7rem;
            background: linear-gradient(90deg, #63df6d 0%, #4cc9a4 100%);
            font-weight: 600;
            font-size: 0.3rem;
            color: #fff;
            border-radius: 0.48rem;
        }
    }

    .content {
        width: 7.5rem;
        min-height: calc(100vh - 1rem);
        background: #ffffff;
        border-radius: 0.3rem 0.3rem 0px 0px;
        padding-top: 0.4rem;
        padding-bottom: 1.4rem;
        .item {
            width: 7.5rem;
            height: 0.9rem;
            display: flex;
            align-items: center;
            padding-left: 0.4rem;
            padding-right: 0.4rem;
            margin-bottom: 0.5rem;
            .avatar {
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 50%;
            }
            .info {
                width: 4.52rem;
                padding-left: 0.3rem;
                .name {
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #333333;
                }
                .time {
                    font-size: 0.2rem;
                    font-weight: 400;
                    color: #999999;
                }
            }
            .btn {
                width: 1.28rem;
                height: 0.62rem;
                background: #ed5a5a;
                border-radius: 0.31rem;
                text-align: center;
                line-height: 0.62rem;
                font-size: 0.24rem;
                font-weight: 400;
                color: #ffffff;
            }
        }

        .lack {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin-top: 4.77rem;
            font-weight: 400;
            font-size: 0.24rem;
            color: #333333;
            img {
                width: 1.8rem;
                height: 1.8rem;
            }
        }
    }
    .submit-btn {
        width: 5.8rem;
        height: 1rem;
        position: fixed;
        bottom: 0.6rem;
        left: 0.85rem;
        background-image: url(https://yaame-static.yaame.io/admin/67e66f179d463ab8ce5723a7f01b3443.png);
        background-repeat: no-repeat;
        background-size: contain;
        text-align: center;
        line-height: 1rem;
        font-weight: 600;
        color: #ffffff;
        font-size: 0.32rem;
    }
    .flex-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .container {
            width: 5.9rem;
            min-height: 4.38rem;
            border-radius: 0.24rem;
            background-color: #fff;
            background-image: url(https://yaame-static.yaame.io/admin/0edbd9af12b8be6973449c650125c50d.png);
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            padding-top: 0.6rem;
            padding-bottom: 1.6rem;
            .container-footer {
                width: 100%;
                height: 1.48rem;
                position: absolute;
                bottom: 0;
                left: 0;
                padding: 0.2rem 0.4rem 0.4rem;
                display: flex;
                justify-content: space-between;
                div {
                    width: 2.4rem;
                    height: 0.88rem;
                    border-radius: 0.5rem;
                    font-size: 0.3rem;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    text-align: center;
                    line-height: 0.88rem;
                    &:nth-child(1) {
                        background: #ededed;
                        color: #666666;
                    }
                    &:nth-child(2) {
                        background: linear-gradient(135deg, #abf78e 0%, #00e59e 100%);
                        color: #ffffff;
                    }
                }
            }
            .container-title {
                font-size: 0.34rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                padding-left: 0.5rem;
            }
            .container-content {
                min-height: 1.6rem;
                margin-top: 0.2rem;
                padding: 0 0.5rem;
                font-size: 0.26rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
            }
        }
    }

    // 设置搜索框宽度
    :deep(.van-search) {
        position: relative;
        padding: 0;
        width: 6.9rem;
        margin: 0 auto 0.3rem;
    }

    // 设置搜索框内部颜色和高度
    :deep(.van-search__content) {
        height: 0.9rem;
        background-color: #fff;
    }

    // 调整内边距
    :deep(.van-search__content) {
        padding: 0 0 0 0.3rem;
    }

    // 调整搜索框内容高度剧中
    :deep(.van-field__value) {
        display: flex;
        align-items: center;
    }

    // 调整搜索框内容高度
    :deep(.van-field__body) {
        width: 75%;
        height: 80%;
    }
}
</style>
