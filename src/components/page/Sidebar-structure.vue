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
				 :accordion="true"
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

	export default {
		data () {
			return {

			}
		},
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
				// 根据父类获取子类
				axios.findChildren(node.data.id, (err, data) => {
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
			},
			// 处理节点点击事件
			handleNodeClick (data, node){
				if(node.level >= 3 || data.id === 100){
					this.$eventBus.$emit('findStaff', {
						oid: data.id
					});
				}
			}
		}
	}
</script>
