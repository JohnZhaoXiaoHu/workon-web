import * as types from './mutation-type.js';

export default {
	[types.SHOW_LOADING] (state) {
		state.loadingState = true;
	},
	[types.HIDE_LOADING] (state) {
		state.loadingState = false;
	},
	[types.SIGN_IN] (state, userInfo) {
		state.userInfo = Object.assign(state.userInfo, userInfo);
		state.loginState = true;
		// 将登陆信息缓存到本地
		localStorage.setItem('loginState', 'true');
		localStorage.setItem('lastLoginTime', Date.parse(new Date()));
		localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
	},
	[types.SIGN_OUT] (state) {
		state.loginState = false;
		// 清除本地缓存
		localStorage.setItem('loginState', '');
		localStorage.setItem('userInfo', '');
		localStorage.setItem('lastLoginTime', '');
	}
}