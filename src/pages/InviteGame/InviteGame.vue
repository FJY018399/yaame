<template>
	<div :style="{ paddingTop: safeHeight + 0.36 + 'rem' }" class="game">
		<Header>{{ $t('game-title') }}</Header>

		<img class="title-img" :src="titleImgEnum[language]" alt="" />
		<div class="game-container">
			<div
				v-for="(item, index) in rewardList"
				:class="[
					'reward-item',
					'reward-item-' + index,
					current === index && 'active',
				]"
			>
				<img class="reward-img" :src="item.reward_icon" alt="" />
				<div class="reward-value">{{ item.reward_name }}</div>

                <img v-show="current === index" class="reward-bg" src="https://yaame-static.yaame.io/admin/6b7674734cb9481ccd90a3fb9707473b.png" alt="">
			</div>

			<div class="center-info" @click="drawClick">
                <p class="text">{{ $t('game-btn') }}</p>
                <p class="num">
                    <img src="https://yaame-static.yaame.io/admin/4016288da7f70197d2c93728cbb8e81d.png" alt="">
                    {{ can_lottery_times }}
                </p>
            </div>
		</div>

		<div class="task-content">
			<div class="task-header">
				<p class="title">{{ $t("invite-task") }}</p>
				<p class="info">{{ $t("task-desc") }}</p>
				<p class="time">
					{{ $t("refresh-time") }} {{ $t("refresh-time-format", timeInfo) }}
				</p>
			</div>
			<div class="task-list">
				<div v-for="(item, index) in task_items" :key="index" :class="['task-item', item.status === 1 && 'disabled']">
					<p class="task-info">
						{{ item.remind_tip }}
					</p>
					<p class="task-value">
						<!-- <span class="process">{{ $t('invited') }} {{ item.completed_num }}/{{ item.total_num }}</span> -->
						<span class="process">{{ item.completed_num }}/{{ item.total_num }}</span>
						<span class="reward">
                            <img src="https://yaame-static.yaame.io/admin/4016288da7f70197d2c93728cbb8e81d.png" alt="">
                            {{ $t('task-reward', [item.reward_num]) }}</span>
					</p>
					<div v-if="item.status === 0" class="task-btn" @click="handleCopyLink(invite_link + `?language=${language}`)">{{ $t('goto-invite') }}</div>
                    <div v-if="item.status === 1" class="task-btn">{{ $t('completed') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import { getSafeHeight, getLanguage } from "@/lib/device";
import { onMounted, ref, computed } from "vue";
import request from "@/lib/request/draw.js";
import { Toast } from "vant";
import activity from "../../lib/request/activity";
let safeHeight = ref(0);

let current = ref(-1);
let gameStart = ref(false);

let rewardList = ref([]);
let diamond_balance = ref(0);
const getData = async () => {
	try {
		let res = await request.getPolLotteryInfo({
			activity_type: "INVITE",
		});
		if (res.status !== 1000) return;
        if (region_id.value === 'SOUTHEAST_ASIA') {
            rewardList.value = res.data.lottery_strategy_config.invitemy.lottery_rewards;
        } else {
            rewardList.value = res.data.lottery_strategy_config.invite.lottery_rewards;
        }
		
		diamond_balance.value = res.data.diamond_balance;
	} catch (error) {
		throw new Error(error);
	}
};

const drawClick = async () => {
	if (gameStart.value) {
		return;
	}
	gameStart.value = true;
    Toast.loading({
        forbidClick: false,
        duration: 0,
    });

    let timeout = setTimeout(() => {
        Toast.clear();
        Toast.fail('network error');
        gameStart.value = false;
    }, 20000);

	let res = await request.postPolLottery({
		activity_type: "INVITE",
        lottery_times: 1,
        lottery_strategy_type: region_id.value === 'SOUTHEAST_ASIA' ? 'invitemy' : 'invite',
	});

    
	if (res.status === 1000) {
        Toast.clear();
        setTimeout(() => {
            getInviteHomeInfo();
        }, 500);

		let flag = res.data.lottery_rewards[0].reward_flag;
        // 遍历奖品列表，找到中奖的奖品 用for循环
        let targetIndex = -1;

        for (let i = 0; i < rewardList.value.length; i++) {
            if (rewardList.value[i].reward_flag === flag) {
                targetIndex = i;
                break;
            }
        }
        startSpin(targetIndex).then(() => {
        	gameStart.value = false;
            setTimeout(() => {
                current.value = -1;
            }, 4000);
        });

        diamond_balance.value = res.data.diamond_balance;
	} else if (res.status === 1002) {
        Toast.clear();
        Toast.fail(res.desc);
        gameStart.value = false;
    } else {
        gameStart.value = false;
    }
	clearTimeout(timeout);
};
const startSpin = (targetIndex) => {
	return new Promise(async (resolve) => {
		const totalRotations = 2; // 转2圈
		// const spinsPerRotation = this.rewardList.length;
		const spinsPerRotation = 10;
		const totalSpins = totalRotations * spinsPerRotation + targetIndex;
		const spinDuration = 10000; // 总动画时间
		let spinCount = 0;

		const delay = (ms) => new Promise((res) => setTimeout(res, ms));

		const rotate = async () => {
			if (spinCount < totalSpins) {
				current.value = spinCount % spinsPerRotation;
				spinCount++;

				const waitTime =
					(spinDuration / totalSpins) * Math.pow(spinCount / totalSpins, 2); // 使用平方函数增加减速效果

				await delay(waitTime);
				await rotate();
			} else {
				current.value = targetIndex; // 确保最终停留在指定位置
				resolve();
			}
		};

		await rotate();
	});
};
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
const titleImgEnum = {
	"zh-cn":
		"https://yaame-static.yaame.io/admin/4e8e15d10d73b12e516e8fdc7982d5f5.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/81e0d2b135a14f43d646bd4d1db8196d.png",
	en: "https://yaame-static.yaame.io/admin/23681cb807e5785bfb4679d8ab005eb5.png",
	id: "https://yaame-static.yaame.io/admin/d87a1d1bd178ce1596596e6190929c53.png",
	ar: "https://yaame-static.yaame.io/admin/dc447349f71541fadc12d5bdf39cad7c.png",
};

let task_items = ref([]);
const getTaskList = async () => {
    try {
        let res = await request.getPolLotteryTaskList({
            activity_type: "INVITE",
        });
        if (res.status !== 1000) return;

        task_items.value = res.data.task_items;
    } catch (error) {
        throw new Error(error);
    }
};
let timeInfo = ref([0, 0, 0, 0]);
// 输出utc时间 到本周结束的倒计时
function getUTCEndOfMonthCountdown() {
    // 当前 UTC 时间
    const now = new Date();

    // 创建当前时间对应的 UTC 时间对象
    const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    // 获取当前月的下一个月的第一天，然后减去一天，即得到当前月的最后一天
    const endOfMonthUTC = new Date(Date.UTC(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth() + 1, 0, 23, 59, 59));

    // 将结束时间转换为时间戳，并减去当前时间的时间戳，得到剩余毫秒数
    const msUntilEndOfMonth = endOfMonthUTC.getTime() - nowUTC.getTime();

    // 将剩余毫秒数转换为天数、小时数、分钟数和秒数
    const secondsUntilEndOfMonth = Math.floor(msUntilEndOfMonth / 1000);
    const minutesUntilEndOfMonth = Math.floor(secondsUntilEndOfMonth / 60);
    const hoursUntilEndOfMonth = Math.floor(minutesUntilEndOfMonth / 60);
    const days = Math.floor(hoursUntilEndOfMonth / 24);
    const hours = hoursUntilEndOfMonth % 24;
    const minutes = minutesUntilEndOfMonth % 60;
    const seconds = secondsUntilEndOfMonth % 60;


  timeInfo.value = [days, hours, minutes, seconds];
//   return [days, hours, minutes, seconds]
}

const invite_link = 'https://www.yaame.io/InviteDownload.html';
const handleCopyLink = (textToCopy) => {
    const copyText = {
        "zh-cn": "App下载链接复制成功",
        "zh-tw": "App下載連結複製成功",
        en: "App download link copied successfully",
        ar: "تم نسخ رابط تحميل التطبيق بنجاح",
        id: "Link berhasil di salin",
    };

    var textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // 设定样式以确保它不会影响布局
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        // 尝试执行复制操作
        var successful = document.execCommand('copy');

        // 基于操作成败进行下一步行动
        if (successful) {
        Toast.success(copyText[language.value]); // 假设你有Toast和language.value准备好
        } else {
        // 如果复制失败则可以在这里处理错误的情况
        console.error('Fallback: Copying text command was unsuccessful');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    // 清理已创建的临时元素
    document.body.removeChild(textArea);
}

let can_lottery_times = ref(0);
let region_id = ref(0);
const getInviteHomeInfo = async () => {
    let res = await activity.getInviteHome();
    if (res.status === 1000) {

        can_lottery_times.value = res.data.can_lottery_times || 0;

        region_id.value = res.data.region_id || 0;
    }
};
onMounted(async () => {
	safeHeight.value = (getSafeHeight() * 2) / 100;
    await getInviteHomeInfo();
	await getData();
    await getTaskList();
    
    setInterval(() => {
        getUTCEndOfMonthCountdown();
    }, 1000);
});
</script>

<style scoped lang="less">
.game {
	width: 7.5rem;
	min-height: 100vh;
	background-size: 7.5rem auto;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/11a3271815ff7db75ed45b81e56c9e38.png);
	font-size: 0.24rem;
	color: #fff;
	.title-img {
		width: 3rem;
		height: auto;
		margin-left: 2.25rem;
		margin-bottom: 0.39rem;
	}
	.game-container {
		width: 6.9rem;
		height: 5.63rem;
		margin-left: 0.3rem;
		position: relative;
		.reward-item {
			position: absolute;
			width: 1.62rem;
			height: 1.81rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/c5929769da43f191a32ddf05fc8dbdf7.png);
			&.active {
				background-image: url(https://yaame-static.yaame.io/admin/10c80164db503e53285e5c9d9987c55f.png);
			}
			.reward-value {
				width: 1.62rem;
				position: absolute;
				top: 1.26rem;
				text-align: center;
				font-size: 0.22rem;
				font-weight: normal;
				color: #ffffff;
                z-index: 1;
			}
			.reward-img {
				width: 1rem;
				height: 1rem;
				margin-top: 0.22rem;
				margin-left: 0.31rem;
                position: relative;
                z-index: 1;
			}
            .reward-bg {
                width: 1.2rem;
                height: 1.2rem;
                position: absolute;
                top: 0.3rem;
                left:  0.21rem;
                animation:rotate 4s linear infinite;
            }
			&.reward-item-0 {
				left: 0;
				top: 0;
			}
			&.reward-item-1 {
				left: 1.76rem;
				top: 0;
			}
			&.reward-item-2 {
				left: 3.52rem;
				top: 0;
			}
			&.reward-item-3 {
				right: 0;
				top: 0;
			}
			&.reward-item-4 {
				right: 0;
				top: 1.91rem;
			}
			&.reward-item-5 {
				right: 0;
				bottom: 0;
			}
			&.reward-item-6 {
				left: 3.52rem;
				bottom: 0;
			}
			&.reward-item-7 {
				left: 1.76rem;
				bottom: 0;
			}
			&.reward-item-8 {
				left: 0;
				bottom: 0;
			}
			&.reward-item-9 {
				left: 0;
				top: 1.91rem;
			}
		}
		.center-info {
			width: 3.18rem;
			height: 1.62rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/d78bab49f18ccc01073d55a2cf5a75ba.png);
			position: absolute;
			left: 1.86rem;
			top: 2.01rem;
            padding-top: 0.32rem;
            .text {
                width: 3.18rem;
                font-size: 0.42rem;
                font-weight: normal;
                color: #BB421E;
                font-weight: bolder;
                text-align: center;

            }
            .num {
                width: 3.18rem;
                text-align: center;
                font-size: 0.31rem;
                font-weight: 600;
                color: #BB421E;
                img {
                    width: 0.42rem;
                    height: auto;
                    vertical-align: middle;
                }
            }
		}
	}

	.task-content {
		width: 7.5rem;
		min-height: 50vh;
		background: #ffffff;
		border-radius: 0.3rem 0.3rem 0 0;
		margin-top: 0.26rem;
		.task-header {
			width: 7.5rem;
			min-height: 1.64rem;
			background: linear-gradient(180deg, #fff2d4 0%, #ffffff 100%);
			border-radius: 0.3rem 0.3rem 0 0;
			padding: 0.4rem 0.3rem 0.3rem;
			.title {
				// font-size: 0.3rem;
				// font-weight: 600;
				// color: #000000;
                // height: 0.33rem;
                width: 5rem;
                font-size: 0.28rem;
                color: #000000;
                line-height: 0.4rem;
                font-weight: 700;
                background-image: url("../../assets/img/invite/lingBg.png");
                background-repeat: no-repeat;
                background-size: 26% 100%;
			}
			.info {
				font-size: 0.24rem;
				font-weight: 400;
				color: #6d3116;
                line-height: 1.2;
                margin: 0.08rem 0
			}
			.time {
				font-size: 0.24rem;
				font-weight: 400;
				color: #666666;
			}
		}
		.task-list {
			width: 6.9rem;
			margin-left: 0.3rem;
			.task-item {
				width: 6.9rem;
				min-height: 1.34rem;
				background: #fdf5e4;
				border-radius: 0.24rem;
				padding: 0.3rem;
				margin-bottom: 0.24rem;
				position: relative;
				&.disabled {
					background: #f8f8f8;
					.task-btn {
						background-image: url(https://yaame-static.yaame.io/admin/a1c2e839c034c33fa63ce8a7b7d64291.png);
						color: #999999;
					}
				}
				.task-info {
					width: 4.47rem;
					font-size: 0.26rem;
					font-weight: 600;
					color: #482835;
				}
				.task-value {
					margin-top: 0.06rem;
					.process {
						font-size: 0.2rem;
						font-weight: 400;
						color: #482835;
						margin-right: 0.3rem;
					}
					.reward {
						font-size: 0.24rem;
						font-weight: normal;
						color: #ffa100;
                        img {
                            width: 0.4rem;
                            height: auto;
                            vertical-align: middle;
                        }
					}
				}

				.task-btn {
					width: 1.52rem;
					height: 0.82rem;
					position: absolute;
					right: 0.33rem;
					top: 50%;
					transform: translateY(-50%);
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/d5e3b12d9c76eaa13031d78213fb365c.png);
					text-align: center;
					line-height: 0.82rem;
					font-size: 0.24rem;
					font-weight: 600;
					color: #333333;
				}
			}
		}
	}
}
@keyframes rotate{
    0%{ -webkit-transform: rotate(0deg);}
    50%{ -webkit-transform: rotate(-180deg);}
    100%{ -webkit-transform: rotate(-360deg);}
}
</style>
