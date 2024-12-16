<template>
	<div
        :class="[language]"
		:style="{
			paddingTop: safe_height + 1.08 + 'rem',
			minHeight: '100vh',
			paddingBottom: '0.1rem',
		}"
	>
		<!-- 标题 -->
		<Header
			style="position: fixed"
			:keep="true"
			:keepColor="false"
			color="blank"
			>{{ $t("GuildIncome") }}
		</Header>
		<!-- tab -->
		<div class="tab">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="[active === item.key && 'active']"
				@click="activeClick(item.key)"
			>
				{{ item.name }}
			</div>
		</div>
		<!-- 日期切换 -->
		<!-- 日份 -->
		<div v-if="active === 'DailyIncome'" class="select-time">
			<img
				src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png"
				@click="handlePrev"
			/>
			<div class="time-text" @click="openPicker">{{ currentDayText }}</div>
			<img
				src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png"
				@click="handleNext"
			/>
		</div>
		<!-- 月份 -->
		<div v-else class="select-time">
			<img
				src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png"
				@click="handleMouthPrev"
			/>
			<div class="time-text">
				{{ setMouth() }}
			</div>
			<img
				src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png"
				@click="handleMouthNext"
			/>
		</div>

		<p class="info-p">{{ $t("dataRefresh") }}</p>
		<p class="info-p">{{ $t("dataRefreshTip") }}</p>
		<p v-if="isTodayFlag" class="info-p" style="margin-bottom: 0.4rem">
			{{ $t("dataRefreshTip2", [timeText]) }}
		</p>

		<div class="list-tab">
			<div v-for="(item, index) in listTab" :key="index">
				<div
					:class="[activeTab === item.key && 'active']"
					@click="activeTab = item.key"
				>
					{{ item.name }}
				</div>
			</div>
		</div>

		<template v-if="activeTab === 'roomIncome'">
			<div v-if="active === 'DailyIncome'" class="info-container">
				<span>{{ $t("income_coins") }}</span>
				<span>{{ dayInfo.anchor_diamonds || 0 }}</span>
			</div>
            
			<div v-else>
				<div class="info-container">
					<span class="flex-span"
						>{{ $t("income_coins") }}
						<img
                            v-if="mouthInfo.level && isEmptyObject(mouthInfo.level) === false"
							src="https://yaame-static.yaame.io/admin/a0c4eab5e7c741f295f7194f1442b17f.png"
							alt=""
							@click="openInfo"
						/>
					</span>
					<span>{{ mouthInfo.anchor_diamonds || 0 }}</span>
				</div>
				<div v-show="mouthInfo.anchor_income" class="info-container">
					<span>{{ $t("anchorUSD") }}</span>
					<span>{{ mouthInfo.anchor_income || 0 }}</span>
				</div>
				<div v-show="mouthInfo.guild_income" class="info-container">
					<span>{{ $t("guildUSD") }}</span>
					<span>{{ mouthInfo.guild_income || 0 }}</span>
				</div>
			</div>
			<div class="search">
				<input
					:value="yaameId"
					placeholder="Yaame ID"
					@input="handleInput($event)"
				/>
				<div class="btn" @click="handleSeek">{{ $t("seek") }}</div>
			</div>
			<div v-if="active === 'DailyIncome' && dayList.length" class="table">
				<table class="table-header">
					<thead>
						<tr>
							<th>{{ $t("userId") }}</th>
							<th>{{ $t("userNickname") }}</th>
							<th
								:class="[roomDaySort.anchor_diamonds !== -1 && 'active']"
								@click="sortClick('roomDaySort', 'anchor_diamonds')"
							>
								{{ $t("income_coins") }}

								<img
									v-show="roomDaySort.anchor_diamonds === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomDaySort.anchor_diamonds === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomDaySort.anchor_diamonds === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

							<th
								:class="[roomDaySort.mike !== -1 && 'active']"
								@click="sortClick('roomDaySort', 'mike')"
							>
								{{ $t("liveDuration") }}

								<img
									v-show="roomDaySort.mike === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomDaySort.mike === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomDaySort.mike === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in daySortList" :key="index">
							<td>{{ item.yaame_id }}</td>
							<td>{{ item.nick_name }}</td>
							<td>{{ item.anchor_diamonds }}</td>
							<td>{{ item.mike }}min</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div
				v-else-if="active === 'MonthlyIncome' && monthList.length"
				class="table"
			>
				<table class="table-header table-header-month">
					<thead>
						<tr>
							<th>{{ $t("userId") }}</th>
							<th>{{ $t("userNickname") }}</th>
							<th
								:class="[roomMouthSort.anchor_diamonds !== -1 && 'active']"
								@click="sortClick('roomMouthSort', 'anchor_diamonds')"
							>
								{{ $t("income_coins") }}

								<img
									v-show="roomMouthSort.anchor_diamonds === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.anchor_diamonds === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.anchor_diamonds === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

							<th
								:class="[roomMouthSort.mike !== -1 && 'active']"
								@click="sortClick('roomMouthSort', 'mike')"
							>
								{{ $t("liveDuration") }}

								<img
									v-show="roomMouthSort.mike === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.mike === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.mike === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[roomMouthSort.live_day !== -1 && 'active']"
								@click="sortClick('roomMouthSort', 'live_day')"
							>
								{{ $t("liveDays") }}
								<img
									v-show="roomMouthSort.live_day === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.live_day === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.live_day === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[roomMouthSort.anchor_income !== -1 && 'active']"
								@click="sortClick('roomMouthSort', 'anchor_income')"
							>
								{{ $t("anchorUSD") }}
								<img
									v-show="roomMouthSort.anchor_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.anchor_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.anchor_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[roomMouthSort.guild_income !== -1 && 'active']"
								@click="sortClick('roomMouthSort', 'guild_income')"
							>
								{{ $t("guildUSD") }}
								<img
									v-show="roomMouthSort.guild_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.guild_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="roomMouthSort.guild_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in monthSortList" :key="index">
							<td>{{ item.yaame_id }}</td>
							<td>{{ item.nick_name }}</td>
							<td>{{ item.anchor_diamonds }}</td>
							<td>{{ item.mike }}min</td>
							<td>{{ item.live_day }}days</td>
							<td v-show="isNumber(item.anchor_income)">
								{{ item.anchor_income }}
							</td>
							<td v-show="isNumber(item.guild_income)">
								{{ item.guild_income }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>

		<template v-else-if="activeTab === 'textIncome'">
			<div v-if="active === 'DailyIncome'" class="text-list">
				<div class="text-list-item">
					<div class="text-list-item-content">
						<span>{{ $t("getUSD") }}</span>
						<span>{{ dayInfo.text_income.guild_income }}USD</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("sixRoundEffectiveNumber") }}</span>
						<span class="right-item">{{
							dayInfo.text_income?.six_cycle_num
						}}</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("threeRoundEffectiveNumber") }}</span>
						<span class="right-item">{{
							dayInfo.text_income.three_cycle_num
						}}</span>
					</div>
				</div>
			</div>
			<div v-else class="text-list">
				<div class="text-list-item">
					<div class="text-list-item-content">
						<span>{{ $t("getUSD") }}</span>
						<span>{{ mouthInfo.text_income.guild_income }}USD</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("sixRoundEffectiveNumber") }}</span>
						<span class="right-item">{{
							mouthInfo.text_income?.six_cycle_num
						}}</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("threeRoundEffectiveNumber") }}</span>
						<span class="right-item">{{
							mouthInfo.text_income.three_cycle_num
						}}</span>
					</div>
				</div>
			</div>
			<div style="margin-top: 0" class="search">
				<input
					:value="yaameId"
					placeholder="Yaame ID"
					@input="handleInput($event)"
				/>
				<div class="btn" @click="handleSeek">{{ $t("seek") }}</div>
			</div>
			<div v-if="active === 'DailyIncome' && dayList.length" class="table">
				<table class="table-header">
					<thead>
						<tr>
							<th></th>

                            <th
								:class="[textDaySort.count_num !== -1 && 'active']"
								@click="sortClick('textDaySort', 'count_num')"
							>
								{{ $t("matchNumber") }}

								<img
									v-show="textDaySort.count_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.count_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.count_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textDaySort.six_cycle_num !== -1 && 'active']"
								@click="sortClick('textDaySort', 'six_cycle_num')"
							>
								{{ $t("roundNumber6") }}

								<img
									v-show="textDaySort.six_cycle_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.six_cycle_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.six_cycle_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textDaySort.six_cycle_income !== -1 && 'active']"
								@click="sortClick('textDaySort', 'six_cycle_income')"
							>
								{{ $t("commissionUSD") }}

								<img
									v-show="textDaySort.six_cycle_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.six_cycle_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.six_cycle_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

                            <th
								:class="[textDaySort.three_cycle_num !== -1 && 'active']"
								@click="sortClick('textDaySort', 'three_cycle_num')"
							>
								{{ $t("roundNumber3") }}

								<img
									v-show="textDaySort.three_cycle_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.three_cycle_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.three_cycle_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>



							<th
								:class="[textDaySort.three_cycle_income !== -1 && 'active']"
								@click="sortClick('textDaySort', 'three_cycle_income')"
							>
								{{ $t("commissionUSD") }}

								<img
									v-show="textDaySort.three_cycle_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.three_cycle_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.three_cycle_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textDaySort.income !== -1 && 'active']"
								@click="sortClick('textDaySort', 'income')"
							>
								{{ $t("totalCommissionUSD") }}

								<img
									v-show="textDaySort.income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textDaySort.guild_income !== -1 && 'active']"
								@click="sortClick('textDaySort', 'guild_income')"
							>
								{{ $t("guildCommissionUSD") }}

								<img
									v-show="textDaySort.guild_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.guild_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textDaySort.guild_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in daySortList" :key="index">
							<td style="min-width: 2.3rem">
								<div class="user-info">
									<img :src="item.avatar" alt="" />
									<span class="no-wrap">{{ item.nick_name }}</span>
								</div>
							</td>
							<td>{{ item.text_income?.count_num }}</td>
							<td>{{ item.text_income?.six_cycle_num }}</td>
							<td>{{ item.text_income?.six_cycle_income }}</td>
							<td>{{ item.text_income?.three_cycle_num }}</td>
							<td>{{ item.text_income?.three_cycle_income }}</td>
							<td>{{ item.text_income?.income }}</td>
							<td>{{ item.text_income?.guild_income }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div
				v-else-if="active === 'MonthlyIncome' && monthList.length"
				class="table"
			>
				<table class="table-header table-header-month">
					<thead>
						<tr>
							<th></th>

                            <th
								:class="[textMouthSort.count_num !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'count_num')"
							>
								{{ $t("matchNumber") }}

								<img
									v-show="textMouthSort.count_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.count_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.count_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textMouthSort.six_cycle_num !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'six_cycle_num')"
							>
								{{ $t("roundNumber6") }}

								<img
									v-show="textMouthSort.six_cycle_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.six_cycle_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.six_cycle_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textMouthSort.six_cycle_income !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'six_cycle_income')"
							>
								{{ $t("commissionUSD") }}

								<img
									v-show="textMouthSort.six_cycle_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.six_cycle_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.six_cycle_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

                            <th
								:class="[textMouthSort.three_cycle_num !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'three_cycle_num')"
							>
								{{ $t("roundNumber3") }}

								<img
									v-show="textMouthSort.three_cycle_num === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.three_cycle_num === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.three_cycle_num === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>



							<th
								:class="[textMouthSort.three_cycle_income !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'three_cycle_income')"
							>
								{{ $t("commissionUSD") }}

								<img
									v-show="textMouthSort.three_cycle_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.three_cycle_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.three_cycle_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textMouthSort.income !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'income')"
							>
								{{ $t("totalCommissionUSD") }}

								<img
									v-show="textMouthSort.income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
                            <th
								:class="[textMouthSort.guild_income !== -1 && 'active']"
								@click="sortClick('textMouthSort', 'guild_income')"
							>
								{{ $t("guildCommissionUSD") }}

								<img
									v-show="textMouthSort.guild_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.guild_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="textMouthSort.guild_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in monthSortList" :key="index">
							<td style="min-width: 2.3rem">
								<div class="user-info">
									<img :src="item.avatar" alt="" />
									<span class="no-wrap">{{ item.nick_name }}</span>
								</div>
							</td>
							<td>{{ item.text_income?.count_num }}</td>
							<td>{{ item.text_income?.six_cycle_num }}</td>
							<td>{{ item.text_income?.six_cycle_income }}</td>
							<td>{{ item.text_income?.three_cycle_num }}</td>
							<td>{{ item.text_income?.three_cycle_income }}</td>
							<td>{{ item.text_income?.income }}</td>
							<td>{{ item.text_income?.guild_income }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
        
		<template v-else-if="activeTab === 'chatIncome'">
			<div v-if="active === 'DailyIncome'" class="text-list">
				<div class="text-list-item">
					<div class="text-list-item-content">
						<span>{{ $t("anchorGoldSummary") }}</span>
						<span
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ dayInfo.chat_income.income }}</span
						>
					</div>

					<div class="text-list-item-info">
						<span class="left-item">{{ $t("textChatGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ dayInfo.chat_income?.soul_match_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("voiceChatGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ dayInfo.chat_income?.audio_chat_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("chatGiftGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ dayInfo.chat_income.gift_income }}</span
						>
					</div>
				</div>
			</div>
			<div v-else class="text-list">
				<div class="text-list-item">
					<div class="text-list-item-content-two">
						<p>
							<span>{{ $t("anchorGoldSummary") }}</span>
							<span
								><img
									src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
									alt=""
								/>{{ mouthInfo.chat_income.income }}</span
							>
						</p>

						<p>
							<span>{{ $t("guildLeaderGold") }}</span>
							<span
								><img
									src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
									alt=""
								/>{{ mouthInfo.chat_income.guild_reward_income }}</span
							>
						</p>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("textChatGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ mouthInfo.chat_income?.soul_match_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("voiceChatGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ mouthInfo.chat_income?.audio_chat_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("chatGiftGoldIncome") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ mouthInfo.chat_income.gift_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t("rewardGold") }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ mouthInfo.chat_income.reward_income }}</span
						>
					</div>
				</div>
			</div>
			<div style="margin-top: 0" class="search">
				<input
					:value="yaameId"
					placeholder="Yaame ID"
					@input="handleInput($event)"
				/>
				<div class="btn" @click="handleSeek">{{ $t("seek") }}</div>
			</div>
			<div v-if="active === 'DailyIncome' && dayList.length" class="table">
				<table class="table-header">
					<thead>
						<tr>
							<th>Yamme ID</th>
							<th>{{ $t("UserNickname") }}</th>
							<th
								:class="[chatDaySort.soul_match_income !== -1 && 'active']"
								@click="sortClick('chatDaySort', 'soul_match_income')"
							>
								{{ $t("textChatGoldIncome") }}
								<img
									v-show="chatDaySort.soul_match_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.soul_match_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.soul_match_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[chatDaySort.audio_chat_income !== -1 && 'active']"
								@click="sortClick('chatDaySort', 'audio_chat_income')"
							>
								{{ $t("voiceChatGoldIncome") }}
								<img
									v-show="chatDaySort.audio_chat_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.audio_chat_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.audio_chat_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[chatDaySort.gift_income !== -1 && 'active']"
								@click="sortClick('chatDaySort', 'gift_income')"
							>
								{{ $t("chatGiftGoldIncome") }}
								<img
									v-show="chatDaySort.gift_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.gift_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatDaySort.gift_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in daySortList" :key="index">
							<td>{{ item.yaame_id }}</td>
							<td>{{ item.nick_name }}</td>
							<td>{{ item.chat_income?.soul_match_income }}</td>
							<td>{{ item.chat_income?.audio_chat_income }}</td>
							<td>{{ item.chat_income?.gift_income }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div
				v-else-if="active === 'MonthlyIncome' && monthList.length"
				class="table"
			>
				<table class="table-header table-header-month">
					<thead>
						<tr>
							<th>Yamme ID</th>
							<th>{{ $t("UserNickname") }}</th>
							<th
								:class="[chatMouthSort.soul_match_income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'soul_match_income')"
							>
								{{ $t("textChatGoldIncome") }}
								<img
									v-show="chatMouthSort.soul_match_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.soul_match_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.soul_match_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[chatMouthSort.audio_chat_income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'audio_chat_income')"
							>
								{{ $t("voiceChatGoldIncome") }}
								<img
									v-show="chatMouthSort.audio_chat_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.audio_chat_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.audio_chat_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[chatMouthSort.gift_income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'gift_income')"
							>
								{{ $t("chatGiftGoldIncome") }}
								<img
									v-show="chatMouthSort.gift_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.gift_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.gift_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

							<th
								:class="[chatMouthSort.reward_income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'reward_income')"
							>
								{{ $t("rewardGold") }}
								<img
									v-show="chatMouthSort.reward_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.reward_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.reward_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
							<th
								:class="[chatMouthSort.income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'income')"
							>
								{{ $t("anchorGoldSummary") }}
								<img
									v-show="chatMouthSort.income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>

							<th
								:class="[chatMouthSort.guild_reward_income !== -1 && 'active']"
								@click="sortClick('chatMouthSort', 'guild_reward_income')"
							>
								{{ $t("guildLeaderGold") }}
								<img
									v-show="chatMouthSort.guild_reward_income === -1"
									src="https://yaame-static.yaame.io/admin/999d5b2be8eea8e4c541d9400658fc4b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.guild_reward_income === 0"
									src="https://yaame-static.yaame.io/admin/99617af15565b377d467e9069ea8e83b.png"
									alt=""
								/>
								<img
									v-show="chatMouthSort.guild_reward_income === 1"
									src="https://yaame-static.yaame.io/admin/b38fca55e35ece4e051cea5e91c34227.png"
									alt=""
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in monthSortList" :key="index">
							<td>{{ item.yaame_id }}</td>
							<td>{{ item.nick_name }}</td>
							<td>{{ item.chat_income?.soul_match_income }}</td>
							<td>{{ item.chat_income?.audio_chat_income }}</td>
							<td>{{ item.chat_income?.gift_income }}</td>
							<td>{{ item.chat_income?.reward_income }}</td>
							<td>{{ item.chat_income?.income }}</td>
							<td>{{ item.chat_income?.guild_reward_income }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>

		<!-- 没有数据时显示 -->
		<div v-show="listShow" class="no-data">
			<img
				src="https://static.yaame.io/admin/353cbb29343578377f92f2d13c2e4638.png"
				alt=""
			/>
			<p>{{ $t("noAnchor") }}</p>
		</div>
		<!-- 控制选择日期 -->
		<van-popup v-model="dayToggle" position="bottom">
			<!-- 日选择器 -->
			<van-datetime-picker
				v-model="dayPickerTime"
				:formatter="formatter"
				:max-date="maxDate"
				confirm-button-text="Confirm"
				cancel-button-text="Cancel"
				type="date"
				@cancel="dayToggle = false"
				@confirm="dayConfirm"
			>
			</van-datetime-picker>
		</van-popup>

		<popup v-if="infoVisible" class="flex-container">
			<div class="level-container">
				<div class="info-title">{{ $t('levelReward') }}</div>
				<div class="info-content">
					<div
						v-for="(item, key, index) in mouthInfo.level"
						:key="index"
						class="info-p"
					>
						<span>{{ $t("income_above", { 0: key }) }}</span>
						<span>{{ $t("people_count", { 0: item }) }}</span>
					</div>
				</div>
				<div class="confirm-btn" @click="infoVisible = false">{{ $t('gotIt') }}</div>
			</div>
		</popup>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	computed,
	reactive,
	getCurrentInstance,
	watch,
	nextTick,
	onBeforeUnmount,
} from "vue";
import { Toast } from "vant";
import Header from "@/components/common/header.vue";
import { getSafeHeight, getLanguage } from "@/lib/device";
import request from "@/lib/request/contribution";
import popup from "../../../components/common/pop_up";


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

// 获取UTC时间方法
const getUTC = () => {
	let now = new Date();
	return new Date(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds()
	);
};

// 获取对于本地时间的10.1日时间戳
const getUTCOne = () => {
	return new Date(2024, 9, 1, 0, 0, 0);
};

// 获取UTC时间戳
const getUTCTime = () => {
	return new Date(Date.UTC(2024, 9, 1, 0, 0, 0));
};

// 获取菲律宾时间戳
const getPHILIPPINESTime = () => {
  return new Date(Date.UTC(2024, 10, 11, 0, 0, 0));
}
// 获取相对本地时间11.10时间
const getPHILIPPINESTwo = () => {
  return new Date(Date.UTC(2024, 10, 10, 0, 0, 0));
}

// 页面国际化
const root = getCurrentInstance();
const t = (val) => {
	return root.proxy.$i18n.t(val);
};
// 判断当前国家 和 时间是否超过24年10月1日
const regionIdStatus = ref(true);

if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
    // 菲律宾只能查看11.10号之前的数据
    regionIdStatus.value = new Date().getTime() < getPHILIPPINESTime().getTime();
} else {
    // 其他国家只能查看10.1号之前的数据
    regionIdStatus.value = new Date().getTime() < getUTCTime().getTime();
}

// 页面数据没有展示
let listShow = computed(() => {
	if (active.value === "DailyIncome") {
		return dayList.value.length === 0;
	} else {
		return monthList.value.length === 0;
	}
});
// tab切换
let active = ref("DailyIncome");
// 加载效果
let loading = ref(false);

// 日期 regionIdStatus.value ? getUTCOne() : getUTC()
let currentDayDate = ref(regionIdStatus.value ? getUTCOne() : getUTC());
if (regionIdStatus.value) {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        currentDayDate.value = getPHILIPPINESTime();
    } else {
        currentDayDate.value = getUTCOne();
    }
} else {
    currentDayDate.value = getUTC();
}

// regionIdStatus.value ? getUTCOne() : getUTC()
const currentMouthDate = ref(regionIdStatus.value ? getUTCOne() : getUTC());
if (regionIdStatus.value) {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        currentMouthDate.value = getPHILIPPINESTime();
    } else {
        currentMouthDate.value = getUTCOne();
    }
} else {
    currentMouthDate.value = getUTC();
}


currentDayDate.value.setDate(currentDayDate.value.getDate());
let dayPickerTime = ref(getUTC());
dayPickerTime.value.setDate(dayPickerTime.value.getDate());
// 控制显示两个表格
const tabList = ref([
	{
		name: t("Days"),
		key: "DailyIncome",
	},
	{
		name: t("week"),
		key: "MonthlyIncome",
	},
]);
const mouthToggle = ref(false);

let yaameId = ref("");
// 月份
const monthMap = reactive({
	"01": "January",
	"02": "February",
	"03": "March",
	"04": "April",
	"05": "May",
	"06": "June",
	"07": "Jun",
	"08": "August",
	"09": "September",
	10: "October",
	11: "November",
	12: "December",
});
// 日期获取页码
let page = ref(1);

// 防止多次点击
let status = "DailyIncome";
// tab切换获取那天数据
const activeClick = (key) => {
	active.value = key;
	page.value = 1;
	if (key === "DailyIncome" && status !== "DailyIncome") {
		status = key;
		// 获取日数据
		getDay();
	}
	if (key === "MonthlyIncome" && status !== "MonthlyIncome") {
		status = key;
		getMonth();
	}
};
// 选择时间
// 打开选择时间弹窗
const openPicker = () => {
	dayToggle.value = true;
};
let dayToggle = ref(false);
// 日选择
const dayConfirm = (value) => {
	page.value = 1;
	currentDayDate.value = value;
	dayToggle.value = false;
	getDay();
};

// 绑定选择月份
const formatter = (type, val) => {
	if (type === "month") {
		return monthMap[val];
	}
	return val;
};
// 最大日期
let maxDate = ref(new Date(getUTC().getTime() + 86400000));
maxDate.value.setDate(maxDate.value.getDate() - 1);
// 当前时间
const currentDayText = computed(() => {
	let year = currentDayDate.value.getFullYear();
	let month = (currentDayDate.value.getMonth() + 1).toString().padStart(2, "0");
	let day = currentDayDate.value.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
});
// 判断日是否到了最后一天
const handleNext = () => {
	const currentDate = new Date(currentDayDate.value);
	const tomorrow = new Date(getUTC().getTime() + 86400000);
	tomorrow.setHours(0, 0, 0, 0); // Set current time to the beginning of the day

	const yesterday = new Date(tomorrow);
	yesterday.setDate(yesterday.getDate() - 1);

	// 判断是不是已经是今天
	if (currentDate.getTime() < tomorrow.getTime()) {
		currentDayDate.value = new Date(currentDate.getTime() + 86400000);
		if (currentDate.getTime() >= yesterday.getTime()) {
			currentDayDate.value = yesterday;
			Toast(t("latest_day"));
			return;
		}
	} else {
		Toast(t("latest_day"));
		return;
	}
	dayList.value = [];
	page.value = 1;
	getDay();
};
// 每日数据
let dayList = ref([]);
let dayInfo = ref({
	anchor_diamonds: 0, // 主播收益（钻石）
	anchor_income: 0, // 主播收益（美元）
	extra_income: 0, // 工会额外等级收益（USD）
	guild_income: 0, // 工会收益（USD）
	level: {}, // 收入达到几级以上人数
	type: "NORMAL", // 数据类型
	chat_income: {
		audio_chat_income: 0, // 语音聊天收益
		gift_income: 0, // 聊天礼物收益
		guild_reward_income: 0, // 公会长奖励收益，日收入/我的 无
		income: 0, // 主播总金币收益
		reward_income: 0, // 奖励收益，日收入无
		soul_match_income: 0, // 文字聊天收益
	},
	text_income: {
		count_num: 0, // 总匹配人数
		guild_income: 0, // 公会奖励收益USD，日收入/我的 无
		income: 0, // 主播总金币收益
		six_cycle_num: 0, // 6轮匹配人数
		three_cycle_num: 0, // 3轮匹配人数
	},
});

// 获取日数据请求
const getDay = async () => {
	try {
		Toast.loading({
			message: "loading...",
			forbidClick: true,
		});
		loading.value = true;
		let options = {
			cycle: "DAY",
			ds: currentDayText.value.replace(/-/g, ""),
			yaame_id: yaameId.value,
		};

		if (options.yaame_id === "") {
			delete options.yaame_id;
		}
		const res = await request.getChairmanSettlements(options);

		if (res.status === 1002) {
			Toast.fail(res.desc);
			return;
		}
		if (res.status !== 1000) return;

		dayInfo.value.anchor_diamonds = res.data.anchor_diamonds || 0;
		dayInfo.value.anchor_income = res.data.anchor_income || 0;
		dayInfo.value.extra_income = res.data.extra_income || 0;
		dayInfo.value.guild_income = res.data.guild_income || 0;
		dayInfo.value.level = res.data.level || {};
		dayInfo.value.type = res.data.type;
		dayInfo.value.chat_income = res.data.chat_income || {
			audio_chat_income: 0,
			gift_income: 0,
			guild_reward_income: 0,
			income: 0,
			reward_income: 0,
			soul_match_income: 0,
		};
		dayInfo.value.text_income = res.data.text_income || {
			count_num: 0,
			guild_income: 0,
			income: 0,
			six_cycle_num: 0,
			three_cycle_num: 0,
		};

		guildType.value = res.data.type;
		// 判断是否有数据
		if (res.data.users && res.data.users.length !== 0) {
			dayList.value = res.data.users;
		} else {
            dayList.value = [];
		}
	} catch (error) {
		console.log(error);
	}
};

// 月份显示
const currentMouthText = ref("");
// 获取当前 年月锚点
const anchorYear = ref(currentMouthDate.value.getFullYear());
const anchorMouth = ref(currentMouthDate.value.getMonth() + 1);
const handleMouthPrev = () => {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        if (weeks.value[inx.value].start.getTime() <= getPHILIPPINESTwo().getTime()) {
            Toast(t("earliest_view_nov_11"));
            return;
        }
    } else {
        if (weeks.value[inx.value].start.getTime() <= getUTCOne().getTime()) {
            Toast(t("earliest_view_oct_1"));
            return;
        }
    }
	// 此逻辑判断是否有跨月情况
	const status = weeks.value[0].start.getDate() !== 1;
	if (inx.value <= 0) {
		anchorMouth.value--;
		if (anchorMouth.value < 1) {
			anchorYear.value--;
			anchorMouth.value = 12;
		}
		weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		inx.value = weeks.value.length - 1;
	} else if (!status) inx.value--;
	if (status) inx.value--;
	tacitly();
};
// 判断月份当月
const handleMouthNext = () => {
	if (weeks.value[inx.value].start.getTime() >= belongTo.value.getTime()) {
		Toast(t("latest_week"));
		return;
	}
	// 此逻辑判断是否有跨月情况
	const status =
		weeks.value[weeks.value.length - 1].end.getDate() !== 30 &&
		weeks.value[weeks.value.length - 1].end.getDate() !== 31;
	if (inx.value >= weeks.value.length - 1) {
		anchorMouth.value++;
		if (anchorMouth.value > 12) {
			anchorYear.value++;
			anchorMouth.value = 1;
			weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		} else weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		inx.value = 0;
	} else if (!status) inx.value++;
	if (status) inx.value++;
	tacitly();
};
// 月份数据
let monthList = ref([]);
let mouthInfo = ref({
	anchor_diamonds: 0, // 主播收益（钻石）
	anchor_income: 0, // 主播收益（美元）
	extra_income: 0, // 工会额外等级收益（USD）
	guild_income: 0, // 工会收益（USD）
	level: {}, // 收入达到几级以上人数
	type: "NORMAL", // 数据类型
	chat_income: {
		audio_chat_income: 0, // 语音聊天收益
		gift_income: 0, // 聊天礼物收益
		guild_reward_income: 0, // 公会长奖励收益，日收入/我的 无
		income: 0, // 主播总金币收益
		reward_income: 0, // 奖励收益，日收入无
		soul_match_income: 0, // 文字聊天收益
	},
	text_income: {
		count_num: 0, // 总匹配人数
		guild_income: 0, // 公会奖励收益USD，日收入/我的 无
		income: 0, // 主播总金币收益
		six_cycle_num: 0, // 6轮匹配人数
		three_cycle_num: 0, // 3轮匹配人数
	},
});

// 月数据请求
const getMonth = async () => {
	try {
		Toast.loading({
			message: "loading...",
			forbidClick: true,
		});
		loading.value = true;

		let options = {
			cycle: "WEEK",
			ds: Number(start.value.split(".").join("")),
			yaame_id: yaameId.value,
		};
		if (options.yaame_id === "") {
			delete options.yaame_id;
		}
		const res = await request.getChairmanSettlements(options);
		if (res.status === 1002) {
			Toast.fail(res.desc);
			return;
		}
		if (res.status !== 1000) return;
		mouthInfo.value.anchor_diamonds = res.data.anchor_diamonds || 0;
		mouthInfo.value.anchor_income = res.data.anchor_income || 0;
		mouthInfo.value.extra_income = res.data.extra_income || 0;
		mouthInfo.value.guild_income = res.data.guild_income || 0;
		mouthInfo.value.level = res.data.level || {};
		mouthInfo.value.type = res.data.type;
		mouthInfo.value.chat_income = res.data.chat_income || {
			audio_chat_income: 0,
			gift_income: 0,
			guild_reward_income: 0,
			income: 0,
			reward_income: 0,
			soul_match_income: 0,
		};
		mouthInfo.value.text_income = res.data.text_income || {
			count_num: 0,
			guild_income: 0,
			income: 0,
			six_cycle_num: 0,
			three_cycle_num: 0,
		};

		guildType.value = res.data.type;
		// 判断是否有数据
		if (res.data.users && res.data.users.length !== 0) {
			monthList.value = res.data.users;
		} else {
			res.data.users = [];
		}
	} catch (error) {
		console.log(error);
	}
};
const isNumber = (val) => {
	return typeof +val === "number" && !isNaN(val);
};
// 退后一天时间
const handlePrev = () => {
	let time = new Date(currentDayDate.value).getTime() - 86400000;
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        if (time < getPHILIPPINESTime().getTime()) {
            Toast(t("earliest_view_nov_11"));
            return;
        }
    } else {
        if (time < getUTCOne().getTime()) {
            Toast(t("earliest_view_oct_1"));
            return;
        }
    }
	currentDayDate.value = new Date(
		new Date(currentDayDate.value).getTime() - 86400000
	);
	page.value = 1;
	getDay();
};
// 获取手机顶栏高度
let safe_height = ref(0);

let timeText = ref("");
const countDown = () => {
	// 获取当前时间的UTC表示
	const now = new Date();
	const utcNow = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		)
	);

	// 获取UTC时间今天结束的时间（即下一个凌晨0点）
	const utcMidnight = new Date(
		Date.UTC(
			utcNow.getUTCFullYear(),
			utcNow.getUTCMonth(),
			utcNow.getUTCDate() + 1
		)
	);

	// 计算当前时间到UTC凌晨的毫秒数
	const countdownMilliseconds = utcMidnight - utcNow;

	// 将毫秒转换为小时、分钟和秒
	const h = Math.floor(countdownMilliseconds / (1000 * 60 * 60));
	const m = Math.floor(
		(countdownMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
	);
	const s = Math.floor((countdownMilliseconds % (1000 * 60)) / 1000);

	timeText.value = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
		s < 10 ? "0" + s : s
	}`;
};

watch(active, (val) => {
	if (val === "DailyIncome") {
		isToday(currentDayDate.value);
	} else {
		isCurrentMonth(currentMouthDate.value);
	}
});
let isTodayFlag = ref(true);
// 计算传入时间（未转换utc）是否为utc时区的今天
const isToday = (inputDate) => {
	if (active.value === "MonthlyIncome") {
		// 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
		const startTime = start.value.split(".").join("");
		const endTime = end.value.split(".").join("");

		// 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
		const inputUTCString =
			inputDate.getFullYear() +
			"" +
			String(inputDate.getMonth() + 1).padStart(2, "0") +
			String(inputDate.getDate()).padStart(2, "0");
		// 比较两个日期字符串是否相等
		isTodayFlag.value =
			inputUTCString >= startTime && inputUTCString <= endTime;

		return;
	}

	// 创建当前时间的Date对象（基于本地时区）
	const now = new Date();

	// 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
	const utcTodayString =
		now.getUTCFullYear() +
		"-" +
		String(now.getUTCMonth() + 1).padStart(2, "0") +
		"-" +
		String(now.getUTCDate()).padStart(2, "0");

	// 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
	const inputUTCString =
		inputDate.getFullYear() +
		"-" +
		String(inputDate.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(inputDate.getDate()).padStart(2, "0");

	// 比较两个日期字符串是否相等
	isTodayFlag.value = utcTodayString === inputUTCString;
};

let isCurrentMonthFlag = ref(true);
// 计算传入时间（未转换utc）是否为utc时区的本月内时间
const isCurrentMonth = (inputDate) => {
	// 创建当前时间的Date对象（基于本地时区）
	const now = new Date();

	// 构建当前UTC时间的年月（'YYYY-MM'格式）
	const utcThisMonthString =
		now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0");

	// 构建传入时间的UTC年月（'YYYY-MM'格式）
	const inputUTCString =
		inputDate.getFullYear() +
		"-" +
		String(inputDate.getMonth() + 1).padStart(2, "0");

	// 比较两个日期字符串是否相等
	isCurrentMonthFlag.value = utcThisMonthString === inputUTCString;
};

let hasData = ref(false);
const handleSeek = () => {
	if (active.value === "DailyIncome") {

        if (yaameId.value === "") {
            getDay();
            return;
        }

		// 遍历当前数组 查找yaame id相同的数据
        const index = dayList.value.findIndex((item) => {
            return item.yaame_id === yaameId.value;
        });

        if (index === -1) {
            hasData.value = false;
            Toast(t("no_data"));
            return;
        } else {
            hasData.value = true;
            dayList.value = [dayList.value[index]];
        }
	} else {
        if (yaameId.value === "") {
            getMonth();
            return;
        }
		// 遍历当前数组 查找yaame id相同的数据
        const index = monthList.value.findIndex((item) => {
            return item.yaame_id === yaameId.value;
        });

        if (index === -1) {
            hasData.value = false;
            Toast(t("no_data"));
            return;
        } else {
            hasData.value = true;
            monthList.value = [monthList.value[index]];
        }
	}
};

const handleInput = (event) => {
	let value = event.target.value;
	let newValue = "";
	for (let i = 0; i < value.length; i++) {
		let char = value.charAt(i);
		if (
			(char >= "a" && char <= "z") ||
			(char >= "A" && char <= "Z") ||
			(char >= "0" && char <= "9")
		) {
			newValue += char;
		}
	}
	yaameId.value = newValue;
};

let intervalFlag = null;

// 记录当月周
const getWeeksInMonth = (year, month) => {
	const weeks = [];
	const firstDay = new Date(year, month - 1, 1); // 获取该月的第一天
	const lastDay = new Date(year, month, 0); // 获取该月的最后一天

	// 迭代计算每周的起始和结束日期
	let weekStart = new Date(firstDay);
	let dayOfWeek = weekStart.getDay();
	// 如果 1 号不是周一，则回退到上一个周一
	if (dayOfWeek !== 1) {
		weekStart.setDate(
			weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
		);
	}

	while (weekStart <= lastDay || weekStart.getMonth() === month) { //NOSONAR
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);

		weeks.push({
			start: new Date(weekStart),
			end: new Date(weekEnd.getTime() + 86394000),
		});

		if (weekEnd.getTime() >= lastDay.getTime()) {
			return weeks;
		}

		// 下周的开始日期
		weekStart.setDate(weekStart.getDate() + 7);
        // 调整思码意报错
        if (weekEnd.getTime() >= lastDay.getTime()) {
            break;
        }
	}
};
// 获取本月周regionIdStatus.value ? getWeeksInMonth(2024, 10) : getWeeksInMonth(Number(currentMouthDate.value.getFullYear()), Number((currentMouthDate.value.getMonth() + 1)))
const weeks = ref(
	getWeeksInMonth(
		Number(currentMouthDate.value.getFullYear()),
		Number(currentMouthDate.value.getMonth() + 1)
	)
);
// 获取本月总周数
const sumWeek = ref(weeks.value.length - 1);
let dayIndex = new Date();
let monthIndex = currentMouthDate.value.getMonth() + 1;

// 获取下标  为防止上月有20多号如果本月在二十多号必须和本月同月
const inx = ref(
	weeks.value.findIndex((item) => {
		if (
			(dayIndex.getDate() < 25 || monthIndex === item.start.getMonth() + 1) &&
			dayIndex.getTime() >= item.start.getTime() &&
			dayIndex.getTime() <= item.end.getTime()
		)
			return true;
	})
);
// 防止页面加载失败
inx.value = inx.value < 0 ? 0 : inx.value;

// 获取默认当前属于周
const belongTo = ref(weeks.value[inx.value].start);

// 获取默认周
const start = ref(null);
const end = ref(null);
const tacitly = () => {
	const startText = weeks.value[inx.value].start;
	const endText = weeks.value[inx.value].end;
	start.value =
		startText.getFullYear() +
		"." +
		String(startText.getMonth() + 1).padStart(2, "0") +
		"." +
		String(startText.getDate()).padStart(2, "0");
	end.value =
		endText.getFullYear() +
		"." +
		String(endText.getMonth() + 1).padStart(2, "0") +
		"." +
		String(endText.getDate()).padStart(2, "0");
	// 单独限制2024  10月数据
	if (
		startText.getFullYear() <= 2024 &&
		startText.getMonth() + 1 === 9 &&
		startText.getDate() === 30
	) {
		let arr = start.value.split(".");
		arr[1] = 10;
		arr[2] = "01";
		start.value = arr.join(".");
	}
	currentMouthText.value = start.value + "-" + end.value;
};

// 展示去掉年展示
const setMouth = () => {
	const arr = currentMouthText.value.split("-");
	const end = arr[1].split(".");
	return arr[0] + "-" + end[1] + "." + end[2];
};

watch(currentDayDate, () => {
	isToday(currentDayDate.value);
});
nextTick(() => {
	watch(currentMouthText, () => {
		monthList.value = [];
		isToday(currentMouthDate.value);
		getMonth();
	});
});

let listTab = ref([
	{
		name: t("roomIncome"),
		// name: "语音房收益",
		key: "roomIncome",
	},
	{
		name: t("textIncome"),
		// name: "1V1收益",
		key: "textIncome",
	},
	{
		name: t("chatIncome"),
		// name: "聊天收益",
		key: "chatIncome",
	},
]);

let activeTab = ref("roomIncome");
const guildType = ref("");
const deleteListTab = () => {
	// 如果公会类型为1V1
	if (guildType.value !== "CHAT") {
		// // 删除语音房收益
		// listTab.value.splice(0, 1);
		// activeTab.value = "textIncome";

        // 删除1V1收益
		listTab.value.splice(1, 1);
		activeTab.value = "roomIncome";
	}
};

let infoVisible = ref(false);
const openInfo = () => {
	infoVisible.value = true;
};

let roomDaySort = ref({
	anchor_diamonds: -1,
	mike: -1,
	live_day: -1,
});
let roomMouthSort = ref({
	anchor_diamonds: -1,
	mike: -1,
	live_day: -1,
	anchor_income: -1,
	guild_income: -1,
});
let textDaySort = ref({
	count_num: -1,
	six_cycle_num: -1,
	six_cycle_income: -1,
	three_cycle_num: -1,
	three_cycle_income: -1,
	income: -1,
	guild_income: -1,
});
let textMouthSort = ref({
	count_num: -1,
	six_cycle_num: -1,
	six_cycle_income: -1,
	three_cycle_num: -1,
	three_cycle_income: -1,
	income: -1,
	guild_income: -1,
});
let chatDaySort = ref({
	soul_match_income: -1,
	audio_chat_income: -1,
	gift_income: -1,
});
let chatMouthSort = ref({
	soul_match_income: -1,
	audio_chat_income: -1,
	gift_income: -1,
	reward_income: -1,
	income: -1,
	guild_reward_income: -1,
});

const sortClick = (sortType, key) => {
	let sortObj;

	switch (sortType) {
		case "roomDaySort":
			sortObj = roomDaySort.value;
			break;
		case "roomMouthSort":
			sortObj = roomMouthSort.value;
			break;
		case "textDaySort":
			sortObj = textDaySort.value;
			break;
		case "textMouthSort":
			sortObj = textMouthSort.value;
			break;
		case "chatDaySort":
			sortObj = chatDaySort.value;
			break;
		case "chatMouthSort":
			sortObj = chatMouthSort.value;
			break;
		default:
			console.warn(`Unknown sort type: ${sortType}`);
			return;
	}

	// Toggle current key's value among -1, 0, and 1
	sortObj[key] = ((sortObj[key] + 2) % 3) - 1;

	// Clear other keys in the object
	for (let k in sortObj) {
		if (k !== key) {
			sortObj[k] = -1;
		}
	}
};

let daySortList = computed(() => {
    let sort = null;

    switch (activeTab.value) {
        case 'roomIncome':
            sort = roomDaySort.value;
            break;
        case 'textIncome':
            sort = textDaySort.value;
            break;
        case 'chatIncome':
            sort = chatDaySort.value;
            break;
        default:
            console.warn(`Unknown active tab: ${activeTab.value}`);
            break;
    }

    // 查找排序键，排除值为 -1 的键
    let key = Object.keys(sort).find(key => sort[key] !== -1);

    // 如果没有有效的排序键，返回原始数据
    if (!key || sort[key] === -1) {
        return dayList.value;
    } else {
        // 1 为升序，0 为降序
        return [...dayList.value].sort((a, b) => {
            let valA, valB;

            if (activeTab.value === 'roomIncome') {
                valA = a[key];
                valB = b[key];
            } else if (activeTab.value === 'textIncome') {
                valA = a.text_income[key];
                valB = b.text_income[key];
            } else if (activeTab.value === 'chatIncome') {
                valA = a.chat_income[key];
                valB = b.chat_income[key];
            }

            return sort[key] === 1 ? valA - valB : valB - valA;
        });
    }
});


let monthSortList = computed(() => {
    let sort = null;

    switch (activeTab.value) {
        case "roomIncome":
            sort = roomMouthSort.value;
            break;
        case "textIncome":
            sort = textMouthSort.value;
            break;
        case "chatIncome":
            sort = chatMouthSort.value;
            break;
        default:
            console.warn(`Unknown active tab: ${activeTab.value}`);
            break;
    }

    // 查找排序键，排除值为 -1 的键
    let key = Object.keys(sort).find((key) => sort[key] !== -1);

    // 如果没有有效的排序键，返回原始数据
    if (!key || sort[key] === -1) {
        return monthList.value;
    } else {
        // 1 为升序，0 为降序
        return [...monthList.value].sort((a, b) => {
            let valA, valB;

            if (activeTab.value === "roomIncome") {
                valA = a[key];
                valB = b[key];
            } else if (activeTab.value === "textIncome") {
                valA = a.text_income[key];
                valB = b.text_income[key];
            } else if (activeTab.value === "chatIncome") {
                valA = a.chat_income[key];
                valB = b.chat_income[key];
            }

            return sort[key] === 1 ? valA - valB : valB - valA;
        });
    }
});


const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};

onMounted(async () => {
	let safe_area = getSafeHeight() || 0;
	safe_height.value = (safe_area * 2) / 100;
	tacitly();
	// 根据缓存设置默认选中tab 并且清空缓存 防止刷新
	if (localStorage.getItem("activeTab")) {
		activeTab.value = localStorage.getItem("activeTab");
		localStorage.removeItem("activeTab");
	}
	if (localStorage.getItem("active")) {
		active.value = localStorage.getItem("active");
		localStorage.removeItem("active");
	}

	// 如果active为MonthlyIncome  则获取月数据
	if (active.value === "MonthlyIncome") {
		await getMouth();
	} else {
		await getDay();
	}
	if (guildType.value) {
		deleteListTab();
	} else {
		guildType.value = root.proxy.$route.query.guild_type;

		deleteListTab();
	}
	isToday(currentDayDate.value);
	countDown();
	intervalFlag = setInterval(() => {
		countDown();
	}, 1000);

	// const inputs = document.querySelectorAll('input');
	// inputs.forEach(input => {
	//     input.addEventListener('focus', (event) => {
	//         // 等待键盘完全展开后进行滚动
	//         setTimeout(() => {
	//             event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
	//         }, 300); // 可能需要调整延迟以适配不同的设备和情况
	//     });
	// });
});
onBeforeUnmount(() => {
	clearInterval(intervalFlag);
});
</script>

<style lang="less" scoped>
.tab {
	width: 4.8rem;
	height: 0.68rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.08rem;
	background: #e9eff4;
	border-radius: 0.34rem;
	font-size: 0.26rem;
	font-weight: 500;
	color: #333333;
	margin-left: 1.35rem;

	div {
		width: 2.32rem;
		height: 0.52rem;
		text-align: center;
		line-height: 0.52rem;

		border-radius: 0.3rem;

		&.active {
			background-color: #fff;
		}
	}
}

.select-time {
	width: 7.5rem;
	height: 0.4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.6rem;
	margin-bottom: 0.3rem;

	img {
		width: 0.24rem;
	}

	.time-text {
		margin: 0 0.2rem;
		min-width: 2.31rem;
		font-weight: 500;
		color: #333333;
		font-size: 0.36rem;
		text-align: center;
	}
}

.no-data {
	margin-top: 1.81rem;
	text-align: center;
	height: 5rem;
	img {
		width: 1.8rem;
		height: 1.8rem;
	}

	p {
		width: 7.5rem;
		height: 0.28rem;
		line-height: 0.28rem;
		margin-top: 0.3rem;
		font-size: 0.24rem;
	}
}

.month {
	font-size: 0.24rem;
	max-height: 10rem;
	overflow-x: auto;
	border-radius: 0.24rem;
	margin: 0.4rem 0.3rem 0 0.3rem;

	.table-header-month {
		// min-width: 10rem;
		// overflow-x: auto;
		// padding-right: 0.4rem;
	}
}

.table {
	min-width: 6.9rem;
	max-height: 10rem;
	border-radius: 0.24rem;
	overflow-x: auto;
	font-size: 0.24rem;
	margin: 0.4rem 0.3rem 0 0.3rem;
}

.table-header {
	width: 100%;
	table-layout: auto;
	background: #ffffff;
	border-radius: 0.24rem;

	thead {
		height: 1.2rem;
		background: #eaf5ec;
		border-radius: 0.24rem 0.24rem 0 0;

		tr {
			th {
				max-width: 10rem;
				flex: 1;
				border-right: 0.02rem solid #d6dfe7;
				padding: 0 0.2rem;
				height: 1.2rem;
				white-space: nowrap;

				justify-content: center;
				align-items: center;
				padding: 0 0.1rem;
				flex-wrap: nowrap;

				white-space: nowrap;
				&.active {
					color: #faa583;
				}

				img {
					display: inline;
					width: 0.2rem;
					height: auto;
					vertical-align: middle;
				}
				&:last-of-type {
					border-right: 0;
				}
			}
		}
	}

	tbody {
		border-radius: 0 0 0.24rem 0.24rem;

		.van-list {
			width: 100%;
		}

		tr {
			height: 0.72rem;
			border-bottom: 0.02rem solid #eee;

			td {
				max-width: 10rem;
				flex: 1;
				padding: 0 0.1rem;
				text-align: center;
				line-height: 0.72rem;
				border-right: 0.02rem solid #eee;
				overflow: hidden;
				word-wrap: break-word;

				&:last-of-type {
					border-right: 0;
				}
			}

			&:last-of-type {
				border-bottom: 0;
			}
		}
	}
}

.info-p {
	font-size: 0.24rem;
	color: #666;
	padding-left: 0.3rem;
    padding-right: 0.3rem;
}

.ar {
    text-align: right;
    .list-tab {
        flex-direction: row-reverse;
    }
    .text-list {
        .text-list-item {
            .text-list-item-header {
                flex-direction: row-reverse;
            }
            .text-list-item-content {
                flex-direction: row-reverse;
            }
            .text-list-item-info {
                flex-direction: row-reverse;
            }
        }
    }
    .room-list {
        .room-list-item {
            .room-list-item-header {
                flex-direction: row-reverse;
            }
            .room-list-item-content {
                flex-direction: row-reverse;
            }
        }
    }
    .info-container {
        flex-direction: row-reverse;
    }
}

.info-container {
	width: 6.9rem;
	height: 1.36rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin: 0.15rem 0.3rem;
	display: flex;
	line-height: 1.36rem;
	padding: 0 0.3rem;
	font-size: 0.3rem;
	font-weight: 500;
	color: #393939;
	justify-content: space-between;
    .flex-span {
        display: flex;
        align-items: center;
        img {
            width: 0.28rem;
            height: 0.28rem;
            margin-left: 0.04rem;
            margin-top: 0.02rem;
        }
    }
}

.level-list {
	width: 6.9rem;
	min-height: 0.8rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin: 0.15rem 0.3rem;
	display: flex;
	align-items: center;
	padding: 0.2rem 0.3rem;
	font-size: 0.3rem;
	font-weight: 500;
	color: #393939;
	justify-content: space-between;
	span:nth-child(1) {
		display: flex;
		width: 73%;
		line-height: 0.4rem;
		align-items: center;
	}
	span:last-of-type {
		margin-left: 0.3rem;
	}
}

.search {
	width: 6.9rem;
	height: 1rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-top: 0.8rem;
	margin-left: 0.3rem;
	display: inline-block;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 0.4rem;
	padding-right: 0.1rem;
	position: relative;

	input {
		width: 6.9rem;
		height: 1rem;
		border-radius: 0.24rem;
		background: #fff;
		border: none;
		font-size: 0.32rem;
		font-weight: 500;

		color: #333333;
		line-height: 1rem;
		padding-left: 0.4rem;
		padding-right: 2.2rem;
		position: absolute;
		top: 0;
		left: 0;
	}

	.btn {
		width: 1.8rem;
		text-align: center;
		height: 0.8rem;
		line-height: 0.8rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: linear-gradient(135deg, #abf78e 0%, #00e59e 100%);
		border-radius: 0.24rem;

		font-size: 0.3rem;
		font-weight: 600;
		color: #ffffff;
		position: absolute;
		right: 0.1rem;
		top: 0.1rem;
	}
}
.list-tab {
	width: 7.5rem;
	height: 0.4rem;
	font-weight: 500;
	font-size: 0.24rem;
	color: #999999;
	display: flex;
	flex-wrap: nowrap;
	padding: 0 0.3rem;
	margin-top: 0.67rem;
	margin-bottom: 0.4rem;
	line-height: 0.4rem;
	div {
		margin-right: 0.2rem;
	}
	.active {
		font-weight: 500;
		font-size: 0.26rem;
		color: #333333;
	}
}
.text-list {
	padding: 0 0.3rem 0.3rem;
	.text-list-item {
		width: 6.9rem;
		background: #eaf5ec;
		border-radius: 0.24rem;
		margin-bottom: 0.24rem;
		overflow: hidden;
		.text-list-item-header {
			background-color: #fff;
			width: 6.9rem;
			border-bottom: 0.01rem solid #eee;
			height: 0.84rem;
			line-height: 0.84rem;
			font-weight: 500;
			font-size: 0.24rem;
			color: #999999;
			display: flex;
			justify-content: space-between;
			padding: 0 0.3rem;
		}
		.text-list-item-content {
			background-color: #fff;
			width: 6.9rem;
			height: 0.9rem;
			line-height: 0.9rem;
			font-weight: 500;
			font-size: 0.3rem;
			color: #393939;
			display: flex;
			justify-content: space-between;
			margin-bottom: 0.06rem;
			padding: 0 0.3rem;
			border-bottom-left-radius: 0.24rem;
			border-bottom-right-radius: 0.24rem;
			img {
				width: 0.28rem;
				height: auto;
				vertical-align: middle;
				position: relative;
				bottom: 0.03rem;
				right: 0.03rem;
			}
		}
		.text-list-item-content-two {
			background-color: #fff;
			width: 6.9rem;
			height: 1.7rem;
			font-weight: 500;
			font-size: 0.3rem;
			color: #393939;

			margin-bottom: 0.06rem;
			padding: 0 0.3rem;
			border-bottom-left-radius: 0.24rem;
			border-bottom-right-radius: 0.24rem;

			p {
				height: 0.85rem;
				line-height: 0.85rem;
				display: flex;
				justify-content: space-between;
				img {
					width: 0.28rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.03rem;
					right: 0.03rem;
				}
			}
		}

		.text-list-item-info {
			width: 6.9rem;
			height: 0.7rem;
			line-height: 0.7rem;
			display: flex;
			justify-content: space-between;
			padding: 0 0.3rem;
			.left-item {
				font-weight: 400;
				font-size: 0.24rem;
				color: #666666;
			}
			.right-item {
				font-weight: bold;
				font-size: 0.28rem;
				color: #666666;
				img {
					width: 0.28rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.03rem;
					right: 0.03rem;
				}
			}
		}
	}
}

.user-info {
	width: 2.3rem;
	display: flex;
	align-items: center;
	padding: 0.2rem;
	img {
		width: 0.44rem;
		height: 0.44rem;
		margin-right: 0.1rem;
	}
	span {
		display: inline-block;
		width: 1.34rem;
		text-align: left;
	}
}
.flex-container {
	display: flex;
	justify-content: center;
	align-items: center;
	.level-container {
		width: 5.9rem;
		height: 8.45rem;
		background: #ffffff;
		border-radius: 0.24rem;
		padding-top: 0.6rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		position: relative;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/58e31e7ad2b2acb807f9424252ac7aeb.png);

		.confirm-btn {
			width: 3.9rem;
			height: 0.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/0c3497ec916f0b4e923fef8cbe378dd6.png);
			position: absolute;
			bottom: 0.6rem;
			left: 1rem;
			text-align: center;
			line-height: 0.88rem;
			font-weight: 600;
			font-size: 0.3rem;
			color: #ffffff;
		}
		.info-title {
			width: 4.9rem;
			text-align: center;
			font-weight: 600;
			font-size: 0.34rem;
			color: #333333;
			margin-bottom: 0.4rem;
		}
		.info-content {
			width: 4.9rem;
			height: 5rem;
			overflow-y: scroll;
			.info-p {
				font-weight: 400;
				font-size: 0.26rem;
				color: #666666;
				display: flex;
				justify-content: space-between;
				margin-bottom: 0.4rem;
			}
		}
	}
}
</style>
