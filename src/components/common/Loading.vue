<template>
	<transition name="fade">
		<div class="loading" v-show="state">
	   		<img src="../../assets/loading.svg" />
	   	</div> 
	</transition>
</template>

<style scoped>
	.loading{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999999;
	}
	.loading img{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>

<script>
	export default ({
		name: 'loading',
		props: ['state'],
		data () {
			return {
				
			}
		}
	});
</script>