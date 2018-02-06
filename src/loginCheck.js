import store from './store/index';
import router from './router/index';

export default {
	checkState: function(){
		var loginState = localStorage.getItem('loginState') || null;
		var lastLoginTime = localStorage.getItem('lastLoginTime') || null;
		var userInfo = localStorage.getItem('userInfo') || null;

		if(!loginState || !lastLoginTime || !userInfo){
			// 跳转到登录页面
			router.push('/home/login');
			return false;
		}else{ 
			// 验证登陆时间是否已超过2小时
			var nowDate = Date.parse(new Date());
			var interval = Math.floor((nowDate - lastLoginTime)/(1000*3600));
			if(interval > 2){
				swal('登录已失效，请重新登录！');
				// 跳转到登录页面
				router.push('/home/login');
				return false;
			}
			store.state.userInfo = JSON.parse(userInfo);
			return true;			
		}
	}
}