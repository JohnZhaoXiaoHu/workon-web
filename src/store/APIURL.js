const IP = 'http://123.206.23.130/';

export default {
	// 登录
	login: IP + 'icontact_web/rest/worker/login_password.htm',
	// 忘记密码的时候发送验证码
	sendforgetcode: IP + 'icontact_web/rest/worker/sendforgetcode.htm',
	// 忘记密码的时候验证手机验证码是否正确
	checkforgetcode: IP + 'icontact_web/rest/worker/checkforgetcode.htm',
	// 通过令牌修改用户密码
	modifypasswordbytoken: IP + 'icontact_web/rest/worker/modifypasswordbytoken.htm',
	// 组织架构--获取所有父类
	findAllParents: IP + 'icontact_web/rest/organization/findtop.htm',
	// 组织架构--根据父类获取子类
	findChildren: IP + 'icontact_web/rest/organization/findbypid.htm',
	// 组织架构--根据部门id请求组织架构节点下的员工
	findStaff: IP + 'icontact_web/rest/worker/pagebyorg.htm',
	// 组织架构--根据员工id获取好友列表
	findFriends: IP + 'icontact_web/rest/friend/searchfriend.htm',
	// 组织架构--根据员工id获取详细信息
	findStaffInfo: IP + 'icontact_web/rest/worker/findbyid.htm',
	// 工作计划--获取计划列表
	getPlanList: IP + 'icontact_web/rest/Reporting/page.htm',
	// 工作计划--获取计划详情
	getPlanDetail: IP + 'icontact_web/rest/Reporting/findbyid.htm',
	// 工作计划--提交工作计划
	submitPlan: IP + 'icontact_web/rest/Reporting/addjson.htm',
	// 工作计划--获取某个时间段的工作计划
	getPeroidPlan: IP + 'icontact_web/rest/Reporting/time.htm',
	// 工作总结--获取总结列表
	getReportList: IP + 'icontact_web/rest/job/page.htm',
	// 工作总结--获取总结详情
	getReportDetail: IP + 'icontact_web/rest/job/findbyid.htm',
	// 工作总结--提交工作总结
	submitReport: IP + 'icontact_web/rest/job/add.htm',
	// 项目--项目列表
	projectList: IP + 'icontact_web/rest/project/page.htm', 
	// 项目--项目详情
	projectDetail: IP + 'icontact_web/rest/project/findbyid.htm',
	// 项目--项目通讯录
	projectAddress: IP + 'icontact_web/rest/project/project.htm',
	// 项目--新建项目
	createProject: IP + 'icontact_web/rest/project/addjson.htm',
	// 项目--项目编辑
	updateProject: IP + 'icontact_web/rest/project/updatejson.htm'
}