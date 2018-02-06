<template lang="html">
	<div class="staff-container">
		<!-- 员工信息卡片 -->
		<div class="staff" v-for="item in dataList">
			<!-- 头像 -->
			<img :src="item.avatar" class="staff-avater"
			     @error="errorImg(item)">
			<!-- 姓名 -->
			<p class="text-center staff-info">
				<span class="name" v-text="item.name"></span>
				<span class="job" v-text="item.job"></span>
			</p>
			<!-- 标签 -->
			<div class="staff-tags">
				<div class="text-center staff-tags_item" 
					 v-for="tag in item.tags">
					<span v-text="tag.name"></span>
				</div>
			</div>
			<!-- 联系方式 -->
			<div class="staff-contact">
				<div class="staff-contact_item">
					<img src="../../assets/envelope.svg">
					<span v-text="item.email"></span>
				</div>
				<div class="staff-contact_item">
					<img src="../../assets/tel.svg">
					<span v-text="item.phone"></span>
				</div>
				<div class="staff-contact_item">
					<img src="../../assets/mobile.svg">
					<span v-text="item.mobile"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped="scoped">
	.staff-container{
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		background: #f0f4fb;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.staff{
		width: 300px;
		height: 350px;
		background: white;
		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		float: left;
	}
	.staff-avater{
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin: 10px;
	}
	.staff-info{
		margin: 0 auto 10px auto;
	}
	.staff-info .name{
		font-size: 16px;
		font-weight: bold;
		margin-right: 10px;
	}
	.staff-info .job{
		font-size: 14px;
		color: #999;
	}
	.staff-tags{
		margin: 5px 0 20px 15px;
		align-self: flex-start;
		width: 100%;
		height: 35px;
		overflow: hidden;
	}
	.staff-tags_item{
		display: inline-block;
		padding: 7px 15px;
		margin-left: 5px;
		background: #eeeeee;
		color: #999;
		font-weight: bold;
		border-radius: 5px;
		font-size: 12px;
	}
	.staff-tags_item:first-child{
		margin-left: 0;
	}
	.staff-contact{
		width: 85%;
	}
	.staff-contact_item{
		border-bottom: 1px solid #eeeeee;
		padding: 8px 5px 5px 20px;
	}
	.staff-contact_item img{
		width: 25px;
		margin-right: 25px;
	}
	.staff-contact_item span{
		color: #999;
	}
</style>

<script>
import utils from '../../utils.js';
import axios from '../../axios.js';
import async from 'async';
	
	export default {
		name: 'address',
		data () {
			return {
				dataList: [], // 页面渲染数据列表
			}
		},
		computed: {
			// 用户信息
			userInfo () {
				return this.$store.state.userInfo;
			}
		},
		created () {
			// 默认显示好友列表
			this.findFriends(this.userInfo.id);
			// 监听 sidebar-structure 组织架构--部门的oid
			this.$eventBus.$on('findStaff', event => {
				// 根据部门id请求组织架构节点下的员工
				this.findStaff(event.oid);
			});
		},
		methods: {
			// 处理标签问题
			handleTags (tags) {
				// 处理标签为空
				if(tags.length){
					tags.map((item, index, arr) => {
						if(!item.name){
							arr.splice(index, 1);
						}
						return item;
					});
				}
				// 添加默认标签
				if(!tags.length){
					tags.push({
						name: '这个人很懒，没有填写任何标签'
					});
				}				
				return tags;
			},
			// 根据部门id请求组织架构节点下的员工
			findStaff (organizationId) {
				var vm = this;	
				// 显示加载动画
				this.$store.dispatch('showLoading');
				//console.log(this.userInfo.id)
				//console.log(organizationId)
				axios.findStaff(this.userInfo.id, organizationId, 
				  1, 100, (err, data) => {
				  	// 隐藏加载动画
				  	vm.$store.dispatch('hideLoading');

					if(err){
						swal(err);
					}else if(data.errorCode != 0){
						// 请求失败
						swal(data.msg);
					}else{
						this.dataList = data.list;
						this.dataList.map(item => {
							// 处理用户头像问题
							item.avatar = utils.handleAvatar(item.avatar);
							// 处理标签问题
							item.tags = this.handleTags(item.tags);
							// 提示没有填写邮箱
							if(!item.email){
								item.email = '暂未填写';
							}
							return item;
						});
					}
				});
			},
			// 处理头像加载不出来
			errorImg (item) {
				item.avatar = this.$store.state.avatarDefault;
			},
			// 根据员工id获取详细信息
			findStaffInfo (wid, callback) {
				var vm = this;			
				// 显示加载动画
				this.$store.dispatch('showLoading');

				axios.findStaffInfo(wid, function(err, data){
					// 隐藏加载动画
					vm.$store.dispatch('hideLoading');

					if(err){
						swal(err);
					}else if(data.errorCode != 0){
						// 请求失败
						swal(data.msg);
					}else{
						callback(data);
					}
				});
			},
			// 根据员工id获取好友列表
			findFriends (wid) {
				var vm = this;			
				// 显示加载动画
				this.$store.dispatch('showLoading');

				axios.findFriends(wid, function(err, data){
					if(err){
						swal(err);
					}else if(data.errorCode != 0){
						// 请求失败
						swal(data.msg);
					}else{
						// 异步队列获取好友详细信息
						async.map(data.list, function(item, callback){
							// 处理用户头像问题
							item.avatar = utils.handleAvatar(item.avatar);
							// 发起请求
							vm.findStaffInfo(item.id, function(data){
								Object.assign(item, {
									email: data.email,
									tags: data.tags,
									mobile: data.mobile
								});
								// 处理标签问题
								item.tags = vm.handleTags(item.tags);
								callback(null, item);
							});
						}, function(errs, results){
							// 信息获取完成
							// 隐藏加载动画
							vm.$store.dispatch('hideLoading');
							if(errs){
								swal(errs);
								return;
							}							
							vm.dataList = results;
						});
					}
				});
			},
		}
	}
</script>