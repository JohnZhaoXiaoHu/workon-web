<template lang="html">
	<div class="hidden-xs Sidebar">
		<!-- logo -->
		<img src="../../assets/Sidebar_logo.png" class="Sidebar_logo">
		<!-- 主要功能 -->
		<ul class="text-center Sidebar_operate">
			<li @click="sidebarClick('address')">
				<img src="../../assets/Sidebar_address.png">
				<span>通讯录</span>
				<transition name="slide-fade">
					<div class="Sidebar_operate-active" 
						 v-show="active.address"></div>
				</transition>
			</li>
			<li @click="sidebarClick('plan')">
				<img src="../../assets/Sidebar_plan.png">
				<span>工作计划</span>
				<transition name="slide-fade">
					<div class="Sidebar_operate-active" 
						 v-show="active.plan"></div>
				</transition>
			</li>
			<li @click="sidebarClick('report')">
				<img src="../../assets/Sidebar_report.png">
				<span>工作总结</span>
				<transition name="slide-fade">
					<div class="Sidebar_operate-active" 
						 v-show="active.report"></div>
				</transition>
			</li>
			<li @click="sidebarClick('project')">
				<img src="../../assets/Sidebar_project.png">
				<span>项目</span>
				<transition name="slide-fade">
					<div class="Sidebar_operate-active" 
						 v-show="active.project"></div>
				</transition>
			</li>
		</ul>
	</div>
</template>

<style scoped>
	.Sidebar{
		width: 400px;
		height: 100%;
		background: #ffffff;
		flex: 0 0 auto;
		position: relative;
	}
	.modal-container{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.Sidebar_logo{
		width: 90px;
		height: auto;
		margin-top: 46px;
		margin-left: 50%;
		transform: translateX(-45px);
	}
	.Sidebar_operate{
		margin-top: 100px;
		width: 100%;
	}
	.Sidebar_operate li{
		padding: 15px;
		cursor: pointer;
		position: relative;
	}
	.Sidebar_operate-active{
		position: absolute;
		left: 0;
		top: 0;
		width: 5px;
		height: 100%;
		background-color: #6b9594;
	}
	.Sidebar_operate li img{
		width: 30px;
		height: 30px;
		margin-right: 30px;
	}
	.Sidebar_operate li span{
		display: inline-block;
		width: 60px;
		text-align: left;
	}
</style>

<script>
import loginCheck from '../../loginCheck.js';

export default {
	name: 'sidebar',
	data () {
		return {
			active: {
				address: false,
				plan: false,
				report: false,
				project: false
			}
		}
	},
	created () {
		// 监听快捷入口切换事件
		this.$eventBus.$on('toggleEntry', event => {
			for(var key in this.active){
				this.active[key] = false;
			}
			this.active[event.item] = event.state;
		});
	},
	methods: {
		sidebarClick: function(type){
			// 检查登录状态
			if(!loginCheck.checkState()) return;
			
			switch(type){
				case 'address':
				this.active = {
					address: true,
					plan: false,
					report: false,
					project: false
				};
				this.$emit('selectModule', 'on', 'address');
				this.$router.push('/home/address');
				break;
				case 'plan':
				this.active = {
					address: false,
					plan: true,
					report: false,
					project: false
				};
				this.$emit('selectModule', 'on', 'plan');
				this.$router.push('/home/plan');
				break;
				case 'report':
				this.active = {
					address: false,
					plan: false,
					report: true,
					project: false
				};
				this.$emit('selectModule', 'on', 'report');
				this.$router.push('/home/report');
				break;
				case 'project':
				this.active = {
					address: false,
					plan: false,
					report: false,
					project: true
				};
				this.$emit('selectModule', 'on', 'project');
				this.$router.push('/home/project');
				break;
			}
		}
	}
}
</script>

