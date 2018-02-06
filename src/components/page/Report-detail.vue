<template lang="html">
<div class="plan">
	<!-- head -->
	<div class="clearfix head">
		<img class="pull-left" src="../../assets/Plan_msg.png">
		<button class="pull-right btn btn-success"
				@click="createReport">
			新增工作总结
		</button>
	</div>
	<!-- title -->
	<div class="title">
		<!-- 工作总结 -->
		<div class="title_report"
			 :class="{'title-active': type == '工作总结'}"
			 @click="type = '工作总结'">
			工作总结
		</div>
		<!-- 工作计划 -->
		<div class="title_plan "
			 :class="{'title-active': type == '工作计划'}"
			 @click="type = '工作计划'">
			工作计划
		</div>
		<!-- avatar -->
		<div class="title_avatar">
			<img :src="avatar" @error="errorImg(null)">
			<span>{{name}}</span>
		</div>			
	</div>
	<!-- detail -->
	<div class="detail">
		<!-- 工作总结 -->
		<div class="detail_item" 
			 v-if="type == '工作总结'"
			 v-for="item in reportList">
			<h3 class="detail_week">{{item.week}}</h3>
			<div class="detail_line">
				<span class="detail_line-round">
					<span></span>
				</span>
			</div>
			<div class="detail_content">
				<p class="detail_time">{{item.date}}</p>
				<p>{{item.note}}</p>
			</div>
		</div>
		<!-- 工作计划 -->
		<div class="detail_item" 
			 v-if="type == '工作计划'"
			 v-for="item in planList">
			<h3 class="detail_week">{{item.week}}</h3>
			<div class="detail_line">
				<span class="detail_line-round">
					<span></span>
				</span>
			</div>
			<div class="detail_content">
				<p class="detail_time">{{item.star}}</p>
				<p>{{item.note}}</p>
			</div>
		</div>
	</div>
	<!-- approvals -->
	<h3 class="approvals_title" v-if="type == '工作总结'">查看人</h3>
	<div class="approvals" v-if="type == '工作总结'">
		<div class="approvals_item" v-for="item in approvalsList">
			<img class="avatar" :src="item.work.avatar" 
				 @error="errorImg(item)" />
			<span class="name">{{item.work.name}}</span>
			<span class="line" v-if="item.note"></span>
			<span class="opinion">{{item.note}}</span>
			<div class="state">
				<p v-if="item.state === 1">
					<img src="../../assets/Sidebar_checkIn.svg">
					<span>已审批</span>
				</p>
				<p v-else>
					<img src="../../assets/Sidebar_check.svg">
					<span style="color: #999;">待审批</span>
				</p>
			</div>
		</div>
	</div>
	<!-- 某时间段内无工作计划时的提示 -->
	<div class="text-center no_plan-tips"
		 v-if="type == '工作计划' && planList.length === 0">
		<p>该时间段内无工作计划。</p>
	</div>
</div>
</template>

<style scoped="scoped">
	.head{
		padding: 0 15px 0 0px;
	}
	.head button{
		background: transparent;
		border-radius: 33px;
		border: 1px solid #84c575;
		color: #84c575;
	}
	.title{
		height: 100px;
		background: white;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:0 30px;
		margin-top: 15px;
		font-size: 16px;
		color: #999;
	}
	.title .title_report, .title .title_plan{
		margin-left: 40px;
		padding-bottom: 15px;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.title .title_plan{
		margin-left: -70px;
	}	
	.title .title-active{
		font-size: 20px;
		color: #333;
		border-bottom: 2px solid #2cb2d7;
	}
	.title_avatar img{
		width: 60px;
		border-radius: 50%;
	}
	.title_avatar span{
		color: #999;
		margin-left: 15px;
		font-size: 14px;
	}
	.detail{
		padding: 0 30px;
		background: white;
		border-radius: 10px;
		margin-top: 15px;
	}
	.detail_item{
		padding: 30px 0 5px 0;
		display: flex;
		align-items: flex-start;
		position: relative;
	}
	.detail_item:last-child{
		padding-bottom: 20px;
	}
	.detail_item .detail_week{
		margin: 0;
		font-size: 18px;
		flex: 0 0 50px;
		color: #7dc26d;
	}
	.detail_item .detail_line{
		position: absolute;
		top: 0;
		left: 65px;
		height: 100%;
		border: 1px solid #e3e7e9;
	}
	.detail_line-round{
		position: absolute;
		top: 30px;
		left: 50%;
		width: 15px;
		height: 15px;
		margin-left: -7px;
		border: 2px solid #7dc26d;
		padding: 3px;
		border-radius: 50%;
	}
	.detail_line-round span{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #7dc26d;
	}
	.detail_item .detail_content{
		margin-left: 50px; 
	}
	.detail_item .detail_content p{
		margin: 0;
	}
	.detail_item .detail_content .detail_time{
		font-size: 14px;
		color: #999;
	}
	.detail_item .detail_content p:last-child{
		margin-top: 5px;
	}
	.approvals_title{
		margin-top: 15px;
		padding-left: 20px;
		font-size: 12px;
		font-weight: 400;
	}
	.approvals{
		background: white;
		padding: 10px 50px;
		margin-top: 15px;
		border-radius: 10px;
	}
	.approvals_item{
		display: flex;
		align-items: center;
		position: relative;
		padding: 15px 10px;
		border-bottom: 2px solid #e3e7e9;
	}
	.approvals_item:last-child{
		border-bottom: none;
	}
	.approvals_item .avatar{
		width: 50px;
		border-radius: 50%;
	}
	.approvals_item .name{
		margin-left: 20px;
	}
	.approvals_item .line{
		height: 20px;
		width: 2px;
		background: #e3e7e9;
		margin-left: 20px;
	}
	.approvals_item .opinion{
		margin-left: 20px;
	}
	.approvals_item .state{
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translateY(-50%);
	}
	.approvals_item .state p{
		margin: 0;
	}
	.approvals_item .state p:last-child{
		margin-top: 5px;
		color: #49a749;
	}
	.approvals_item .state img{
		width: 15px;
		height: 15px;
	}
	.no_plan-tips{
		color: #999;
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

export default {
	data () {
		return {
			type: '工作总结', // 计划类型
			avatar: '', // 头像
			name: '', // 姓名
			reportList: [], // 总结详情
			approvalsList: [], // 审批详情
			planList: [], // 计划详情
		}
	},
	mounted () {
		// 监听 Sidebar-report 获取详情事件
		this.$eventBus.$on('getReportDetail', event => {
			this.getReportDetail(event.id);
		});
	},
	methods: {
		// 处理头像加载不出来
		errorImg (item) {
			if(item){
				item.work.avatar = this.$store.state.avatarDefault;
			}else{
				this.avatar = this.$store.state.avatarDefault;
			}	
		},
		// 获取工作总结详情
		getReportDetail (id) {
			// 显示加载动画
			this.$store.dispatch('showLoading');
			axios.getReportDetail(id, (err, data) => {
				if(err){
					swal(err);
					return;
				}
				// 获取对应时间段的工作计划
				this.getPeroidPlan(this.$store.state.userInfo.id, 
					data.startDate, data.endDate);

				// 处理某些字段
				this.avatar = utils.handleAvatar(data.worker.avatar);
				this.name = data.worker.name;
				// 计划详情
				data.days.forEach(item => {
					item.week = utils.formatTimeToWeek(item.dayDate);
					item.date = utils.formatTime(item.dayDate, 2);
				});
				this.reportList = data.days;
				// 审批详情
				this.approvalsList.length = 0;
				data.works.forEach(item => {
					item.work.avatar = utils.handleAvatar(item.work.avatar);
					this.approvalsList.push(item);
				});
			});
		},
		// 获取某个时间段的工作计划
		getPeroidPlan (uid, from, to){
			axios.getPeroidPlan(uid, from, to, (err, data) => {
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
				if(err){
					swal(err);
					return;
				}
				data.list.forEach(item => {
					item.week = utils.formatTimeToWeek(item.star);
					item.star = utils.formatTime(item.star, 2);
					item.end = utils.formatTime(item.end, 2);
				});
				this.planList = data.list;
			});
		},
		// 新建工作总结
		createReport () {
			this.$router.push('/home/report/create');
		}
	}
}
</script>