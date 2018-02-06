import * as types from './mutation-type.js';

export default ({
	showLoading({ commit }){
		commit(types.SHOW_LOADING);
	},
	hideLoading({ commit }){
		commit(types.HIDE_LOADING);
	},
	signIn({ commit }, userInfo){
		commit(types.SIGN_IN, userInfo);
	},
	signOut({ commit }){
		commit(types.SIGN_OUT);
	}
})