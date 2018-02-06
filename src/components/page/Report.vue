<template lang="html">
	<transition name="component-fade" mode="out-in"> 
		<keep-alive> 
			<router-view 
			v-on:selectApproval="selectApproval"
			v-on:selectModule="switchSidebarModal">
			</router-view> 
		</keep-alive> 
 	</transition>
</template>

<style scoped="scoped">
	
</style>

<script>
export default {
	data () {
		return {
			
		}
	},
	methods: {
		// 选择审核人
		selectApproval (handle, name) {
			this.$emit('selectApproval', handle, name);
		},
		// 打开侧边栏--工作总结
		switchSidebarModal (handle, name){
			this.$emit('selectModule', handle, name);
		}
	}
}
</script>