// 项目详情部分--任务进度绘制
// opts: {
// 	elementId: canvas的id
// 	percent: 百分比
// 	radius: 圆环半径
// 	lineWidth: 线条宽度
// 	circleStrokeStyle: 背景圆环线条样式
// 	progressStrokeStyle: 进度条线条样式
// 	fontSize: 字体大小
// }
function draw(opts){
	if(!opts.elementId){
		alert('请传入canvas元素的ID');
		return false;
	}

	var canvas = document.getElementById(opts.elementId);
	this.ctx = canvas.getContext('2d');
	// 最终的百分比
	this.percent = opts.percent || 0;
	// 中心x坐标
	this.circleX = canvas.width / 2;
	// 中心y坐标
	this.circleY = canvas.height / 2;
	// 圆环半径
	this.radius = opts.radius || 40;
	// 线条宽度
	this.lineWidth = opts.lineWidth || 10;
	// 线条颜色
	this.circleStrokeStyle = opts.circleStrokeStyle || '#eee';
	// 进度条线条样式
	this.progressStrokeStyle = opts.progressStrokeStyle || '#7df6e4';
	// 字体大小
	this.fontSize = opts.fontSize || 20;
	// 动画加载进度
	this.process = 0;
}

draw.prototype.circle = function(){
	this.ctx.beginPath();
	this.ctx.moveTo(this.circleX + this.radius, this.circleY);
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = this.circleStrokeStyle;
	this.ctx.arc(this.circleX, this.circleY, this.radius, 0, Math.PI*2);
	this.ctx.closePath();
	this.ctx.stroke();
};

draw.prototype.sector = function(startX, startY, startAngle, 
  endAngle){
	this.ctx.beginPath();
	this.ctx.moveTo(startX, startY);
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.strokeStyle = this.progressStrokeStyle;
	// 圆弧两端的样式
	this.ctx.lineCap = 'butt';

	// 绘制圆弧
	this.ctx.arc(this.circleX, this.circleY, this.radius,
		startAngle * (Math.PI / 180) + Math.PI / 180 * 270, 
		endAngle * (Math.PI / 180) + Math.PI / 180 * 270);
	this.ctx.stroke();
}

var timeID;
draw.prototype.animateLoading = function(){
	timeID = setTimeout(() => {
		this.animateLoading();
	}, 0);

	if(this.process >= this.percent){
		clearTimeout(timeID);
	} 

	// 清除canvas内容
	this.ctx.clearRect(0, 0, this.circleX * 2, this.circleY * 2);
	// 进度文字
	this.ctx.font = this.fontSize + 'px April';
	this.ctx.textAlign = 'center';
	this.ctx.textBaseline = 'middle';
	this.ctx.fillStyle = '#7db3b2';
	this.ctx.fillText(parseFloat(this.process).toFixed(0) + '%', 
		this.circleX, this.circleY);
	// 绘制圆形
	this.circle();
	// 绘制圆弧
	this.sector(this.circleX, this.circleY - this.radius, 0, 
		this.process / 100 * 360);
	// 控制动画速度
	if(this.process / this.percent > 0.90){
		this.process += 0.30;
	}else if(this.process / this.percent > 0.80){
		this.process += 0.55;
	}else if(this.process / this.percent > 0.70){
		this.process += 0.75;
	}else{
		this.process += 1.0;
	}
};

draw.prototype.clearAllTimeouts = function(){
	var id = setTimeout(() => {}, 0);
	while(id > 0){
		clearTimeout(id);
		id--;
	}
};

export default draw;