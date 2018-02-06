<template lang="html">
	<div class="visible-md-block visible-lg-block Toolbar">
		<!-- 头像 -->
		<div class="Toolbar-avater">
			<img :src="avatarSrc" />
			<p class="Toolbar-username">{{username}}</p>
		</div>
		<!-- 快捷入口 -->
		<div class="Toolbar-shortcut">
			<div :class="{'Toolbar_shortcut-active': active.address}"
				 @click="shortcutClick('address')">
				<img src="../../assets/Sidebar_address.png" />
				<transition name="slide-fade">
					<div class="shortcut_operate-active"
						 v-show="active.address"></div>
				</transition>				
			</div>
			<div :class="{'Toolbar_shortcut-active': active.plan}"
				 @click="shortcutClick('plan')">
				<img src="../../assets/Sidebar_plan.png" />
				<transition name="slide-fade">
					<div class="shortcut_operate-active"
						 v-show="active.plan"></div>
				</transition>
			</div>
			<div :class="{'Toolbar_shortcut-active': active.report}"
				 @click="shortcutClick('report')">
				<img src="../../assets/Sidebar_report.png" />
				<transition name="slide-fade">
					<div class="shortcut_operate-active"
						 v-show="active.report"></div>
				</transition>
			</div>	
			<div :class="{'Toolbar_shortcut-active': active.project}"
				 @click="shortcutClick('project')">
				<img src="../../assets/Sidebar_project.png" />
				<transition name="slide-fade">
					<div class="shortcut_operate-active"
						 v-show="active.project"></div>
				</transition>
			</div>		
		</div>
		<!-- 底部手机icon -->
		<img class="Toolbar-lines" src="../../assets/Toolbar_lines.png" />
	</div>
</template>

<style scoped>
	.Toolbar{
		width: 100px;
		height: 100%;
		background: #363e47;
		flex: 0 0 auto;
		color: white;
		position: relative;
	}
	.Toolbar-avater{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px 0;
		padding-top: 46px;
		cursor: pointer;
	}
	.Toolbar-avater > img{
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}
	.Toolbar-username{
		margin-top: 15px;
	}
	.Toolbar-shortcut{
		margin-top: 20px;
	}
	.Toolbar-shortcut > div{
		position: relative;
		margin-top: 20px;
		width: 100%;
		height: 80px;
		cursor: pointer;
	}
	.Toolbar-shortcut img{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 99999;
	}
	.Toolbar_shortcut-active{
		background: rgba(255, 255, 255, 0.1);		
	}
	.shortcut_operate-active{
		position: absolute;
		left: 0;
		top: 0;
		width: 5px;
		height: 100%;
		background-color: #6b9594;
	}
	.Toolbar-lines{
		position: absolute;
		bottom: 45px;
		left: 50%;
		margin-left: -10px;
		cursor: pointer;
	}
</style>

<script>
import loginCheck from '../../loginCheck.js';

	export default {
		name: 'toolbar',
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
		computed: {
			avatarSrc () {
				return this.$store.state.userInfo.avatar
			},
			username () {
				return this.$store.state.userInfo.name
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
			// 快捷方式点击
			shortcutClick (type) {
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