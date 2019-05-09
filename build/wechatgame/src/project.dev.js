window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30435j/b59F34gVUxmE/6iC", "Game");
    "use strict";
    var Player = require("Player");
    cc.Class({
      extends: cc.Component,
      properties: {
        starPrefab: {
          default: null,
          type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        ground: {
          default: null,
          type: cc.Node
        },
        player: {
          default: null,
          type: Player
        },
        scoreDisplay: {
          default: null,
          type: cc.Label
        },
        scoreAudio: {
          default: null,
          type: cc.AudioClip
        },
        playBtn: {
          default: null,
          type: cc.Node
        },
        gameOverNode: {
          default: null,
          type: cc.Node
        },
        InstrControl: {
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {
        this.groundY = this.ground.y + this.ground.height / 2;
        this.currentStar = null;
        this.currentStarX = 0;
        this.timer = 0;
        this.starDuration = 0;
        this.score = 0;
        this.enabled = false;
        this.playBtn.active = true;
        this.starPool = new cc.NodePool("Star");
        cc.sys.platform === cc.sys.WECHAT_GAME ? this.InstrControl.string = "\u5de6\u8fb9\u957f\u6309\uff1a\u5411\u5de6\u52a0\u901f\n\u53f3\u8fb9\u957f\u6309\uff1a\u5411\u53f3\u52a0\u901f" : console.log(this.InstrControl.string, "==");
      },
      onGameStart: function onGameStart() {
        this.resetScore();
        this.enabled = true;
        this.gameOverNode.active = false;
        this.playBtn.active = false;
        this.player.startMoveAt(cc.v2(0, this.groundY));
        this.spawnNewStar();
      },
      spawnNewStar: function spawnNewStar() {
        var newStar = null;
        newStar = this.starPool.size() > 0 ? this.starPool.get(this) : cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent("Star").game = this;
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
        this.currentStar = newStar;
      },
      resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = "Score: " + this.score.toString();
      },
      getNewStarPosition: function getNewStarPosition() {
        var maxX = this.node.width / 2;
        this.currentStar || (this.currentStarX = 2 * (Math.random() - .5) * maxX);
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        randX = this.currentStarX >= 0 ? -Math.random() * maxX : Math.random() * maxX;
        this.currentStarX = randX;
        return cc.v2(randX, randY);
      },
      start: function start() {},
      update: function update(dt) {
        if (this.timer > this.starDuration) {
          this.gameOver();
          this.enabled = false;
          return;
        }
        this.timer += dt;
      },
      gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
      },
      gameOver: function gameOver() {
        this.gameOverNode.active = true;
        this.playBtn.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        console.log("game over");
      }
    });
    cc._RF.pop();
  }, {
    Player: "Player"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b068kMWcNBtqq+97ANNR3u", "Player");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        jumpAudio: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.enabled = false;
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;
        this.jumpAction = this.setJumpAction();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on("touchstart", this.onTouchStart, this);
        touchReceiver.on("touchend", this.onTouchEnd, this);
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off("touchstart", this.onTouchStart, this);
        touchReceiver.off("touchend", this.onTouchEnd, this);
      },
      onKeyDown: function onKeyDown(event) {
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
        }
      },
      onTouchStart: function onTouchStart(event) {
        var touchLoc = event.getLocation();
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
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
      },
      playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
      },
      getCenterPos: function getCenterPos() {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
      },
      startMoveAt: function startMoveAt(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.jumpAction);
      },
      stopMove: function stopMove() {
        this.node.stopAllActions();
        this.enabled = false;
      },
      start: function start() {},
      update: function update(dt) {
        this.accLeft ? this.xSpeed -= this.accel * dt : this.accRight && (this.xSpeed += this.accel * dt);
        Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
        this.node.x += this.xSpeed * dt;
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
  }, {} ],
  Star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a915vGqGZA9Z6RaLK2sZry", "Star");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        pickRadius: 0
      },
      onLoad: function onLoad() {},
      getPlayerDistance: function getPlayerDistance() {
        var playerPos = this.game.player.getCenterPos();
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
      },
      onPicked: function onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
      },
      start: function start() {},
      update: function update(dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
          this.onPicked();
          return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(255 * opacityRatio - minOpacity);
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Game", "Player", "Star" ]);