// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		jumpHeight: 0, // 跳跃高度
		jumpDuration: 0, // 跳跃持续时间
		maxMoveSpeed: 0, // 最大移动速度
		accel: 0, // 加速度
		// 跳跃音效
		jumpAudio: {
			default: null,
			type: cc.AudioClip
		}
	},
	setJumpAction() {
		// 跳跃上升
		const jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut())
		// 下降
		const jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn())
		// 添加回调函数 用于在动作结束后播放音频
		var callback = cc.callFunc(this.playJumpSound, this)
		// 不断重复, 每次完成落地动作后 调用回调来播放声音
		return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
	},
	onKeyDown(event) {
		switch (event.keyCode) {
			case cc.macro.KEY.a:
				this.accLeft = true;
				break;
			case cc.macro.KEY.d:
				this.accRight = true;
				break;
			default:
				break;
		}
	},
	onKeyUp(event) {
		switch (event.keyCode) {
			case cc.macro.KEY.a:
				this.accLeft = false
				break;
			case cc.macro.KEY.d:
				this.accRight = false
				break;
			default:
				break;
		}
	},
	playJumpSound() {
		cc.audioEngine.playEffect(this.jumpAudio, false);
	},

	getCenterPos() {
		var centerPos = cc.v2(this.node.x, this.node.y + this.node.height/2);
		return centerPos;
},

	// player 开始移动
	startMoveAt(pos) {
		this.xSpeed = 0;
		this.node.setPosition(pos);
		this.node.runAction(this.jumpAction);
	},

	// 停止移动
	stopMove: function () {
		this.node.stopAllActions();
	},

	onLoad: function () {
		// 初始化跳跃动作
		this.jumpAction = this.setJumpAction();
		// this.node.runAction(this.jumpAction);

		// 加速度方向开关
		this.accLeft = false;
		this.accRight = false;
		// 主角当前水平方向速度
		this.xSpeed = 0;

		// 初始化键盘输入监听
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
	},

	onDestroy() {
		// 取消键盘输入监听
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
	},

	start() {

	},

	update(dt) {
		if (this.accLeft) {
			this.xSpeed -= this.accel * dt
		} else if (this.accRight) {
			this.xSpeed += this.accel * dt
		}

		// 限制速度最大值
		if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
			this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
		}

		// 根据速度更新位置
		this.node.x += this.xSpeed * dt
	},
});
