<template lang="html">
<div class="plan">
	<!-- head -->
	<div class="clearfix head">
		<img class="pull-left" src="../../assets/Plan_msg.png">
	</div>
	<!-- title -->
	<h2 class="text-center title">新建工作总结</h2>
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
			@click="submitReport">
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
	var startDate = startTime.getDate();
	var tempDate = new Date(startTime.getFullYear(), 
						    startTime.getMonth(),
						    startDate);
	// 间隔时间
	var intervalDay = (Date.parse(endTime) - Date.parse(startTime)) /
				      (1000*3600*24) + 1;
	// 结果数组
	var resultArr = [];

	for(let i = 0; i < intervalDay; i++){
		var dayStamp = tempDate.setDate(startDate) + (1000*3600*24*i);
		resultArr.push({
			name: utils.formatTimeToWeek(dayStamp),
			date: new Date(dayStamp),
			formatDate: utils.formatTime(dayStamp, 3),
			active: false
		});
	}
	resultArr[0].active = true;

	return resultArr;
}

export default {
	data () {
		return {
			timeRange: [], // 总结日期范围
			contentArr: [], // 总结内容数组
			startTime: '', // 开始时间
			endTime: '', // 结束时间
			approvals: [], // 审核人列表
		}
	},
	activated () {
		this.startTime = this.$route.query.startTime;
		this.endTime = this.$route.query.endTime;
		this.approvals = this.$route.query.approvals;

		if(!this.startTime || !this.endTime || !this.approvals){
			// 跳转回新增选日期页面
			this.$router.push('/home/report/create');
			return;
		}
		// 初始化时间范围
		this.timeRange = timeFormat(this.startTime, this.endTime);
		// 初始化内容数组
		this.contentArr.length = 0;
		this.timeRange.forEach(item => {
			this.contentArr.push(Object.assign({}, item, {content: ''}));
		});
		// 获取该时间段内的工作计划
		this.getPeroidPlan(this.$store.state.userInfo.id, 
		  Date.parse(this.startTime), 
		  Date.parse(this.endTime));			
	},
	methods: {
		// 切换日期
		switchDay (index) {
			this.timeRange.forEach(item => item.active = false);
			this.contentArr.forEach(item => item.active = false);
			this.timeRange[index].active = true;
			this.contentArr[index].active = true;
		},
		// 提交工作总结
		submitReport () {
			// 显示加载动画
			this.$store.dispatch('showLoading');

			// 获取员工id
			var workerid = this.$store.state.userInfo.id;
			// 获取总结详情
			var days = [];			
			this.contentArr.forEach(item => {
				days.push({
					"dayDate": Date.parse(item.date),
					"note": item.content
				});
			});
			// 获取审核人列表
			var approvals = [];
			this.approvals.forEach((item, index) => {
				approvals.push({
					"id": item.id
				});
			});

			var params = {
				"workers": approvals, // 审核人
				"startDate" : Date.parse(this.startTime),
				"endDate" : Date.parse(this.endTime),
				"worker" : workerid, // 员工id
				"days" : days // 总结详情
			};
			
			axios.submitReport(params, (err, data) => {
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
				
				if(err){
					swal(err);
					return;
				}
				swal('工作总结提交成功！');

				// 打开侧边栏--工作总结
				this.$emit('selectModule', 'on', 'report');
				// 触发强制刷新工作总结列表事件
				this.$eventBus.$emit('freshReportList', {});
			});
		},
		// 获取某个时间段的工作计划
		getPeroidPlan (uid, from, to){
			// 显示加载动画
			this.$store.dispatch('showLoading');
			axios.getPeroidPlan(uid, from, to, (err, data) => {
				// 隐藏加载动画
				this.$store.dispatch('hideLoading');
				if(err){
					swal(err);
					return;
				}
				data.list.forEach((item, index) => {
					item.week = utils.formatTimeToWeek(item.star);
					item.star = utils.formatTime(item.star, 2);
					item.end = utils.formatTime(item.end, 2);
					this.contentArr[index].content = item.note;
				});				
			});
		}
	}
}
</script>