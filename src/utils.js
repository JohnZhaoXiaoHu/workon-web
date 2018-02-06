// 工具方法
import store from './store/index';

export default {
	/**
	 * [handleAvatar 处理头像地址问题]
	 * @param  {[type]} avatarURL   [description]
	 * @return {[String]}           [真实头像地址]
	 */
	handleAvatar (avatarURL) {
		if(!avatarURL){
			// 返回默认头像
			return store.state.avatarDefault;
		}else if(avatarURL.indexOf('http') < 0){
			return 'http://123.206.23.130/icontact_web/' + avatarURL;
		}else{
			return avatarURL;
		}
	},
	/**给定一个时间戳，判断是一年中的第几周
	 * 依据: https://zh.wikipedia.org/wiki/ISO_8601
	 * 用2位数表示本年内第几个日历星期，再加上1位数表示日历星期内第几天，但日历星期前
	 * 要加上一个大写字母W。 
	 * 该年度的1月1日如果是星期一、星期二、星期三或星期四的话，该星期就是该年的
	 * 第一个星期，也就是W01。 
	 * 该年度的1月1日如果是星期五、星期六或星期日的话，该星期就是前一年的最后一个星期。
	 *  一星期的第一天为星期一，星期日为最后一天
	 */
	checkWeek (timestamp) {
		// 当前年份
		var nowYear = new Date(timestamp).getFullYear();
		// 当前年份的 1.1 是周几
		var nowYear_1_1 = new Date(nowYear, 0, 1).getDay() === 0 ? 
							7 : 
							new Date(nowYear, 0, 1).getDay();
		// 该年第一周的第一天
		var nowYearFirstDay = '';
		// 该年第一周的第一天是周几
		var firstWeekFirstDay = '';

		// 判断该年第一周的第一天的具体日期
		if( nowYear_1_1 === 5 || 
			nowYear_1_1 === 6 || 
			nowYear_1_1 === 7 ){
			nowYearFirstDay = Date.parse(
				new Date(nowYear, 0, 7 - nowYear_1_1 + 2));
			firstWeekFirstDay = 1;
		}else{
			nowYearFirstDay = Date.parse(new Date(nowYear, 0, 1));
			firstWeekFirstDay = nowYear_1_1;
		}

		// 计算给定的时间是第几周
		var intervalDays = (timestamp-nowYearFirstDay)/(1000*3600*24);
		var week = '';
		if(intervalDays <= 7){
			week = 1;
		}else{
			week = (intervalDays - (7 - firstWeekFirstDay + 1)) / 7 + 2;
		}

		return parseInt(week);
	},
	/**
	 * [formatTime 格式化时间]
	 * @param  {[String]} timeStamp [时间戳]
	 * @return {[String]}           [格式化的时间]
	 * ex: 2017/03/10
	 */
	formatTime (timeStamp, type) {
		var timeObj = new Date(timeStamp);
		var year = timeObj.getFullYear();
		var month = timeObj.getMonth() + 1 < 10 ? 
					'0' + (timeObj.getMonth() + 1) :
					timeObj.getMonth() + 1;
		var date = timeObj.getDate();

		switch(type){
			case 1:
			return year + '/' + month + '/' + date;
			break;
			case 2:
			return year + '.' + month + '.' + date;
			break;
			case 3:
			return year + '年' + month + '月' + date + '日';
			break;
		}		
	},
	/**
	 * [formatTimeToWeek 将给定的时间戳转换为周几]
	 * @param  {[Number]} timeStamp [时间戳]
	 * @return {[String]}           [转换的结果]
	 */
	formatTimeToWeek (timeStamp) {
		var dateObj = new Date(timeStamp);
		var week = dateObj.getDay();
		var weekString = ['日', '一', '二', '三', '四', '五', '六'];
		var result = '';

		result = '周' + weekString[week];
		return result;
	}
}