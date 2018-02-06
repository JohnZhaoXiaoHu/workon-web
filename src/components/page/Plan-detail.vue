<template lang="html">
<div class="plan">
	<!-- head -->
	<div class="clearfix head">
		<img class="pull-left" src="../../assets/Plan_msg.png">
		<button class="pull-right btn btn-success"
				@click="createPlan">
			新增工作计划
		</button>
	</div>
	<!-- title -->
	<div class="title">
		<!-- info -->
		<div class="title_info">
			<h2>{{type}}</h2>
			<p>{{start}}-{{end}}</p>
		</div>
		<!-- avatar -->
		<div class="title_avatar">
			<img :src="avatar" @error="errorImg(null)">
			<span>{{name}}</span>
		</div>			
	</div> 
	<!-- detail -->
	<div class="detail">
		<div class="detail_item" v-for="item in detailList">
			<h3 class="detail_week">{{item.week}}</h3>
			<div class="detail_line">
				<span class="detail_line-round">
					<span></span>
				</span>
			</div>
			<div class="detail_content">
				<p class="detail_time">{{item.start}}</p>
				<p>{{item.note}}</p>
			</div>
		</div>
	</div>
	<!-- approvals -->
	<h3 class="approvals_title">审核人</h3>
	<div class="approvals">
		<div class="approvals_item" v-for="item in approvalsList">
			<img class="avatar" :src="item.worker.avatar"
				 @error="errorImg(item)" />
			<span class="name">{{item.worker.name}}</span>
			<span class="line" v-if="item.note !== ''"></span>
			<span class="opinion">{{item.note}}</span>
			<div class="state">
				<p>{{item.hierarchy}}级审批人</p>
				<p v-if="item.state === 0 || item.state === -1">
					<img src="../../assets/Sidebar_check.svg">
					<span style="color: #999;">待审批</span>
				</p>
				<p v-if="item.state === 1">
					<img src="../../assets/Sidebar_checkIn.svg">
					<span>已审批</span>
				</p>
			</div>
		</div>
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
	}
	.title_info h2{
		font-size: 18px;
	}
	.title_info p{
		color: #999;
	}
	.title_avatar img{
		width: 60px;
		border-radius: 50%;
	}
	.title_avatar span{
		color: #666;
		margin-left: 20px;
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
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';
 
export default {
	data () {
		return {
			type: '工作周报', // 计划类型
			start: '', // 开始时间
			end: '', // 结束时间
			avatar: '', // 头像
			name: '', // 姓名
			detailList: [], // 计划详情
			approvalsList: [], // 审批详情
		}
	},
	mounted () {
		// 监听 Sidebar-plan 获取详情事件
		this.$eventBus.$on('getPlanDetail', event => {
			this.getPlanDetail(event.id);
		});
	},
	methods: {
		// 处理头像不出来
		errorImg (item) {
			if(item){
				item.worker.avatar = this.$store.state.avatarDefault;
			}else{
				this.avatar = this.$store.state.avatarDefault;
			}	
		},
		// 处理时间
		formatTimeToWeek (timeStamp) {
			var dateObj = new Date(timeStamp);
			var week = dateObj.getDay();
			var weekString = ['日', '一', '二', '三', '四', '五', '六'];
			var result = '';

			result = '周' + weekString[week];
			return result;
		},
		getPlanDetail (id) {
			// 显示加载动画
			this.$store.dispatch('showLoading');
			axios.getPlanDetail(id, (err, data) => {
				if(err){
					swal(err);
					return;
				}

				// 处理某些字段
				this.start = utils.formatTime(data.star, 2);
				this.end = utils.formatTime(data.end, 2);
				this.avatar = utils.handleAvatar(data.worker.avatar);
				this.name = data.worker.name;
				// 计划详情
				data.items.forEach(item => {
					item.week = this.formatTimeToWeek(item.star);
					item.start = utils.formatTime(item.star, 2);
				});
				this.detailList = Array.prototype.concat(data.items);
				// 审批详情
				this.approvalsList.length = 0;
				this.approvalsList = data.records;
				this.approvalsList.map(item => {
					item.worker.avatar = utils.handleAvatar(item.worker.avatar);
				});			
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
			});
		},
		// 新建工作计划
		createPlan () {
			this.$router.push('/home/plan/create');
		}
	}
}
</script>