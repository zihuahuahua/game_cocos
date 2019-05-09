const Player = require('Player');

cc.Class({
	extends: cc.Component,

	properties: {
		starPrefab: { // 引用星星的预制资源
			default: null,
			type: cc.Prefab
		},
		// 星星产生后 消失时间的随机范围
		maxStarDuration: 0,
		minStarDuration: 0,

		// 地面节点，用于确定星星生成的高度
		ground: {
			default: null,
			type: cc.Node
		},
		// player 节点，用于获取主角弹跳的高度，和控制主角行动开关
		player: {
			default: null,
			type: Player
		},
		// label 引用 分数板
		scoreDisplay: {
			default: null,
			type: cc.Label
		},
		// 得分音效
		scoreAudio: {
			default: null,
			type: cc.AudioClip
		},
		// play 按钮
		playBtn: {
			default: null,
			type: cc.Node
		},
		// gameOver 标签
		gameOverNode: {
			default: null,
			type: cc.Node
		}
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad: function () {
		// 获取地平面的 y 轴坐标
		this.groundY = this.ground.y + this.ground.height / 2;
		// 收集最后一颗星星的位置
		this.currentStar = null;
		this.currentStarX = 0;
		// 初始化计时器
		this.timer = 0;
		this.starDuration = 0;
		// // 生成一个新的星星
		// this.spawnNewStar();
		// 初始化计分
		this.score = 0;

		this.enabled = false; // 是否每帧执行该组件的 update 方法，同时也用来控制渲染组件是否显示

		// play 按钮显示
		this.playBtn.active = true;

		// 初始化星星
		this.starPool = new cc.NodePool('Star')
	},

	// 开始游戏
	onGameStart() {
		// 初始化得分
		this.resetScore();

		this.enabled = true;
		this.gameOverNode.active = false;
		this.playBtn.active = false;
		// 重置 player 位置
		this.player.startMoveAt(cc.v2(0, this.groundY));
		// 生成新星星
		this.spawnNewStar();

	},
	spawnNewStar: function () {
		var newStar = null;
		if (this.starPool.size() > 0) {
			newStar = this.starPool.get(this)
		} else {
			newStar = cc.instantiate(this.starPrefab);
		}
		// // 使用给定的模板在场景中生成一个新节点
		// var newStar = cc.instantiate(this.starPrefab);
		// 将新增的节点添加到 Canvas 节点下面
		this.node.addChild(newStar);
		// 为星星设置一个随机位置
		newStar.setPosition(this.getNewStarPosition());

		// 在星星组件上暂存 Game 对象的引用
		newStar.getComponent('Star').game = this;

		// 重置计时器，根据消失时间范围随机取一个值
		this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration)
		this.timer = 0;

		this.currentStar = newStar
	},

	resetScore() {
		this.score = 0;
		this.scoreDisplay.string = 'Score: ' + this.score.toString();
	},

	getNewStarPosition: function () {
		var maxX = this.node.width / 2;
		// 如果当前没有星星，生成一个随机的 x 坐标
		if (!this.currentStar) {
			this.currentStarX = (Math.random() - 0.5) * 2 * maxX
		}
		var randX = 0;
		// 根据地平面位置和 Player 跳跃高度，随机得到一个星星的 y 坐标
		var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
		// 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
		if (this.currentStarX >= 0) {
			randX = -Math.random() * maxX
		} else {
			randX = Math.random() * maxX
		}
		this.currentStarX = randX
		// randX = (Math.random() - 0.5) * 2 * maxX;
		// 返回星星坐标
		return cc.v2(randX, randY);
	},

	start() {

	},

	update(dt) {
		// 每帧更新计时器,超过限度还没有生成新的星星,就会调用游戏失败逻辑
		if (this.timer > this.starDuration) {
			this.gameOver();
			this.enabled = false;
			return;
		}
		this.timer += dt;
	},

	gainScore() {
		this.score += 1;
		// 更新 label 文字
		this.scoreDisplay.string = 'Score: ' + this.score;
		// 播放音效
		cc.audioEngine.playEffect(this.scoreAudio, false)
	},

	gameOver() {
		// this.player.stopAllActions(); // 停止 player 节点的跳跃
		// cc.director.loadScene('game'); // 游戏失败时重新加载场景
		this.gameOverNode.active = true;
		this.playBtn.active = true;
		this.player.enabled = false;
		this.player.stopMove();
		this.currentStar.destroy();
		console.log('game over')
	}
});
