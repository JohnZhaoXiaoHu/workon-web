<template lang="html">
<div class="hidden-xs sidebar_container planList_container">
	<!-- head -->
	<div class="clearfix head">
		<span class="pull-left">>&nbsp;工作计划</span>
		<img class="pull-right" src="../../assets/Sidebar_closebtn.png"
			 @click="closeSelf">
	</div>
	<!-- 工作计划列表 -->
	<div class="plan_week-container" id="planWeekContainer" 
		 @scroll="handlePlanListScroll($event)">
		<div class="plan_week" v-for="item in planList"
			 :class="{'item-active': item.active}"
			 @click="getPlanDetail(item.id)">
			<!-- 工作周报 -->
			<div v-if="item.catalog === 1" class="plan_week-time">
				<div class="plan_week-icon">周</div>
				<div class="plan_week-detailTime">
					<p>第{{item.week}}周</p>
					<p>{{item.star}}-{{item.end}}</p>
				</div>
			</div> 
			<!-- 工作日报 -->
			<div v-else class="plan_week-time">
				<div class="plan_week-icon plan_day-icon">日</div>
				<div class="plan_week-detailTime">
					<p>工作日报</p>
					<p>{{item.star}}</p>
				</div>
			</div>
			<!-- 审批人 -->
			<div class="plan_week-approve">
				<div class="plan_week-approvePeople" 
					 v-for="approvals in item.approvals">
					<img class="avatar" :src="approvals.worker.avatar"
						 @error="errorImg(approvals)"></img>
					<span class="name">{{approvals.worker.name}}</span>
					<img class="checkDefault" src="../../assets/Sidebar_check.svg" />
				</div>
			</div>
		</div>
		<!-- 底部加载数据提示 -->
		<div class="text-center plan_week-bottom">
			<div v-if="havePlanData">
				<img src="../../assets/Sidebar_bottom-loading.svg" />
				<span>正在加载...</span>
			</div>
			<div v-else>
				<span>没有更多数据</span>
			</div>
		</div>
	</div>		
</div>
</template>

<style scoped="scoped">
	p{
		margin: 0;
	}
	.planList_container{
		display: flex;
		flex-direction: column;
		background: #f7f8f9;
	}
	.head{
		padding: 20px;
		height: 64px;
		flex: 0 0 auto;	
		line-height: 24px;
	}
	.head > img{
		cursor: pointer;
	}
	.plan_week-container{
		flex: 1;
		overflow-y: scroll;
		padding: 0;
		position: relative;
	}
	.plan_week{
		margin-top: 10px;
		padding: 20px 0 20px 25px;
		background: white;
		cursor: pointer;		
	}
	.plan_week:first-child{
		margin-top: 0;
	}
	.item-active{
		background: #e4e8ea;
	}
	.plan_week-time{
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 2px solid #f7f7f7;
	}
	.plan_week-icon{
		display: inline-block;
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 8px;
		background: #2cb2d6;
		text-align: center;
		font-size: 20px;
		color: white;
	}
	.plan_day-icon{
		background: #7dc26d;
	}
	.plan_week-detailTime{
		margin-left: 20px;
	}
	.plan_week-detailTime p:first-child{
		font-size: 20px;
		color: #7dc26d;
	}
	.plan_week-detailTime p:last-child{
		color: #999;
	}
	.plan_week-approve{
		margin-top: 10px;
		display: flex;
		width: 100%;
		padding-bottom: 5px;
	}
	.plan_week-approve::scrollbar{
	  height: 4px; 
	}
	.plan_week-approve::-webkit-scrollbar { 
	  height: 4px; 
	}
	.plan_week-approvePeople{
		margin-right: 20px;
		display: inline-block;
		line-height: 35px;
	}	
	.plan_week-approvePeople > .avatar{
		width: 35px;
		border-radius: 50%;
	}
	.plan_week-approvePeople > .name{
		font-weight: 400;
		margin-left: 5px;
	}
	.plan_week-approvePeople > .checkDefault{
		margin-left: 5px;
		width: 15px;
		height: 15px;
	}
	.plan_week-bottom{
		padding: 10px;
	}	
	.plan_week-bottom img{
		display: inline-block;
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

export default {
	data () {
		return {
			planList: [], // 工作计划列表
			currentPage: 1, // 当前页码
			totalPage: '', // 总页码
			// 是否还有未加载的计划列表，用以区分显示底部提示文字
			havePlanData: false,
			workId: '', // 正在查看计划的id
			scrollTop: '', // 最后一次列表滚动的距离
		}
	},
	created () {
		// 获取工作计划列表
		this.getPlanList(this.$store.state.userInfo.id, 1, 10, 'init');	
	},
	mounted () {
		// 监听强制刷新列表事件
		this.$eventBus.$on('freshPlanList', event => {
			this.getPlanList(this.$store.state.userInfo.id, 1, 10, 'fresh');
		});
	},
	// keep-alive生命周期钩子 组件激活时调用
	activated () {
		if(this.planList.length){
			// 列表滚动到上次查看的距离
			var planContainer = document.getElementById('planWeekContainer');
			planContainer.scrollTop = this.scrollTop;
			
			// 跳转至计划详情界面				
			this.$router.push({
				path: '/home/plan/detail'
			});
		}			
	},
	methods: {
		// 关闭浮层
		closeSelf () {
			this.$emit('closeSelf', 'off', 'plan');
		},
		// 处理头像加载不出来
		errorImg (item) {
			item.worker.avatar = this.$store.state.avatarDefault;
		},
		// 监听计划列表滚动事件
		handlePlanListScroll (event) {
			var containerScrollHeight = event.target.scrollHeight
			var containerClientHeight = event.target.clientHeight;
			var containerScrollTop = Math.round(event.target.scrollTop);

			if( containerClientHeight + containerScrollTop === 
			    containerScrollHeight || containerClientHeight + containerScrollTop === containerScrollHeight - 1){
				this.havePlanData = false;
				if( this.currentPage < this.totalPage ){
					this.currentPage += 1;
					// 加载下一页数据
					this.getPlanList(this.$store.state.userInfo.id, 
									 this.currentPage, 10, 'nextPage');
				}else{
					this.havePlanData = false;
				}
			}
		},
		// 获取工作计划列表
		getPlanList (workid, pageNo, pageSize, type) {
			var self = this;
			// 显示加载动画
			if(!type === 'nextPage'){
				self.$store.dispatch('showLoading');
			}				

			// 请求数据
			axios.getPlanList(workid, pageNo, pageSize, 
			  function(err, list, totalPage){
			  	// 隐藏加载动画
			  	self.$store.dispatch('hideLoading');

			  	if(err){
			  		swal(err);
			  		return;
			  	}

			  	// 扩展--增加第几周、格式化时间
			  	// 处理--处理审核人头像地址问题
			  	list.map(item => {
			  		item.week = utils.checkWeek(item.star);
			  		item.star = utils.formatTime(item.star, 1);
			  		item.end = utils.formatTime(item.end, 1);
			  		item.active = false;
			  		try{
			  			item.approvals.map(approvalsItem => {
			  				approvalsItem.worker.avatar = utils.handleAvatar(
			  					approvalsItem.worker.avatar);
			  				return approvalsItem;
			  			});
			  		}catch(e){
			  			// console.log(e);
			  		}				  		
			  		return item;
			  	});

			  	if(type === 'fresh' || type === 'init'){
			  		self.planList = list;
			  		self.getPlanDetail(list[0].id, 'init');
			  	}else{
			  		self.planList = Array.prototype.concat(self.planList, list);
			  	}				  	
			  	self.totalPage = totalPage;
			});
		},
		// 查看计划详情
		getPlanDetail (id, type) {
			var planContainer = document.getElementById('planWeekContainer');
			var containerScrollTop = Math.round(planContainer.scrollTop);
			// 记录列表滚动的距离
			this.scrollTop = containerScrollTop;

			this.workId = id;
			this.planList.forEach(item => {
				if(item.id === id){
					item.active = true;
				}else{
					item.active = false;
				}
			});
			// 跳转至计划详情界面
			this.$router.push({
				path: '/home/plan/detail'
			});
			// 初次进入计划详情的路由，等待计划详情组件渲染1秒钟	
			if(type == 'init'){
				// 显示加载动画
				this.$store.dispatch('showLoading');					
				this.$nextTick(() => {
					this.$eventBus.$emit('getPlanDetail', {
						id: id
					});
				});
			}else{
				this.$eventBus.$emit('getPlanDetail', {
					id: id
				});	
			}			
		}
	}
}
</script>