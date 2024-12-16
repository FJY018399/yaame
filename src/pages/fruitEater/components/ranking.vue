<template>
	<div>
		<div class="reward-container">
            <div class="diamond-value" v-for="(item, index) in diamond" :key="index">
                <img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">
                {{ item.reward_info }}
            </div>
        </div>
		<div class="rank-container">
            <div class="rank-container-board"></div>
			<img
				class="top-bg"
				src="https://yaame-static.yaame.io/admin/4d2d425a7d2f7775427ab0130adfb8a4.png"
			/>

			<div class="top-container">
				<div
					v-for="(item, index) in topList"
					:class="['top-item', 'top-item-' + index]"
				>
					<div class="avatar">
						<img
							class="avatar-dress"
							v-if="index === 0"
							src="https://yaame-static.yaame.io/admin/b7675e27fe1d5bf4ef3648089db8ed2c.png"
							alt=""
						/>
						<img
							class="avatar-dress"
							v-else-if="index === 1"
							src="https://yaame-static.yaame.io/admin/042068f0050b4caf2780209b95575aa1.png"
							alt=""
						/>
						<img
							class="avatar-dress"
							v-else-if="index === 2"
							src="https://yaame-static.yaame.io/admin/5ca617b2e5841825484ff8fed1ed95a2.png"
							alt=""
						/>

                        <img v-if="item.avatar" class="user-avatar" :src="item.avatar" alt="">
                        <img v-else class="user-avatar" src="https://yaame-static.yaame.io/admin/631c6ecc4a7f164e472fb32fd054c1ef.png" alt="">
					</div>

					<p class="user-name no-wrap">{{ item.nick_name }}</p>
					<p class="user-name no-wrap">ID: {{ item.yaame_id }}</p>
					<p class="user-value no-wrap">
						<img
							src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png"
							alt=""
						/>
						{{ item.score }}
					</p>
				</div>
			</div>
			<div class="list-container">
				<div v-for="(item, index) in list" :key="index" class="list-item">
					<div class="sort">{{ index + 4 }}</div>
					<div class="item-avatar">
						<img v-if="item.avatar" :src="item.avatar" alt="" />
                        <img v-else src="https://yaame-static.yaame.io/admin/631c6ecc4a7f164e472fb32fd054c1ef.png" alt="">
					</div>
					<div class="item-info">
						<p class="no-wrap">{{ item.nick_name }}</p>
						<p>ID: {{ item.yaame_id }}</p>
					</div>
					<div class="item-value">
						<img
							src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png"
							alt=""
						/>
						{{ item.score }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { getRankApi } from '../api';
import { onMounted, ref } from 'vue';

let props = defineProps(['setRankMyList']);
let topList = ref([]);
let list = ref([]);
let diamond = ref([]);
const getDefaultUser = () => {
    return {
        avatar: 'https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png',
        nick_name: '',
        score: '-',
        yaame_id: '-'
    };
};
const getRank = async () => {
    const res = await getRankApi();
    if (res.status === 1000) {
        if (res.data.rank && res.data.rank.length >= 3) {
            topList.value = res.data.rank.slice(0, 3);
            list.value = res.data.rank.slice(3);
        } else {
            topList.value = res.data.rank.map((item) => {
                return {
                    ...getDefaultUser(),
                    ...item,
                };
            });
        
        }
        diamond.value = res.data.rank_rewards;
        diamond.value.splice(4);
        // 底部进度数据
        props.setRankMyList(res.data.my_rank_info);
    }
};

defineExpose({
    getRank
})

onMounted(() => {
    getRank();
});
</script>

<style lang="less" scoped>
.reward-container {
    position: relative;
    display: flex;
	width: 7.12rem;
	height: 4.11rem;
    justify-content: flex-start;
    align-items: flex-end;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(https://yaame-static.yaame.io/admin/0cf5fde8b09dd8e8a3a822be1a5e763a.png);
	margin-left: 0.2rem;
    .diamond-value {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: .8rem;
        margin-bottom: .52rem;
        font-size: .24rem;
        color: #FFFFFF;
        img {
            width: .26rem;
            height: .24rem;
        }
    }
    .diamond-value:nth-child(1) {
        margin-left: .42rem;
    }
}
.rank-container {
    position: relative;
    padding-bottom: .4rem;
	width: 7.13rem;
	min-height: 8.8rem;
	height: auto;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(https://yaame-static.yaame.io/admin/f37f6ae9b749dee0b3fd475273abac72.png);
	margin-left: 0.18rem;
	margin-top: 0.35rem;

	padding-top: 5.23rem;
	position: relative;
    .rank-container-board {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: #2F02B9;
        box-shadow: inset 0 .02rem .04rem 0 rgba(255,255,255,0.7);
        border-radius: .2rem;
        z-index: -1;
    }
	.top-bg {
		width: 6.87rem;
		height: 2.82rem;
		position: absolute;
		left: 0.13rem;
		top: 2.19rem;
	}
	.top-container {
		width: 7.13rem;
		height: 4.4rem;
		position: absolute;
		left: 0;
		top: 0.5rem;
		.top-item {
			width: 2.18rem;
			height: 4rem;
			position: absolute;
			z-index: 1;
			&.top-item-0 {
				left: 2.47rem;
				top: 0;
				.avatar {
					margin-bottom: 0.62rem;
				}
			}
			&.top-item-1 {
				left: 0.15rem;
				top: 0.38rem;
			}
			&.top-item-2 {
				left: 4.78rem;
				top: 0.38rem;
			}
			.avatar {
				width: 2.19rem;
				height: 1.99rem;
				position: relative;
				margin-bottom: 0.67rem;
				.avatar-dress {
					width: 2.19rem;
					height: auto;
				}
				.user-avatar {
					width: 1.28rem;
					height: 1.28rem;
					display: block;
					border-radius: 50%;
					position: absolute;
					left: 0.45rem;
					top: 0.48rem;
				}
			}
			.user-name {
				text-align: center;
				padding: 0 0.1rem;
				width: 2.19rem;
				font-weight: normal;
				font-size: 0.22rem;
				color: #ffffff;
			}
			.user-value {
				text-align: center;
				padding: 0 0.1rem;
				width: 2.19rem;
				font-weight: normal;
				font-size: 0.2rem;
				color: #ffe491;
				img {
					width: 0.26rem;
					height: 0.24rem;
					vertical-align: middle;
				}
			}
		}
	}
	.list-item {
		width: 6.85rem;
		height: 1.41rem;
		margin-left: 0.14rem;
        margin-bottom: .14rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/0a0cb21a02a6dca018ea4dec616b6b26.png);

		display: flex;
		align-items: center;
		.sort {
			width: 1.14rem;
			text-align: center;
			font-weight: 500;
			font-size: 0.3rem;
			color: #ffffff;
		}
		.item-avatar {
			width: 0.99rem;
			height: 0.98rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/77b09d42db53e5ae5cf548ae1b6db639.png);
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 0.92rem;
				height: 0.92rem;
                display: block;
                border-radius: 50%;
			}
		}
		.item-info {
			width: 2.97rem;
			padding: 0.17rem;
			font-weight: 500;
			font-size: 0.24rem;
			color: #ffffff;
		}
		.item-value {
			font-weight: 600;
			font-size: 0.26rem;
			color: #ffe491;
			img {
				width: 0.26rem;
				height: 0.24rem;
				vertical-align: middle;
			}
		}
	}
}
</style>
