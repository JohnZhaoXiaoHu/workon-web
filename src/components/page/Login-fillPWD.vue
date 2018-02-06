<template lang="html">
	<div class="Login">
		<!-- banner -->
		<div class="text-center Login-banner">
			<!-- slogan -->
			<div class="Login-slogan">
				<h1>简单高效的项目协同工作平台</h1>
			</div>
			<button class="btn btn-success Login-learnMore">了解更多</button>
		</div>
		<!-- 背景 -->
		<div class="Login-background">
			<img src="../../assets/logo.png" />
		</div>
		<!-- 登录信息 -->
		<div class="clearfix Login-inputInfo">
			<div class="Login-input_account"> 
				<input type="password" placeholder="新密码" autocomplete="off"
					   v-model="password"> 
			</div>
			<div class="Login-input_password">  
				<input type="password" placeholder="重新输入新密码" 
					   autocomplete="off" v-model="confirmPassword"> 
			</div>
		</div>
		<!-- 获取验证码 -->
		<div class="Login-modal">
			<button class="btn btn-success btn-block Login-modal_sign"
					type="button" 
					@click="submit">
				确认提交
			</button>
		</div>
		<!-- 底部版权申明 -->
		<div class="text-center Login-declare">
			<p>
				<a href="#">关于pmon</a>
				&nbsp;|&nbsp;
				<a href="#">联系我们</a>
			</p>
			<p>Copyright ©2015 陕西同纳信息技术有限公司——陕ICP备16003255号-1</p>
		</div>
	</div>
</template>

<style scoped>
	.Login{
		height: 100%;
		overflow-y: scroll;
		background: #e7e7e7;
		color: white;
		position: relative;
	}
	.Login-banner{
		width: 100%;
		height: 300px;
		background-image: url('../../assets/Login-banner.png'); 
		background-size: cover;
	}
	.Login-slogan{
		padding-top: 40px;
	}
	.Login-slogan h1{
		font-size: 24px;
		font-weight: lighter;
	}
	.Login-learnMore{
		margin-top: 40px;
	}
	.Login-background{
		height: 200px;
		width: 80%;
		margin: -100px auto 0 auto;
		background: linear-gradient(to bottom, 
									rgba(255, 255, 255, 0.9), 
									transparent);
		border-radius: 15px;
		position: relative;
	}
	.Login-background img{
		position: absolute;
		left: 50%;
		top: 45%;
		transform: translate(-50%, -50%);
		width: 100px;
		height: 100px;
	}
	.Login-inputInfo{
		width: 400px;
		margin: 0 auto;
		color: #333;
	}
	.Login-inputInfo img{
		width: 15px;
	}
	.Login-inputInfo input{
		width: 365px;
		display: inline-block;
		background: none;
		margin-left: 10px;
		padding-bottom: 15px;
		padding-left: 10px;
		border: 1px solid transparent;
		border-bottom: 2px solid #d9d9d9 !important;
	}
	.Login-inputInfo input::placeholder{
		font-size: 12px;
	}
	.Login-input_password{
		margin-top: 30px;
	}
	.Login-input_forget{
		margin-top: 5px;
		color: #999;
		font-size: 12px;
		cursor: pointer;
	}
	.Login-modal{
		margin: 25px auto 0 auto;
		width: 400px;
	}
	.Login-modal button{
		border-radius: 34px;
		padding: 10px 12px;
	}
	.Login-modal_sign{
		margin-bottom: 15px;
	}
	.Login-modal_register{
		background: transparent;
		color: #333;
		border: 1px solid #7dc26d;
	}
	.Login-declare{
		font-size: 12px;
		color: #999999;
		margin-top: 30px;
	}
	.Login-declare a{
		color: #999999;
	}
</style>
 
<script>
import axios from '../../axios.js';
	export default {
		data () {
			return {
				password: '', // 新密码
				confirmPassword: '', // 确认新密码
				token: '', // 用户令牌
			}
		},
		activated () {
			this.token = this.$route.query.token;
			if(!this.token){
				this.$router.push('/home/login/forget');
			}
		},
		methods: {
			// 提交
			submit () {		
				if(!this.password.trim()){
					swal('新密码不能为空！');
					return;
				}
				if(!this.confirmPassword.trim()){
					swal('确认新密码不能为空！');
					return;
				}
				if(this.password.trim() !== this.confirmPassword.trim()){
					swal('两次输入密码不一致！');
					return;
				}
				// 显示加载动画
				this.$store.dispatch('showLoading');
				axios.modifyPassword(this.token, this.password, err => {
					// 隐藏加载动画
					this.$store.dispatch('hideLoading');
					if(err){
						swal(err);
						return;
					}
					swal('密码修改成功，请重新登录');
					this.$router.push('/home/login/login');
				});
			}	
		}
	}
</script>