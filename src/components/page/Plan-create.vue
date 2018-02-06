<template lang="html">
<div class="plan">
	<!-- head -->
	<div class="clearfix head">
		<img class="pull-left" src="../../assets/Plan_msg.png">
	</div>
	<!-- title -->
	<h2 class="text-center title">新建工作计划</h2>
	<!-- 周报类型 -->
	<div class="type">
		<p :class="{active: type == '周报'}" 
		   @click="switchType('周报')">
			周报
		</p>
		<p :class="{active: type == '日报'}" 
		   @click="switchType('日报')">
		   日报
		</p>
	</div>
	<!-- 选择时间和审核人 -->
	<div class="time">
		<h2 class="text-center">起止时间</h2>
		<div class="time-picker">
			<span>开始时间</span>
			<el-date-picker
			      v-model="startTime"
			      type="date"
			      @change="startTimeChange">
			</el-date-picker>
		</div>
		<div class="time-picker">
			<span>结束时间</span>
			<el-date-picker
			      v-model="endTime"
			      type="date"
			      @change="endTimeChange">
			</el-date-picker>
		</div>
		<h2 class="text-center approvals-title">审核人</h2>
		<div class="approvals">
			<button class="btn btn-success btn-sm"
					@click="addApprovals">
				新增
			</button>
			<div class="approvals-list">	
				<div class="text-center approvals-item"
					 v-for="item in approvals"
					 @click="deleteApproval(item)">
					<img :src="item.avatar" @error="errorImg(item)" />
					<p>{{item.name}}</p>
				</div>
			</div>
		</div>
	</div>
	<!-- 下一步按钮 -->
	<button class="text-center btn btn-success btn-block next-step"
			@click="nextStep">
		下一步
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
	.type{
		height: 100px;
		background: white;
		border-radius: 10px;
		padding:0 30px;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.type p{
		margin: 0;
		font-size: 18px;
		padding: 0 20px 20px 20px;		
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}
	.type .active{
		border-bottom: 2px solid #2cb2d6;
	}
	.type p:first-child{
		margin-right: 180px;
	}
	.time{
		background: white;
		border-radius: 10px;
		padding:30px;
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.time h2{
		font-size: 16px;	
	}
	.el-date-table tbody tr:first-child{
		transform: translateX(10px) !important;
	}
	.time-picker{
		margin-top: 20px;
	}
	.time-picker:last-child{
		margin-top: 40px;
	}
	.time-picker span{
		font-size: 12px;
		margin-right: 30px;
		display: inline-block;
		-moz-transform: translateY(-15px);
		color: #999;
	}
	.approvals-title{
		margin-top: 50px;
	}
	.approvals{
		width: 432px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0 20px 0;
	}
	.approvals button{
		width: 90px;
		background: transparent;
		border-radius: 33px;
		border: 2px solid #84c575;
		color: #84c575;
	}
	.approvals .approvals-list .approvals-item{
		display: inline-block;
		margin-left: 20px;
		cursor: pointer;
	}
	.approvals .approvals-list img{
		width: 35px;
		height: 35px;
		border-radius: 50%;		
	}
	.approvals .approvals-list p{
		margin: 0;
		font-size: 12px;
		color: #999;		
	}
	.next-step{
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

export default {
	data () {
		return {
			type: '周报', // 工作计划类型
			startTime: '', // 开始时间
			endTime: '', // 结束时间
			approvals: [], // 审核人列表
		}
	},
	mounted () {
		// 监听增加审核人事件
		// event => id, avatar, name
		this.$eventBus.$on('addPlanApprovals', event => {
			this.approvals.push({
				id: event.id,
				avatar: event.avatar,
				name: event.name
			});
		});
	},
	methods: {
		// 处理头像加载不出来
		errorImg (item) {
			item.avatar = this.$store.state.avatarDefault;
		},
		// 选择计划类型
		switchType (type) {
			this.type = type;
		},
		// 开始时间选择
		startTimeChange (val) {	
			this.endTime = new Date(this.startTime.getFullYear(),
									this.startTime.getMonth(),
									this.startTime.getDate());
			var date = this.startTime.getDate();

			if(this.type == '周报'){												
				// 结束时间默认推迟六天
				this.endTime.setDate(date + 5); 
			}else if(this.type == '日报'){
				this.endTime.setDate(date);
			}
		},
		// 结束时间选择
		endTimeChange (val) {
			if(this.type == '日报'){
				this.startTime = new Date(this.endTime.getFullYear(),
										this.endTime.getMonth(),
										this.endTime.getDate());	
				var date = this.endTime.getDate();
				this.startTime.setDate(date);
			}			
		},
		// 下一步点击事件
		nextStep () {
			if(!this.startTime){
				swal('请选择开始时间！');
				return;
			}
			if(!this.endTime){
				swal('请选择结束时间！');
				return;
			}
			if(!this.approvals){
				swal('请选择审核人！');
				return;
			}

			// 跳转到填写界面
			this.$router.push({
				path: '/home/plan/fill',
				query: {
					type: this.type,
					startTime: this.startTime,
					endTime: this.endTime,
					approvals: this.approvals
				}
			});
			// 关闭 侧边栏--审核人 组件
			this.$emit('selectApproval', 'off', 'planApproval');
		},
		// 增加审核人
		addApprovals () {
			// 打开 侧边栏--审核人 组件
			this.$emit('selectApproval', 'on', 'planApproval');
		},
		// 删除审核人
		deleteApproval (item) {
			swal({   
				title: "提示",   
				text: "确定要删除该审核人吗？",   
				type: "warning",   
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "确定",   
				cancelButtonText: "再考虑一下",  
				closeOnConfirm: true 
			}, () => {
				this.approvals.some((arrItem, index, arr) => {
					if(item === arrItem){
						arr.splice(index, 1);
						return true;
					}
				});
			});
		}
	}
}
</script>