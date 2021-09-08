/**
 * 角色控制
 */
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SoldierControl
 * DateTime = Wed Sep 08 2021 16:53:16 GMT+0800 (中国标准时间)
 * Author = hcprecog
 * FileBasename = SoldierControl.ts
 * FileBasenameNoExtension = SoldierControl
 * URL = db://assets/script/SoldierControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SoldierControl')
export class SoldierControl extends Component {
    // [1]
    // dummy = '';
    // 是否开始跳跃
    private isJumpStart = false;
    // 跳跃步长
    private jumpStep = 0;
    // 跳跃时间
    private jumpTimeCurrent = 0;
    private jumpTIme = 0.1;
    // 速度
    private jumpSpeedCurrent = 0;
    // 位置
    private jumpPositionCurrent = new Vec3();
    private jumpPositionTarget = new Vec3();

    // [2]
    // @property
    // serializableDummy = 0;

    // 创建
    onEnable () {}
    // 执行一次
    start () {
        // systemEvent.addEventListener
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    // 
    update () {}
    lastUpdate () {}
    // 禁用
    onDisable () {}
    // 销毁
    onDestroy () {}

    onMouseUp (event: EventMouse) {
        if (event.getButton() === 0) {
            this.fnJumpStep(1);
        } else if (event.getButton() === 2) {
            this.fnJumpStep(2);
        }
    }
    fnJumpStep (step: Number) {
        this.isJumpStart = true;
        this.jumpStep = step;
        this.jumpSpeedCurrent = this.jumpStep / this.jumpTime;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
