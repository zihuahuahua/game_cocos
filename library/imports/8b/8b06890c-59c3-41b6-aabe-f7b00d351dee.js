"use strict";
cc._RF.push(module, '8b068kMWcNBtqq+97ANNR3u', 'Player');
// scripts/Player.js

'use strict';

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

	onLoad: function onLoad() {
		this.enabled = false;

		// 加速度方向开关
		this.accLeft = false;
		this.accRight = false;
		// 主角当前水平方向速度
		this.xSpeed = 0;

		// 获取屏幕边界
		this.minPosX = -this.node.parent.width / 2;
		this.maxPosX = this.node.parent.width / 2;

		// 初始化跳跃动作
		this.jumpAction = this.setJumpAction();
		// this.node.runAction(this.jumpAction);

		// 初始化键盘输入监听
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

		// 初始化触摸事件监听
		var touchReceiver = cc.Canvas.instance.node;
		touchReceiver.on('touchstart', this.onTouchStart, this);
		touchReceiver.on('touchend', this.onTouchEnd, this);
	},

	onDestroy: function onDestroy() {
		// 取消键盘输入监听
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

		// 取消触摸事件监听
		var touchReceiver = cc.Canvas.instance.node;
		touchReceiver.off('touchstart', this.onTouchStart, this);
		touchReceiver.off('touchend', this.onTouchEnd, this);
	},
	onKeyDown: function onKeyDown(event) {
		// console.log(event,'event')
		// console.log(cc.macro.KEY)
		switch (event.keyCode) {
			case cc.macro.KEY.a:
			case cc.macro.KEY.left:
				this.accLeft = true;
				this.accRight = false;
				break;
			case cc.macro.KEY.d:
			case cc.macro.KEY.right:
				this.accRight = true;
				this.accLeft = false;
				break;
			default:
				break;
		}
	},
	onKeyUp: function onKeyUp(event) {
		switch (event.keyCode) {
			case cc.macro.KEY.a:
			case cc.macro.KEY.left:
				this.accLeft = false;
				break;
			case cc.macro.KEY.d:
			case cc.macro.KEY.right:
				this.accRight = false;
				break;
			default:
				break;
		}
	},
	onTouchStart: function onTouchStart(event) {
		// console.log(event, 'event')
		var touchLoc = event.getLocation();
		// console.log(touchLoc, 'touchLoc')
		if (touchLoc.x >= cc.winSize.width / 2) {
			this.accLeft = false;
			this.accRight = true;
		} else {
			this.accLeft = true;
			this.accRight = false;
		}
	},
	onTouchEnd: function onTouchEnd(event) {
		this.accLeft = false;
		this.accRight = false;
	},
	setJumpAction: function setJumpAction() {
		// 跳跃上升
		var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
		// 下降
		var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
		// 添加回调函数 用于在动作结束后播放音频
		var callback = cc.callFunc(this.playJumpSound, this);
		// 不断重复, 每次完成落地动作后 调用回调来播放声音
		return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
	},
	playJumpSound: function playJumpSound() {
		cc.audioEngine.playEffect(this.jumpAudio, false);
	},
	getCenterPos: function getCenterPos() {
		var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2);
		return centerPos;
	},


	// player 开始移动
	startMoveAt: function startMoveAt(pos) {
		this.enabled = true;
		this.xSpeed = 0;
		this.node.setPosition(pos);
		this.node.runAction(this.jumpAction);
	},


	// 停止移动
	stopMove: function stopMove() {
		this.node.stopAllActions();
		this.enabled = false;
	},

	start: function start() {},
	update: function update(dt) {
		// 根据当前加速度方向每帧更新速度
		if (this.accLeft) {
			this.xSpeed -= this.accel * dt;
		} else if (this.accRight) {
			this.xSpeed += this.accel * dt;
		}

		// 限制速度最大值
		if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
			this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
		}

		// 根据速度更新 player 位置
		this.node.x += this.xSpeed * dt;

		// 限制 player 在屏幕内移动
		if (this.node.x >= this.node.parent.width / 2) {
			this.node.x = this.node.parent.width / 2;
			this.xSpeed = 0;
		} else if (this.node.x < -this.node.parent.width / 2) {
			this.node.x = -this.node.parent.width / 2;
			this.xSpeed = 0;
		}
	}
});

cc._RF.pop();