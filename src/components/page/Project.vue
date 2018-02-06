<template lang="html">
	<transition name="component-fade" mode="out-in"> 
		<keep-alive> 
			<router-view
				v-on:selectApproval="selectApproval">
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
		// 选择项目审核人
		selectApproval (handle, name){
			this.$emit('selectApproval', handle, name);
		}
	}
}
</script>