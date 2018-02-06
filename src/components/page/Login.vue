<template lang="html">	
	<transition name="component-fade" mode="out-in"> 
		<keep-alive> 
			<router-view
			v-on:selectModule="switchSidebarModal"></router-view> 
		</keep-alive> 
 	</transition>
</template>

<style scoped>
	
</style>

<script>
	export default {
		data () {
			return {
				
			}
		},
		methods: {
			switchSidebarModal (handle, name) {
				this.$emit('selectModule', handle, name);
			}
		}
	}
</script>

