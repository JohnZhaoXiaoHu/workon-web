<template lang="html">
<div class="project">
	<h3 class="text-center">新建项目</h3>
	<!-- 项目编号和项目内容 -->
	<div class="project-info">
		<el-input v-model="projectCode" 
				  class="project-code"
				  placeholder="项目编号"></el-input>
		<el-input
		  type="textarea"
		  class="project-content"
		  :rows="4"
		  placeholder="项目内容"
		  v-model="projectContent"> </el-input>
	</div>
	<!-- 项目详情 -->
	<div class="project-detail">
		<h4 class="text-center">起止时间</h4>
		<!-- 起止时间 -->
		<div class="project-time">
			<label>开始时间</label>
			<el-date-picker
			      v-model="startDate"
			      @change="startDateChange"
			      type="datetime"></el-date-picker>
			<label>结束时间</label>
			<el-date-picker
			      v-model="endDate"
			      @change="endDateChange"
			      type="datetime"></el-date-picker>
		</div>
		<!-- 项目类型 -->
		<div class="project-type">
			<h4 class="text-center">项目类型</h4>
			<div class="type">
				<div v-for="(item, index) in typeList"
					 :class="{active: item.active}"
					 @click="switchType(index)">
					 {{item.name}}
				</div>
			</div>
		</div>
		<!-- 添加子任务 -->
		<div class="project-item">
			<p class="text-center" @click="createItem">
				添加子任务 >>
			</p>
		</div>
		<!-- 子任务列表 -->
		<ul class="childItemsList" v-if="childItems.length">
			<li class="childItem"
				v-for="childItem in childItems">
				<span>{{childItem.name}}</span>
				<span>{{childItem.weight}}</span>
			</li>
		</ul>
		<!-- 审核人 -->
		<div class="project-approvals">
			<h4 class="text-center">审核人</h4>
			<div class="approvals">
				<button class="btn btn-success"
						@click="addApprovals">
					新增
				</button>
				<div class="approvals-list">	
					<div class="text-center approvals-item"
						 v-for="item in approvals"
						 @click="deleteApproval(item)">
						<img :src="item.avatar" 
							 @error="errorImg(item)" />
						<p>{{item.name}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 提交 -->
	<button class="btn btn-success submit-btn"
			:disabled="!submitBtnState"
			@click="submitInfo">
		提&nbsp;交
	</button>
</div>
</template>

<style scoped>
	.project-info, .project-detail{
		background: white;
		border-radius: 10px;	
		padding:15px;
		margin-top: 30px;
	}
	.project-code{
		width: 30%;
		display: block;
	}
	.project-content{
		width: 60%;
		margin-top: 20px;
	}
	.project-detail .project-time{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30px;
	}
	.project-detail .project-time > label{
		font-weight: normal;
		margin-left: 40px;
		margin-right: 20px;
		margin-bottom: 0;
	}
	.project-detail .project-time > label:first-child{
		margin-left: 0;
	}
	.project-type{
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.project-type .type{
		margin-top: 10px;
		width: 80%;
		display: flex;
		justify-content: space-between;
	}
	.project-type .type > div{
		margin-left: 20px;
		width: 130px;
		height: 40px;
		line-height: 40px;
		border: 1px solid #cfcfcf;
		border-radius: 20px;
		text-align: center;
		cursor: pointer;
	}
	.project-type .type .active{
		border: 1px solid #9ccc6b;
		color: #9ccc6b;
	}
	.project-type .type > div:first-child{
		margin-left: 0;
	}
	.project-item{
		width: 80%;
		height: 40px;
		margin: 40px auto 0 auto;
		line-height: 40px;
		border: 1px solid #cfcfcf;
		border-left: none;
		border-right: none;
		color: #9ccc6b;
		cursor: pointer;
	}
	.childItemsList{
		width: 80%;
		margin: 0px auto 0 auto;
		padding: 10px 0;
		border-bottom: 1px solid #cfcfcf;
	}
	.childItemsList .childItem{
		padding: 10px 30px;
		display: flex;
		justify-content: space-between;	
		cursor: pointer;	
	}
	.childItemsList .childItem:hover{
		background: #f8f8f8;
	}
	.project-approvals{
		margin-top: 40px;	
	}
	.project-approvals .approvals{
		width: 40%;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0 20px 0;
	}
	.project-approvals .approvals > button{
		width: 90px;
		background: transparent;
		border-radius: 33px;
		border: 1px solid #84c575;
		color: #84c575;
	}
	.approvals-item{
		display: inline-block;
		margin-left: 20px;
		cursor: pointer;
	}
	.approvals-item img{
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}
	.approvals-item p{
		margin: 0;
		font-size: 12px;
		color: #999;
	}
	.submit-btn{
		display: block;
		width: 400px;
		height: 40px;
		border-radius: 20px;
		margin: 30px auto 0 auto;
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

export default{
	data () {
		return {
			projectCode: '', // 项目编号
			projectContent: '', // 项目内容
			startDate: '', // 项目开始时间
			endDate: '', // 项目结束时间
			// 项目类型列表 
			typeList: [
				{
					name: '资金',
					active: false
				},
				{
					name: '工时',
					active: true
				},
				{
					name: '重要度',
					active: false
				}
			],
			curType: 'workinghours', // 选择的项目类型
			approvals: [], // 审核人列表
			childItems: [], // 子任务
		}
	},
	mounted () {
		// 监听增加审核人事件
		// event => id, avatar, name
		this.$eventBus.$on('addProjectApprovals', event => {
			this.approvals.push({
				id: event.id,
				avatar: event.avatar,
				name: event.name
			});
		});
	},
	activated () {
		if(this.$route.query.items){
			this.childItems = this.childItems.concat(this.$route.query.items);
		}
	},
	computed: {
		submitBtnState (){
			if( !this.projectCode || !this.projectContent ||
				!this.startDate || !this.endDate ||
				!this.approvals.length ){
				return false;
			}else{
				return true;
			}
		}
	}, 
	methods: {
		// 处理审核人头像加载不出来
		errorImg (item) {
			item.avatar = this.$store.state.avatarDefault;
		},
		// 监听项目开始时间的改变
		startDateChange (date){
			var startDate = Date.parse(date);
			var endDate = Date.parse(this.endDate);
			if(endDate && startDate > endDate){
				swal({
					title: '项目开始时间不能晚于结束时间！',
					type: 'warning'
				});
				// 置空
				this.startDate = '';
			}
		},
		// 监听项目结束时间的改变
		endDateChange (date){
			var endDate = Date.parse(date);
			var startDate = Date.parse(this.startDate);
			if(startDate && endDate < startDate){
				swal({
					title: '项目结束时间不能早于开始时间！',
					type: 'warning'
				});
				// 置空
				this.endDate = '';
			}
		},
		// 更改项目类型
		switchType (curIndex){
			if(this.childItems.length){
				swal({
					title: '已有子任务不可更改项目类型！',
					type: 'warning'
				});
				return;
			}

			this.typeList.map((item, index) => {
				if(index == curIndex){
					item.active = true;
					switch(item.name){
						case '资金':
						this.curType = 'money';
						break;
						case '工时':
						this.curType = 'workinghours';
						break;
						case '重要度':
						this.curType = 'priority';
						break;
					}					
				}else{
					item.active = false;
				}
				return item;
			});	
		},
		// 增加项目审核人
		addApprovals () {
			// 打开 侧边栏--审核人 组件
			this.$emit('selectApproval', 'on', 'projectApproval');
		},
		// 删除项目审核人
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
		},
		// 添加子任务
		createItem () {
			if(!this.startDate || !this.endDate){
				swal({
					title: '项目起止时间不能为空！',
					type: 'warning'
				});
				return;
			}

			// 关闭侧边栏--审核人 组件
			this.$emit('selectApproval', 'off', 'projectApproval');

			this.$router.push({ 
				path: '/home/project/createItem', 
				query: { 
					projectType: this.curType,
					startDate: Date.parse(this.startDate),
					endDate: Date.parse(this.endDate)
				}
			});
		},
		// 提交信息
		submitInfo () {
			// 显示加载动画
			this.$store.dispatch('showLoading');

			var approvers = [];
			this.approvals.forEach((item, index) => {
				approvers.push({
					uid: item.id,
					hierarchy: index + 1
				});
			});

			var params = {
				end: Date.parse(this.endDate),
				note: this.projectContent,
				start: Date.parse(this.startDate),
				code: this.projectCode,
				workerid: this.$store.state.userInfo.id,
				approvers: approvers,
				type: this.curType,
				items: this.childItems
			};
			
			// 提交给后台
			axios.createProject(params, (err, data) => {
				// 显示加载动画
				this.$store.dispatch('hideLoading');

				if(err){
					swal({
						title: err,
						type: 'warning'
					});
					return;
				}

				swal("提交成功!", "success");

				// 关闭侧边栏--审核人 组件
				this.$emit('selectApproval', 'off', 'projectApproval');

				// 强制刷新侧边栏项目列表
				this.$eventBus.$emit('freshProjectList');

				// 打开侧边栏--项目列表
				this.$emit('selectModule', 'on', 'project');
			});
		}
 	}
}
</script>