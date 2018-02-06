<template lang="html">
	<div class="hidden-xs sidebar_container structure">
		<!-- head -->
		<div class="clearfix head">
			<span class="pull-left">>&nbsp;组织架构</span>
			<img class="pull-right" src="../../assets/Sidebar_closebtn.png"
				 @click="closeSelf">
		</div>
		<el-tree class="classTree" 
				 node-key="id"
				 :default-expanded-keys="expandedKeys"
				 :load="loadNode"
				 :props="{label: 'name'}"
				 :highlight-current="true"
				 @node-click="handleNodeClick"
				 lazy>
		</el-tree>
	</div>
</template>

<style scoped="scoped">
	.structure{
		display: flex;
		flex-direction: column;
		align-items: stretch;
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
	.closeBtn{
		position: absolute;
		top: 10px;
		right: 10px;
	}
	.classTree{
		border: none;
		margin-top: 10px;
		flex: 1 1 auto;
		overflow-y: scroll;
	}
</style>

<script>
	import axios from '../../axios.js';
	import utils from '../../utils.js';

	export default {
		data () {
			return {
				
			}
		},
		props: ['config'],
		computed: {			
			// 默认展开的节点keys数组
			expandedKeys () {
				return [2].concat(this.$store.state.userInfo.companyid);
			}
		},
		methods: {
			// 关掉遮罩层
			closeSelf () {
				this.$emit('closeSelf', 'off', 'address');
			},
			// 加载子节点
			loadNode (node, resolve) {
				if(node.level === 0){
					return resolve([{ name: '中北集团', id: 2 }]);
				}
				// 根据部门id获取员工
				if(node.level === 3 || node.level === 4 || node.key === 100){
					axios.findStaff(
					  this.$store.state.userInfo.id, 
					  node.key, 
					  1, 100, 
					  (err, data) => {
						if(err){
							swal(err);
							return;
						}else if(data.errorCode != '0'){
							// 请求失败
							swal(data.msg);
						}else{
							return resolve(data.list);
						}
					});
				}else{
					// 根据父类获取子类
					axios.findChildren(node.key, (err, data) => {
						if(err){
							swal(err);
							return;
						}else if(data.errorCode != '0'){
							// 请求失败
							swal(data.msg);
						}else{
							return resolve(data.list);
						}
					});
				}												
			},
			// 处理节点点击事件
			handleNodeClick (data, node){
				var emitName = '';
				if(this.config.type == 'plan'){
					emitName = 'addPlanApprovals';
				}else if(this.config.type == 'report'){
					emitName = 'addReportApprovals';
				}else if(this.config.type == 'project'){
					emitName = 'addProjectApprovals';
				}else if(this.config.type == 'childProject'){
					emitName = 'addChildProjectApprovals';
				}
				// 触发添加审核人事件
				if(data.organizationId){
					this.$eventBus.$emit(emitName, {
						id: data.id, // 员工id
						avatar: utils.handleAvatar(data.avatar), // 头像地址
						name: data.name // 员工姓名
					});
				}											
			}
		}
	}
</script>