import axios from 'axios';
import store from './store/index';

export default {
	/**
	 * [login 用户登录]
	 * @param  {[Number]}   phone    [手机号]
	 * @param  {[String]}   password [密码]
	 * @param  {Function} 	callback [回调函数]
	 * callback(err, data)
	 */
	login: function(phone, password, callback){
		axios.get(store.state.APIURL.login, {params: {
				phone: phone,
				password: password
		}}).then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [sendForgetCode 忘记密码时发送验证码]
	 * @param  {[type]} 	phone 	 [description]
	 * @param  {[Function]} callback [回调函数]
	 * callback(err)
	 */
	sendForgetCode: function(phone, callback){
		axios.get(store.state.APIURL.sendforgetcode, 
			{params: {phone: phone}})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg);
			}else{
				callback(null);
			}
		}).catch(function(err){
			callback('获取数据失败，请检查网络！');
		});
	},
	/**
	 * [checkForgetCode 忘记密码的时候验证手机验证码是否正确]
	 * @param  {[Number]}   phone    [手机号]
	 * @param  {[Number]}   code     [验证码]
	 * @param  {Function} callback [回调函数]
	 * callback(err, data)
	 */
	checkForgetCode: function(phone, code, callback){
		axios.get(store.state.APIURL.checkforgetcode, {params: {
			phone: phone,
			code: code
		}}).then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [modifyPassword 根据用户令牌修改密码]
	 * @param  {[String]}   token    [用户令牌]
	 * @param  {[String]}   password [密码]
	 * @param  {Function} callback 	[回调函数]
	 * callback(err)
	 */
	modifyPassword: function(token, password, callback){
		axios.get(store.state.APIURL.modifypasswordbytoken, {params: {
			token: token,
			password: password
		}}).then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg);
			}else{
				callback(null);
			}
		}).catch(function(err){
			callback('获取数据失败，请检查网络！');
		});
	},
	/**
	 * [findAllParents 获取所有父类]
	 * @param  {[Number]}   organizationId   [组织id]
	 * @param  {Function}     callback       [回调函数]
	 */
	findAllParents: function(organizationId, callback){
		axios.get(store.state.APIURL.findAllParents, 
			{params: {id: organizationId}})
		.then(function(res){
			callback(null, res.data);
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	}, 
	/**
	 * [findChildren 根据父类获取子类]
	 * @param  {[Number]}   parentId  [父类id]
	 * @param  {Function}   callback  [回调函数]
	 */
	findChildren: function(parentId, callback){
		axios.get(store.state.APIURL.findChildren, 
			{params: {id: parentId}})
		.then(function(res){
			callback(null, res.data);	
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [findStaff 根据部门id请求组织架构节点下的员工]
	 * @param  {[type]} id             [员工id]
	 * @param  {[type]} organizationId [组织id]
	 * @param  {[type]} pageno         [页码]
	 * @param  {[type]} pagesize       [每页数据量]
	 * @param  {[Function]} callback   [回调函数]
	 * callback(err, data);
	 */
	findStaff: function(id, organizationId, pageno, pagesize, callback){
		// 设置默认值
		pageno = pageno ? pageno : 1;
		pagesize = pagesize ? pagesize : 100;

		axios.get(store.state.APIURL.findStaff, 
			{params: {
				wid: id,
				oid: organizationId,
				pageno: pageno,
				pagesize: pagesize
			}
		})
		.then(function(res){
			callback(null, res.data);	
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [findFriends 根据员工id获取好友列表]
	 * @param  {[Number]}   wid      [员工id]
	 * @param  {Function} callback   [回调函数]
	 */
	findFriends: function(wid, callback){
		axios.get(store.state.APIURL.findFriends, 
			{params: {
				worker: wid,
			}
		})
		.then(function(res){
			callback(null, res.data);	
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [findStaffInfo 根据员工id获取详细信息]
	 * @param  {[Number]}   wid      [员工id]
	 * @param  {Function} callback  [回调函数]
	 */
	findStaffInfo: function(wid, callback){
		axios.get(store.state.APIURL.findStaffInfo, 
			{params: {
				id: wid,
			}
		})
		.then(function(res){
			callback(null, res.data);	
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [getPlanList 获取工作计划列表]
	 * @param  {[Number]} workid   [员工id]
	 * @param  {[Number]} pageNo   [页码]
	 * @param  {[Number]} pageSize [每页显示数据量]
	 * @param  {[Function]} callback [回调函数]
	 * callback(err, data, totalPage)
	 */
	getPlanList: function(workid, pageNo, pageSize, callback){
		axios.get(store.state.APIURL.getPlanList, 
			{params: {
				workid: workid,
				pageNo: pageNo,
				pageSize: pageSize
			}
		})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null, null);
			}else{
				callback(null, res.data.list, res.data.totalPage);
			}				
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null, null);
		});		
	},
	/**
	 * [getPlanDetail 获取工作计划详情]
	 * @param  {[Number]}   id       [计划id]
	 * @param  {Function} callback   [回调函数]
	 * callback(err, data)
	 */
	getPlanDetail: function(id, callback){
		axios.get(store.state.APIURL.getPlanDetail, 
			{params: {
				id: id
			}
		})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}				
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [submitPlan 提交工作计划]
	 * @param  {[Object]}   data     [需要提交的工作计划]
	 * @param  {Function} callback   [回调函数]
	 * callback(err, data)
	 */
	submitPlan: function(data, callback){
		var params = new URLSearchParams();
		params.append('data', JSON.stringify(data));

		axios.post(store.state.APIURL.submitPlan, params)
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}		
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [getPeroidPlan 获取某个时间段的工作计划]
	 * @param  {[Number]} 	 uid 	    [员工id]
	 * @param  {[Number]} 	 from 	    [开始时间戳]
	 * @param  {[Number]}     to   		[截止时间戳]
	 * @param  {[Function]} callback    [回调函数]
	 * callback(err, data)
	 */
	getPeroidPlan: function(uid, from, to, callback){
		axios.get(store.state.APIURL.getPeroidPlan, {
			params: {
				uid: uid,
				min: from,
				max: to
			}
		}).then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [getReportList 获取工作总结列表]
	 * @param  {[Number]} workid   [员工id]
	 * @param  {[Number]} pageNo   [页码]
	 * @param  {[Number]} pageSize [每页显示数据量]
	 * @param  {[Function]} callback [回调函数]
	 * callback(err, data, totalPage)
	 */
	getReportList: function(workid, pageNo, pageSize, callback){
		axios.get(store.state.APIURL.getReportList, 
			{params: {
				workid: workid,
				pageno: pageNo,
				pagesize: pageSize
			}
		})
		.then(function(res){
			//console.log(res)
			if(res.data.errorCode != 0){
				callback('暂无工作总结，你可以新增工作总结！', null, null);
			}else{
				//console.log(res.data.errorCode)
				callback(null, res.data.list, res.data.totalPage);
			}				
		}).catch(function(err){
			///console.log(222)
			callback('获取数据失败，请检查网络！', null, null);
		});		
	},
	/** 
	 * [getReportDetail 获取工作总结详情]
	 * @param  {[Number]}   id       [计划id]
	 * @param  {Function} callback   [回调函数]
	 * callback(err, data)
	 */
	getReportDetail: function(id, callback){
		axios.get(store.state.APIURL.getReportDetail, 
			{params: {
				id: id
			}
		})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}				
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [submitReport 提交工作总结]
	 * @param  {[Object]}   data     [工作总结内容]
	 * @param  {Function} callback   [回调函数]
	 * callback(err, data)
	 */
	submitReport: function(data, callback){
		var params = new URLSearchParams();
		params.append('data', JSON.stringify(data));

		axios.post(store.state.APIURL.submitReport, params)
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}		
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [getProjectList 获取项目列表]
	 * @param  {[Number]}   workid     [员工id]
	 * @param  {[Number]}   pageNo     [页码]
	 * @param  {[Number]}   pageSize   [每页数据量]
	 * @param  {Function}   callback   [回调函数]
	 * callback(err, data, totalPage)
	 */
	getProjectList: function(workid, pageNo, pageSize, callback){
		axios.get(store.state.APIURL.projectList, 
			{params: {
				workid: workid,
				pageNo: pageNo,
				pageSize: pageSize
			}
		})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null, null);
			}else{
				callback(null, res.data.list, res.data.totalPage);
			}				
		}).catch(function(err){
			callback('获取数据失败，请检查网络！222', null, null);
		});	
	},
	/**
	 * [getProjectDetail 获取项目详情]
	 * @param  {[Number]}   id       [项目id]
	 * @param  {Function} callback   [回调函数]
	 * callback(err, data)
	 */
	getProjectDetail: function(id, callback){
		axios.get(store.state.APIURL.projectDetail, 
			{params: {
				id: id
			}
		})
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}				
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	},
	/**
	 * [createProject 新建项目]
	 * @param  {[Object]}   data     [项目详情]
	 * @param  {Function} callback  [回调函数]
	 */
	createProject: function(data, callback){
		var params = new URLSearchParams();
		params.append('data', JSON.stringify(data));
		
		axios.post(store.state.APIURL.createProject, params)
		.then(function(res){
			if(res.data.errorCode != 0){
				callback(res.data.msg, null);
			}else{
				callback(null, res.data);
			}		
		}).catch(function(err){
			callback('获取数据失败，请检查网络！', null);
		});
	}
}
