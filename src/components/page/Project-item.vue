<template lang="html">
<div class="project">
	<div class="backIcon" @click="backLast">
		<img src="../../assets/Project-item_backIcon.svg" />
		<span>返回</span>
	</div>
	<h3 class="text-center">新建子任务</h3>
	<!-- 子任务标题 -->
	<div class="project-title">
		<span v-for="(item, index) in titleList" 
			  :class="{'title-active': item.active}"
			  @click="switchItem(index)">
			{{item.name}}
		</span>
		<p class="pull-right deleteBtn" 
		   @click="deleteProjectItem">删除</p>
		<p class="pull-right" 
		   @click="addProjectItem">新增</p>
	</div>
	<div v-for="(item, index) in projectList"
		 v-show="item.active">
		<!-- 子任务内容 -->
		<div class="project-content">
			<el-input
			  type="textarea"
			  class="content"
			  :rows="4"
			  v-model="item.note"
			  placeholder="任务内容..."> </el-input>
		</div>
		<!-- 子任务详情 -->
		<div class="project-detail">
			<h4 class="text-center">起止时间</h4>
			<!-- 起止时间 -->
			<div class="project-time">
				<label>开始时间</label>
				<el-date-picker
					v-model="item.startDate"
					@change="itemStartDate"
				    type="datetime"></el-date-picker>
				<label>结束时间</label>
				<el-date-picker
					v-model="item.endDate"
					@change="itemEndDate"
				    type="datetime"></el-date-picker>
			</div>
			<!-- 任务量度 -->
			<div class="project-measure">
				<h4 class="text-center" v-if="type == 'workinghours'">
					任务工时
				</h4>
				<h4 class="text-center" v-if="type == 'money'">
					任务资金
				</h4>
				<h4 class="text-center" v-if="type == 'priority'">
					重要度
				</h4>
				<el-input class="measure" 
						  v-model="item.weight"
						  @change="handleMessureInput">
				</el-input>
				<div class="messureTips" 
					 v-if="showInputTips">
					<i class="el-icon-information"></i>
					<span>只能输入数字！</span>
				</div>
			</div>
			<!-- 指派人 -->
			<div class="project-appointed">
				<h4 class="text-center">指派人</h4>
				<div class="addBtn"
					v-if="!item.workid"
					@click="addAppointed">
					添加
				</div>
				<div class="approval" v-if="item.workid"
				     @click="deleteApproval(index)">
					<img :src="item.approval.avatar" @error="errorImg(item)" />
					<p>{{item.approval.name}}</p>
				</div>
			</div>
		</div>
	</div>
	<!-- 提交 -->
	<button class="btn btn-success submit-btn"
			@click="submitInfo" :disabled="!submitBtnState">
		提&nbsp;交
	</button>
</div>
</template>

<style scoped="scoped">
	.project > h3{
		margin: 0;
	}
	.backIcon{
		position: absolute;
		top: 17px;
		left: 15px;
		cursor: pointer;
	}
	.backIcon img{
		width: 25px;
		margin-right: 5px;
	}
	.project-title{
		background: white;
		border-radius: 10px;	
		padding: 0px 30px;
		margin-top: 30px;
		line-height: 66px;
	}
	.project-title > span{
		font-size: 18px;
		margin-right: 50px;
		padding: 0 30px 20px 7px;
		border-bottom: 3px solid transparent;
		cursor: pointer;
	}
	.project-title > .title-active{
		border-bottom: 3px solid #9ccc6b;
	}
	.project-title > p{
		color: #9ccc6b;
		cursor: pointer;
	}
	.project-title .deleteBtn{
		color: red;
		margin-left: 10px;
	}
	.project-content{
		background: white;
		border-radius: 10px;	
		margin-top: 30px;
		line-height: 66px;
		padding: 20px 30px;
	}
	.project-detail{
		background: white;
		border-radius: 10px;	
		padding: 50px 30px;
		margin-top: 30px;
	}
	.project-time{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30px;
	}
	.project-time > label{
		font-weight: normal;
		margin-left: 40px;
		margin-right: 20px;
		margin-bottom: 0;
	}
	.project-time > label:first-child{
		margin-left: 0;
	}
	.project-measure, .project-appointed{
		margin-top: 50px;
	}
	.project-measure .measure{
		margin-top: 20px;
	}
	.messureTips{
		margin-top: 10px;
		font-size: 14px;
		color: #999;
	}
	.messureTips i{
		color: #ff4a4a;
	}
	.project-appointed .addBtn{
		width: 70px;
		height: 30px;
		border-radius: 15px;
		color: #9ccc6b;
		border: 1px solid #9ccc6b;
		text-align: center;
		line-height: 30px;
		margin: 20px auto 0 auto;
		cursor: pointer;
	}
	.project-appointed .approval{
		margin: 20px auto 0 auto;
		cursor: pointer;
	}
	.approval{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.approval img{
		width: 35px;
		height: 35px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.approval p{
		margin: 0;
	}
	.submit-btn{
		display: block;
		width: 50%;
		height: 40px;
		border-radius: 20px;
		margin: 30px auto 0 auto;
	}
</style>

<script>
import axios from '../../axios.js';
import utils from '../../utils.js';

// 输入子任务名称
function inputName(callback){
	// 弹出填写任务名称模态框
	swal({   
		title: "新增任务",   
		text: "任务名称不能超过五个字",   
		type: "input",    
		closeOnConfirm: false,   
		animation: "slide-from-top",   
		inputPlaceholder: "请输入任务名称" 
	}, (inputValue) => {         
		if (inputValue === "") {     
			swal.showInputError("任务名称必须输入！");     
			return false;   
		}else if(inputValue.length > 5){
			swal.showInputError("任务名称不能超过五个字！");     
			return false;   
		}else{
			swal("Nice!", "任务名称: " + inputValue, "success");
			callback(inputValue);
		}     
	});
}

// 初始化
function init(vue){
	vue.type = '';
	vue.curIndex = 0;
	vue.showInputTips = false;
	vue.titleList = [].concat({
		name: '任务一',
		active: true
	});
	vue.projectList = [].concat({
		active: true, // 是否显示
		name: '任务一', // 子任务名称
		note: '', // 子任务内容
		startDate: '', // 开始时间
		endDate: '', // 结束时间
		weight: '', // 任务量度
		workid: '', // 指派人
		approval: {
			avatar: '',
			name: ''
		}
	});
}

export default {
	data () {
		return {
			type: '', // 项目类型
			projectStartDate: '', // 项目开始时间
			projectEndDate: '', // 项目结束时间
			curIndex: 0, // 当前显示的子项目索引
			// 子任务标题列表
			titleList: [], 
			// 子任务列表
			projectList: [], 
			showInputTips: false, // 是否显示输入提示
		}
	},
	mounted () {
		// event => id, avat监听增加审核人事件ar, name
		this.$eventBus.$on('addChildProjectApprovals', event => {
			this.projectList[this.curIndex].workid = event.id;
			this.projectList[this.curIndex].approval.avatar = event.avatar;
			this.projectList[this.curIndex].approval.name = event.name;
		});
		// 初始化组件
		init(this);
	},
	activated () {
		this.type = this.$route.query.projectType;
		this.projectStartDate = this.$route.query.startDate;
		this.projectEndDate = this.$route.query.endDate;
		// 输入子任务名称
		inputName((value) => {
			this.titleList[0].name = value;
			this.projectList[0].name = value;
		});
	},
	computed: {
		// 提交按钮状态
		submitBtnState () {
			var result = false;
			// 对提交数据的检验
			this.projectList.forEach(item => {
				if(!item.startDate || !item.endDate || 
					!item.workid || !item.note || !Number(item.weight)){
					result = false;
				}else{
					result = true;
				}
			});
			return result;
		}
	},
	methods: {
		// 返回上一级
		backLast () {
			// 关闭 侧边栏--审核人 组件
			this.$emit('selectApproval', 'off', 'childProjectApproval');
			this.$router.go(-1);
		},
		// 处理指派人头像加载不出来
		errorImg (item) {
			item.approval.avatar = this.$store.state.avatarDefault;
		},
		// 处理任务量度输入
		handleMessureInput (value) {
			if(!Number(value)){
				this.showInputTips = true;
			}else{
				this.showInputTips = false;
			}			
		},
		// 监听子任务开始时间的变化
		itemStartDate (date){
			var startDate = Date.parse(date);
			var endDate = Date.parse(this.projectList[this.curIndex].endDate);

			if(startDate < this.projectStartDate){
				swal({
					title: '子任务开始时间不能早于项目开始时间！',
					type: 'warning'
				});
				// 置空
				this.projectList[this.curIndex].startDate = '';
			}else if(endDate && startDate > endDate){
				swal({
					title: '子任务的开始时间不能晚于结束时间！',
					type: 'warning'
				});
				// 置空
				this.projectList[this.curIndex].startDate = '';
			}
		},
		// 监听子任务结束时间的变化
		itemEndDate (date){
			var endDate = Date.parse(date);
			var startDate = Date.parse(this.projectList[this.curIndex].startDate);

			if(endDate > this.projectEndDate){
				swal({
					title: '子任务结束时间不能晚于项目结束时间！',
					type: 'warning'
				});
				// 置空
				this.projectList[this.curIndex].endDate = '';
			}else if(startDate && endDate < startDate){
				swal({
					title: '子任务的结束时间不能早于开始时间！',
					type: 'warning'
				});
				// 置空
				this.projectList[this.curIndex].endDate = '';
			}
		},
		// 切换子任务
		switchItem (curIndex) {
			function showORhide(arr){
				arr.map((item, index) => {
					if(index == curIndex){
						item.active = true;
					}else{
						item.active = false;
					}
					return item;
				});
			}
			this.curIndex = curIndex;
			showORhide(this.titleList);
			showORhide(this.projectList);
		},
		// 新增子任务
		addProjectItem () {
			this.titleList.push({
				name: '任务X',
				active: false
			});
			this.projectList.push({
				active: false, // 是否显示
				name: '任务X', // 子任务名称
				note: '', // 子任务内容
				startDate: '', // 开始时间
				endDate: '', // 结束时间
				weight: '', // 任务量度
				workid: '', // 指派人
				approval: {
					avatar: '',
					name: ''
				}
			});

			var curIndex = this.titleList.length - 1;
			this.switchItem(curIndex);
			inputName((value) => {
				this.titleList[curIndex].name = value;
				this.projectList[curIndex].name = value;
			});
		},
		// 删除子任务
		deleteProjectItem () {
			if(this.titleList.length === 1){
				swal({
					type: 'warning',
					title: '至少要有一个子任务！'
				});
				return;
			}
			swal({
			  title: "确定删除该子任务？",
			  text: "该操作无法撤销!",
			  type: "warning",
			  cancelButtonText: "取消",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "确定"
			}, () => {
				this.titleList.splice(this.curIndex, 1);
			 	this.projectList.splice(this.curIndex, 1);
			 	if(this.curIndex == 0){
			 		this.switchItem(0);
			 	}else{
			 		this.switchItem(this.curIndex - 1);
			 	}			 	
			});
		},
		// 添加指派人
		addAppointed () {
			// 打开 侧边栏--审核人 组件
			this.$emit('selectApproval', 'on', 'childProjectApproval');
		},
		// 删除指派人
		deleteApproval (index){
			swal({
			  title: "确定删除该指派人？",
			  type: "warning",
			  cancelButtonText: "取消",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "确定"
			}, () => {
				this.projectList[index].workid = '';
			});
		},
		// 提交
		submitInfo () {
			var items = [];
			this.projectList.forEach(item => {
				items.push({
					note: item.note,
					worker: {
						id: item.workid
					},
					weight: item.weight,
					startDate: Date.parse(item.startDate),
					name: item.name,
					endDate: Date.parse(item.endDate)
				});
			});

			// 关闭 侧边栏--审核人 组件
			this.$emit('selectApproval', 'off', 'childProjectApproval');

			// 将数据提交到项目创建页面
			this.$router.push({
				path: '/home/project/create',
				query: {
					items: items
				}
			});
			// 初始化组件
			init(this);
		}
	}
}
</script>