import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions.js';
import mutations from './mutations.js';
import APIURL from './APIURL.js';

Vue.use(Vuex);

const state =  {
	loadingState: false, // 加载动画显示状态
	APIURL: APIURL, // API地址
	loginState: false, // 登录状态
	avatarDefault: require('../assets/logo.png'), // 全局默认头像地址
	// 用户信息
	userInfo: {
		name: '', // 默认姓名
		avatar: require('../assets/logo.png'), // 默认头像地址
	}, 
};

export default new Vuex.Store({
	state,
	actions,
	mutations
});