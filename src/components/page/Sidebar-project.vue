<template lang="html">
<div class="hidden-xs sidebar_container projectList_container">
	<!-- head -->
	<div class="clearfix head">
		<span class="pull-left">>&nbsp;项目</span>
		<img class="pull-right" src="../../assets/Sidebar_closebtn.png"
			 @click="closeSelf">
	</div>
	<!-- 项目列表 -->
	<div class="project_list-container" id="projectListContainer" 
		 @scroll="handleReportListScroll($event)">
		<div class="project_list" v-for="item in projectList"
			 :class="{'item-active': item.active}"
			 @click="getProjectDetail(item.id)">
			<!-- 工作周报 -->
			<div class="project_list-time">
				<div class="project_list-detailTime">
					<p>{{item.note}}</p>
					<p>{{item.startDate}}-{{item.endDate}}</p>
				</div>
			</div>
			<!-- 审批人 -->
			<div class="project_list-approve">
				<div class="project_list-approvePeople" 
					 v-for="approvalsItem in item.approvals">
					<img class="avatar" :src="approvalsItem.worker.avatar"
						 @error="errorImg(approvalsItem)"></img>
					<span class="name">{{approvalsItem.worker.name}}</span>
					<img class="checkDefault" 
						 src="../../assets/Sidebar_check.svg" />
				</div>
			</div>
			<!-- 进度条 -->
			<div class="project-progress"
				 :style="{width: item.progressWidth + 'px'}"></div>
		</div>
		<!-- 底部加载数据提示 -->
		<div class="text-center project_list-bottom">
			<div v-if="haveProjectData">
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
	.projectList_container{
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
	.project_list-container{
		flex: 1;
		overflow-y: scroll;
		padding: 0;
		position: relative;
	}
	.project_list{
		width: 100%;
		margin-top: 10px;
		padding: 20px;
		padding-right: 10px;
		background: white;
		cursor: pointer;	
		position: relative;	
	} 
	.project_list:first-child{
		margin-top: 0;
	}
	.item-active{
		background: #e4e8ea;
	}
	.project_list-time{
		display: flex;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 2px solid #f7f7f7;
	}
	.plan_day-icon{
		background: #7dc26d;
	}
	.project_list-detailTime p:first-child{
		font-size: 20px;
		color: #7dc26d;
	}
	.project_list-detailTime p:last-child{
		color: #999;
	}
	.project_list-approve{
		margin-top: 10px;
		overflow-x: auto;
		display: flex;
		justify-content: flex-start;
		width: 100%;
		padding-bottom: 5px;
	}
	.project_list-approve::scrollbar{
		height: 4px; 
	}
	.project_list-approve::-webkit-scrollbar { 
		height: 4px; 
	}
	.project_list-approvePeople{
		flex: 0 0 auto;
		margin-right: 20px;
		line-height: 35px;
	}
	.project_list-approvePeople > .avatar{
		width: 35px;
		border-radius: 50%;
	}
	.project_list-approvePeople > .name{
		font-weight: 400;
		margin-left: 5px;
	}
	.project_list-approvePeople > .checkDefault{
		margin-left: 5px;
		width: 15px;
		height: 15px;
	}
	.project_list-bottom{
		padding: 10px;
	}	
	.project_list-bottom img{
		display: inline-block;
	}
	.project-progress{
		position: absolute;
		background: #7dc26d;
		left: 0;
		bottom: 0;
		height: 3px;
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

export default {
	data () {
		return {
			projectList: [], // 项目列表
			currentPage: 1, // 当前页码
			totalPage: '', // 总页码
			// 是否还有未加载的计划列表，用以区分显示底部提示文字
			haveProjectData: false,
			projectId: '', // 正在查看项目的id
			scrollTop: '', // 最后一次列表滚动的距离
		}
	},
	created () {
		// 获取项目列表
		this.getProjectList(this.$store.state.userInfo.id, 1, 10, 'init');

		// 监听强制刷新列表事件
		this.$eventBus.$on('freshProjectList', event => {
			this.getProjectList(this.$store.state.userInfo.id, 1, 10, 'fresh');
		});
	},
	// keep-alive生命周期钩子 组件激活时调用
	activated () {
		if(this.projectList.length){
			// 列表滚动到上次查看的距离
			var projectContainer=document.getElementById('projectListContainer')
			projectContainer.scrollTop = this.scrollTop;
			// 跳转至项目详情界面				
			this.$router.push({
				path: '/home/project/detail'
			});
		}			
	},
	methods: {
		// 关闭浮层
		closeSelf () {
			this.$emit('closeSelf', 'off', 'project');
		},
		// 处理头像加载不出来
		errorImg (item) {
			item.worker.avatar = this.$store.state.avatarDefault;
		},
		// 监听计划列表滚动事件
		handleReportListScroll (event) {
			var containerScrollHeight = event.target.scrollHeight
			var containerClientHeight = event.target.clientHeight;
			var containerScrollTop = Math.round(event.target.scrollTop);

			if( containerClientHeight + containerScrollTop === 
			    containerScrollHeight || 
			    containerClientHeight + containerScrollTop === 
			    containerScrollHeight - 1){
				this.haveProjectData = true;
				if( this.currentPage < this.totalPage ){
					this.currentPage += 1;
					// 加载下一页数据
					this.getProjectList(this.$store.state.userInfo.id, 
									 this.currentPage, 10, 'nextPage');
				}else{
					this.haveProjectData = false;
				}
			}
		},
		// 添加项目进度条
		handleProgress () {
			var parentDOM = document.getElementsByClassName('project_list')[0];
			var parentWidth = window.getComputedStyle(parentDOM, null).width;
			parentWidth = parentWidth.slice(0, -2);
			this.projectList.map(item => {
				item.progressWidth = Math.round(parentWidth * 
									 (item.percentage / 100));
			});
		},
		// 获取项目列表
		getProjectList (workid, pageNo, pageSize, type) {
			var self = this;
			// 显示加载动画
			if(type !== 'nextPage'){
				self.$store.dispatch('showLoading');
			}				

			// 请求数据
			axios.getProjectList(workid, pageNo, 
			  pageSize, function(err, list, totalPage){
			  	// 隐藏加载动画
			  	self.$store.dispatch('hideLoading');
			  	if(err){
			  		swal(err);
			  		return;
			  	}
			  	// 扩展--格式化时间
			  	// 处理--处理审核人头像地址问题			  	
			  	list.forEach(item => {
			  		item.startDate = utils.formatTime(item.startDate, 1);
			  		item.endDate = utils.formatTime(item.endDate, 1);
			  		item.active = true;
			  		item.approvals.map(approvalsItem => {
			  			approvalsItem.worker.avatar = utils.handleAvatar(
			  				approvalsItem.worker.avatar);
			  			return approvalsItem;
			  		});
			  		// 增加项目进度条
			  		item.progressWidth = 0;
			  	});

			  	if(type === 'fresh' || type === 'init'){
			  		self.projectList = list;
			  		self.getProjectDetail(list[0].id, 'init');
			  	}else{
			  		self.projectList = [].concat(self.projectList, list);
			  	}				  	
			  	self.totalPage = totalPage;

			  	// 添加项目进度条
			  	// 在DOM更新完成之后才能执行操作
			  	self.$nextTick(() => {
			  		self.handleProgress();
			  	});		  	
			});
		},
		// 查看总结详情
		getProjectDetail (id, type) {
			var projectContainer=document.getElementById('projectListContainer')
			var containerScrollTop = Math.round(projectContainer.scrollTop);
			// 记录列表滚动的距离
			this.scrollTop = containerScrollTop;

			this.projectId = id;
			this.projectList.forEach(item => {
				if(item.id === id){
					item.active = true;
				}else{
					item.active = false;
				}
			});
			// 跳转至项目详情界面
			this.$router.push({
				path: '/home/project/detail'
			});

			if(type == 'init'){
				// 显示加载动画
				this.$store.dispatch('showLoading');					
				this.$nextTick(() => {
					this.$eventBus.$emit('getProjectDetail', {
						id: id
					});
				});
			}else{
				this.$eventBus.$emit('getProjectDetail', {
					id: id
				});	
			}			
		}
	}
}
</script>