
cc.Class({
	extends: cc.Component,

	properties: {
		pickRadius: 0, // 星星和主角之间的距离小于这个数值时，就会完成收集
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
	},

	getPlayerDistance() {
		// var playerPos = this.game.player.getPosition();
		var playerPos = this.game.player.getCenterPos();
		// 计算两点之间的距离
		var dist = this.node.position.sub(playerPos).mag();
		return dist;
	},

	// 收集星星
	onPicked() {
		// 当星星被收集 调用Game脚本中的接口，生成一个新的星星
		this.game.spawnNewStar();
		// 获取得分
		this.game.gainScore();
		// 销毁当前星星节点
		this.node.destroy();
	},

	start() {

	},

	update(dt) {
		// 每帧判断和player之间的距离 
		if (this.getPlayerDistance() < this.pickRadius) {
			// 调用收集行为
			this.onPicked();
			return;
		}
		// 根据 Game 中的计时器更新星星的透明度
		var opacityRatio = 1 - this.game.timer / this.game.starDuration;
		var minOpacity = 50;
		this.node.opacity = minOpacity + Math.floor(opacityRatio * 255 - minOpacity)
	},
});
