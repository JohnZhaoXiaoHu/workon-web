<template lang="html">
<div class="project">
	<!-- head -->
	<div class="clearfix head">
		<img src="../../assets/Plan_msg.png">
		<p class="text-center">项目详情</p>
		<button class="btn btn-success"
				@click="createProject">
			新建项目
		</button>
	</div>
	<!-- detail -->
	<div class="clearfix detail">
		<p class="detail-code">
			编号：<span>{{code}}</span>
		</p> 
		<p class="detail-content">
			项目内容：<span>{{note}}</span>
		</p> 
		<div class="detail-time">
			<p>
				起止时间：<span>{{startDate}}-{{endDate}}</span>
			</p>
			<p>
				项目类型：<span>{{type}}</span>
			</p>
		</div>	
		<!-- 项目状态 -->
		<div class="detail-state">
			<div v-if="state == 0">
				<p>待审核</p>
			</div>
			<div v-if="state == 1">
				<p>审批中</p>
			</div>
			<div v-if="state == 2">
				<canvas id="detailState" width="100" height="100">
					<p>任务进度：{{percentage}}%</p>
				</canvas>
				<p>进行中</p>
			</div>
			<div v-if="state == -1">
				<p>审批不通过</p>
			</div>
		</div>
	</div>
	<!-- items -->
	<div class="items">
		<!-- 子任务标题 -->
		<div class="items-title">
			<p v-for="item in items"	
				:class="{'active': item.active}"
				@click="switchItem(item.id)">
				{{item.name ? item.name : '暂无'}}
			</p>
		</div>
		<!-- 子任务内容 -->
		<div class="items-content">
			<p>{{items[currentItemIndex].note}}</p>
			<p class="content-time">
				起止时间：
				<span>
					{{items[currentItemIndex].startDate}}
					-
					{{items[currentItemIndex].endDate}}
				</span>
			</p>
		</div>
		<!-- 工时 -->
		<div class="items-time">
			工时：<span>{{items[currentItemIndex].weight}}个工时</span>
		</div>
		<hr/>
		<!-- 指派人 -->
		<div class="items-person">
			指派人：
			<span>
				<img :src="items[currentItemIndex].worker.avatar" />
				<span>{{items[currentItemIndex].worker.name}}</span>
				<span class="item-status">{{items[currentItemIndex].status}}</span>
			</span>
		</div>
		<hr v-if="items[currentItemIndex].records.length" />
		<!-- 状态 -->
		<div class="items-state"
		     v-if="items[currentItemIndex].records.length">
			<div v-for="item in items[currentItemIndex].records">
				<img :src="item.worker.avatar" />
				<span>{{item.worker.name}}</span>
				<span class="items-state_status">{{item.statusText}}</span>
				<p>{{item.note}}</p>
			</div>
		</div>
	</div>
	<!-- 审核人 -->
	<h3 class="approvals_title">审核人</h3>
	<div class="approvals">
		<div class="approvals_item" v-for="item in approvals">
			<img class="avatar" :src="item.worker.avatar" />
			<span class="name">{{item.worker.name}}</span>
			<span class="opinion" v-if="item.note">{{item.note}}</span>
			<div class="state">
				<p>{{item.hierarchy}}级审批人</p>
				<!-- 待审核 -->
				<p class="pending" v-if="item.state === 0 || item.state === -1">
					<img src="../../assets/Sidebar_check.svg">
					<span>{{item.examine}}</span>
				</p>
				<!-- 已审核 -->
				<p class="complete" v-else>
					<img src="../../assets/Sidebar_checkIn.svg">
					<span>{{item.examine}}</span>
				</p>
			</div>
		</div>
	</div>
</div>	
</template>

<style scoped>
	p{
		margin: 0;
	}
	.head{
		height: 30px;
		padding: 0 15px;
		position: relative;
	}
	.head img{
		position: absolute;
		left: 0;
	}
	.head p{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 20px;
	}
	.head button{
		position: absolute;
		top: 0;
		right: 0;
		background: transparent;
		border-radius: 33px;
		border: 1px solid #84c575;
		color: #84c575;
	}
	.detail{
		background: white;
		border-radius: 10px;	
		padding:15px 200px 0 30px;
		margin-top: 30px;
		position: relative;
	}
	.detail p{
		font-size: 18px;
		color: #999;
		margin-bottom: 30px;
	}
	.detail p:last-child{
		margin-bottom: 0;
	}
	.detail span{
		font-size: 16px;
		color: #333;
	}
	.detail .detail-time{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.detail .detail-state{
		width: 100px;
		height: 120px;
		position: absolute;
		top: 10px;
		right: 20px;
		color: #7dc26d;
		font-size: 18px;
	}
	.detail .detail-state > div{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.detail .detail-state p{
		font-size: 14px;
		color: #9ccc6b;
	}
	.items{
		background: white;
		border-radius: 10px;	
		padding:25px 50px;
		margin-top: 30px;
	}
	.items-title{
		padding-left: 30px;
		display: flex;
		flex-wrap: wrap;
	}
	.items-title p{
		padding:0 20px 15px 20px;
		border-bottom: 3px solid transparent;
		font-size: 18px;
		margin-bottom: 10px;
		cursor: pointer;
	}
	.items-title .active{
		border-bottom: 3px solid #7dc26d;
	}
	.items-content{
		margin-top: 30px;
		height: 200px;
		background: #eeeeee;
		padding: 20px 30px;
		overflow-y: auto;
		line-height: 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.items-content .content-time{
		color: #999;
	}
	.items-time{
		margin-top: 30px;
		padding-left: 30px;
		color: #999;
	}
	.items-time span{
		margin-left: 40px;
	}
	.items-person{
		padding-left: 30px;
		color: #999;
	}
	.items-person > span{
		margin-left: 20px;
	}
	.items-person > span > img{
		margin-right: 10px;
	}
	.items-person img, .items-state img{
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
	.item-status{
		margin-left: 20px;
		color: #333;
	}
	.items-state{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.items-state div{
		padding-right: 10px;
		border-right: 2px solid #cfcfcf;
		margin-right: 20px;
		margin-bottom: 20px;
	}
	.items-state div:last-child{
		border-right: none;
	}
	.items-state img{
		transform: translateY(-3px);
	}
	.items-state p{
		margin-top: 5px;
	}
	.items-state_status{
		margin-left: 10px;
		color: red;
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
	}
	.approvals_item .state .pending{
		color: #999;
	}
	.approvals_item .state .complete{
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
import draw from '../../canvasUtil.js';

// 处理子任务状态
function handleItemStatus(projectState, itemState, itemCatalog){
	var status = '';

	if (projectState==2 && itemState==0 && itemCatalog==0) {
        status = "执行中";
    }else if (projectState==2 && itemState==1 && itemCatalog==2){
        status = "任务失败申请中";
    }else if (projectState==2 && itemState==2 && itemCatalog==2){
        status = "任务失败";
    }else if (projectState==2 && itemState==1 && itemCatalog==1){
        status = "任务完成申请中";
    }else if (projectState==2 && itemState==2 && itemCatalog==1){
        status = "任务完成";
    }else if (projectState==2 && itemState==0 && itemCatalog==-1){
        status = "任务待审核";
    }else if (projectState==2 && itemState==0 && itemCatalog==-2){
        status = "拒绝任务创建";
    }else{
    	status = "未知状态";
    }

    return status;
}

// 子任务处理结果
function handleItemRecord(recordState){
	var statusText = '';

	switch (recordState) {
        case 1:
            statusText = "申请完成任务";
            break;
        case 2:
            statusText = "同意完成任务";
            break;
        case 3:
            statusText = "拒绝完成任务";
            break;
        case 4:
            statusText = "申请任务失败";
            break;
        case 5:
            statusText = "同意任务失败";
            break;
        case 6:
            statusText = "拒绝任务失败";
            break;
        case 7:
            statusText = "同意添加此任务";
            break;
        case 8:
            statusText = "拒绝添加此任务";
            break;
        default:
        	statusText = '未知处理结果';
            break;
    }

    return statusText;
}

// 清除所有任务进度定时器
var clearAllTimeouts = null;

export default {
	data () {
		return {
			currentItemIndex: 0, // 当前显示的子任务索引
			code: '', // 项目编号
			note: '', // 项目内容
			state: '', // 项目状态
			percentage: 0, // 任务进度
			startDate: '', // 开始时间
			endDate: '', // 结束时间
			type: '', // 项目类型
			items: [], // 子任务
			approvals: [], // 审核人列表
		}
	},
	mounted () {		
		// 监听 Sidebar-project 获取项目详情事件
		this.$eventBus.$on('getProjectDetail', event => {
			this.getProjectDetail(event.id);			
		});		
	},
	methods: {
		// 新建项目
		createProject () {
			this.$router.push('/home/project/create');
		},
		// 切换显示子任务
		switchItem (id) {
			this.items.forEach((item, index) => {
				if(item.id == id){
					this.currentItemIndex = index;
					item.active = true;
				}else{
					item.active = false;
				}
			});
		},
		// 获取项目详情
		getProjectDetail (id) {
			// 显示加载动画
			this.$store.dispatch('showLoading');

			// 清除所有任务进度定时器
			if(clearAllTimeouts){
				clearAllTimeouts();
			}

			axios.getProjectDetail(id, (err, data) => {
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
				if(err){
					swal(err);
					return;
				}

				// 处理字段
				this.code = data.code;
				this.note = data.note;	
				this.state = data.state;
				this.percentage = data.percentage;
				this.startDate = utils.formatTime(data.startDate, 1);
				this.endDate = utils.formatTime(data.endDate, 1);
				
				switch(data.type){
					case 'workinghours':
					this.type = '工时';
					break;
					case 'money':
					this.type = '资金';
					break;
					case 'priority':
					this.type = '重要度';
					break;
				}

				this.items = data.items;
				this.items.map(item => {
					item.startDate = utils.formatTime(item.startDate, 1);
					item.endDate = utils.formatTime(item.endDate, 1);
					item.worker.avatar = utils.handleAvatar(item.worker.avatar);
					// 新增是否当前显示字段
					item.active = false;
					// 新增子任务状态
					item.status = handleItemStatus(data.state, item.state, 
									item.catalog);
					item.records.map(recordItem => {
						recordItem.worker.avatar = utils.handleAvatar(recordItem.worker.avatar);
						recordItem.statusText = handleItemRecord(recordItem.state);
						return recordItem;
					});
				});
				this.items[0].active = true;						

				this.approvals = data.records;
				this.approvals.map(item => {
					// 初始化审核流程为空
					item.examine = '';
					item.worker.avatar = utils.handleAvatar(item.worker.avatar);
					switch(item.state){
						case 0, -1:
						item.examine = '待审批';
						break;
						case 1:
						item.examine = '已审批';
						break;
					}
					return item;
				});

				this.$nextTick(() => {
					if(this.state == 2){
						// 渲染任务进度动画
						var progressCircle = new draw({
							elementId: 'detailState',
							percent: this.percentage,
							radius: 35,
							lineWidth: 7,
							circleStrokeStyle: '#d7dfe0',
							progressStrokeStyle: '#70abaa',
							fontSize: 16
						});
						progressCircle.animateLoading();
						clearAllTimeouts = progressCircle.clearAllTimeouts;
					}					
				});
			});
		}
	}
}
</script>