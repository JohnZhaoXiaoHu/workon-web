<template lang="html">
<div class="plan">
	<!-- head -->
	<div class="clearfix head">
		<img class="pull-left" src="../../assets/Plan_msg.png">
	</div>
	<!-- title -->
	<h2 class="text-center title">新建工作计划</h2>
	<!-- 时间 -->
	<div class="time">
		<p v-for="(item, index) in timeRange" 
		   :class="{active: item.active}" 
		   @click="switchDay(index)">
			{{item.name}}
		</p>
	</div>
	<!-- 文本框 -->
	<div class="fill">
		<div v-for="item in contentArr">
			<!-- 日期 -->
			<p class="date" v-show="item.active">
				{{item.formatDate}}
			</p>
			<!-- 内容 -->
			<el-input 
			 type="textarea"
	  		 :rows="8"
	  		 placeholder="请输入内容"
	  		 v-show="item.active"
	  		 v-model="item.content"></el-input>
		</div>
	</div>
	<!-- 提交按钮 -->
	<button class="text-center btn btn-success btn-block submit"
			@click="submitPlan">
		提交
	</button>
</div>
</template>

<style scoped="scoped">
	.head{
		padding: 0 15px 0 0px;
	}
	.title{
		margin-top: 20px;
		font-size: 20px;
	}
	.time{
		height: 100px;
		background: white;
		border-radius: 10px;
		padding:0 30px;
		margin-top: 20px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.time p{
		margin: 0;
		font-size: 18px;
		padding: 0 20px 20px 20px;		
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}
	.time .active{
		border-bottom: 2px solid #2cb2d6;
	}
	.fill{
		min-height: 400px;
		background: white;
		border-radius: 10px;
		padding:30px;
		margin-top: 20px;
	}
	.fill .date{
		font-size: 14px;
		color: #999;
	}
	.fill .content{
		font-size: 16px;
	}
	.submit{
		margin-top: 30px;
		border-radius: 34px;
		width: 350px;
		margin-left: 50%;
		transform: translateX(-50%);
		padding: 10px 0;
		box-shadow: 0px 7px 8px 1px rgba(125, 194, 109, 0.3);
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

/**
 * [timeFormat 日期转换，该方法有坑]
 * @param  {[Date Obejct]} startTime [开始时间]
 * @param  {[Date Obejct]} endTime   [结束时间]
 * @return {[Array]}           		 [日期范围数组]
 */
function timeFormat(startTime, endTime){
	var metaArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	var startDate = startTime.getDate();
	var resultArr = [];
	var tempDate = new Date(startTime.getFullYear(), 
						    startTime.getMonth(),
						    startTime.getDate());
	var intervalDay = (Date.parse(endTime) - Date.parse(startTime)) /
				      (1000*3600*24) + 1;

	for(let i = 0; i < intervalDay; i++){
		var dayObj = new Date(tempDate.setDate(startDate) + (1000*3600*24*i));
		resultArr.push({
			name: metaArr[dayObj.getDay()],
			date: dayObj,
			formatDate: utils.formatTime(Date.parse(dayObj), 3),
			active: false
		});
	}
	resultArr[0].active = true;

	return resultArr;
}

export default {
	data () {
		return {
			// 计划日期范围
			timeRange: [],
			type: '', // 计划类型  周报/日报
			startTime: '', // 开始时间
			endTime: '', // 结束时间
			approvals: [], // 审核人列表
		}
	},
	activated () {
		this.type = this.$route.query.type;
		this.startTime = this.$route.query.startTime;
		this.endTime = this.$route.query.endTime;
		this.approvals = this.$route.query.approvals;

		if(!this.type || !this.startTime || !this.endTime || !this.approvals){
			// 跳转回新增选日期页面
			this.$router.push('/home/plan/create');
			return;
		}
		// 初始化时间范围
		this.timeRange = timeFormat(this.startTime, this.endTime);
	},
	computed: {
		// 计划内容数组
		contentArr () {
			var tempArr = [];
			this.timeRange.forEach(item => {
				tempArr.push(Object.assign(item, {content: ''}));
			});	
			return tempArr;
		}
	},	
	methods: {
		// 切换日期
		switchDay (index) {
			this.timeRange.forEach(item => item.active = false);
			this.contentArr.forEach(item => item.active = false);
			this.timeRange[index].active = true;
			this.contentArr[index].active = true;
		},
		// 提交工作计划
		submitPlan () {
			// 显示加载动画
			this.$store.dispatch('showLoading');

			// 获取员工id
			var workerid = this.$store.state.userInfo.id;
			// 获取计划详情
			var days = [];			
			this.contentArr.forEach(item => {
				days.push({
					"workerid": workerid,
					"star": Date.parse(item.date),
					"end": Date.parse(item.date),
					"note": item.content,
					"endProperty": 0
				});
			});
			// 获取审核人列表
			var approvals = [];
			this.approvals.forEach((item, index) => {
				approvals.push({
					"uid": item.id,
					"hierarchy": index + 1
				});
			});
			// 获取计划类型
			var catalog = this.type == '周报' ? 1 : 0;

			var params = {
				"star" : Date.parse(this.startTime),
				"end" : Date.parse(this.endTime),
				"days" : days, // 计划详情
				"note" : "",
				"workerid" : workerid, // 员工id
				// 审核人
				"approvers" : approvals,
				"endProperty" : 0,
				// 计划类别 	0:日报 1:周报
				"catalog" : catalog
			};
			
			axios.submitPlan(params, (err, data) => {
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
				
				if(err){
					swal(err);
					return;
				}
				swal('工作计划提交成功！');

				// 打开侧边栏--工作计划
				this.$emit('selectModule', 'on', 'plan');
				// 触发强制刷新工作计划列表事件
				this.$eventBus.$emit('freshPlanList', {});
			});
		}
	}
}
</script>