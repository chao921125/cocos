/**
 * 角色控制
 */
import { _decorator, Component, Node, systemEvent, SystemEvent, EventMouse, Vec3, Animation } from 'cc';
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
    @property({ type: Animation })
    jumpAnim: Animation | null = null!;

    // 是否开始跳跃
    private isJumpStart: boolean = false;
    private isJumpMoving: boolean = false;
    // 跳跃步长
    private jumpStep: number = 0;
    // 跳跃时间
    private jumpTimeCurrent: number = 0;
    private jumpTime: number = 0.4;
    // 速度
    private jumpSpeedCurrent: number = 0;
    private jumpSpeed: number = 2;
    // 位置
    private jumpPositionCurrent = new Vec3();
    private jumpPositionTarget = new Vec3();
    private jumpDeltaPosition = new Vec3();
    // 当前任务所在索引位置
    private jumpPositionIndex: number = 0;

    // [2]
    // @property
    // serializableDummy = 0;

    // 创建
    onEnable() {}
    // 执行一次
    start() {
        // systemEvent.addEventListener
        // systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    // 
    update(deltaTime: number) {
        this.fnJumpStart(deltaTime);
    }
    lastUpdate() {}
    // 禁用
    onDisable() {}
    // 销毁
    onDestroy() {}

    setInputActive(active: boolean) {
        if (active) {
            systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }
    
    // 鼠标点击
    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.fnJumpStep(1);
        } else if (event.getButton() === 2) {
            this.fnJumpStep(2);
        }
    }
    
    // 设置步长
    fnJumpStep(step: number) {
        // 并发如果多次点击且当前未执行结束，那么返回
        if (this.isJumpMoving) {
            return false;
        }
        this.isJumpMoving = true;
        // 初始化跳跃
        this.isJumpStart = true;
        // 获取步长
        this.jumpStep = step;
        // 当前跳跃速度 = 步长 / 跳跃时间
        this.jumpSpeedCurrent = this.jumpStep / this.jumpTime;
        // 当前跳跃时间重置
        this.jumpTimeCurrent = 0;
        // 获取当前节点位置信息
        this.node.getPosition(this.jumpPositionCurrent);
        // 步长及当前位置设置进去
        Vec3.add(this.jumpPositionTarget, this.jumpPositionCurrent, new Vec3(this.jumpStep, 0, 0));
        // 获取当前动画效果
        if (this.jumpAnim) {
            this.jumpAnim.getState("jump01").speed = this.jumpSpeed;
            this.jumpAnim.play("jump01");
        }
        this.jumpPositionIndex += step;
    }

    fnJumpStart(deltaTime: number) {
        if (this.isJumpStart) {
            this.jumpTimeCurrent += deltaTime;
            if (this.jumpTimeCurrent > this.jumpTime) {
                this.node.setPosition(this.jumpPositionTarget);
                this.isJumpStart = false;
                this.fnJumpEnd();
            } else {
                this.node.getPosition(this.jumpPositionCurrent);
                this.jumpDeltaPosition.x = this.jumpSpeedCurrent * deltaTime;
                Vec3.add(this.jumpPositionCurrent, this.jumpPositionCurrent, this.jumpDeltaPosition);
                this.node.setPosition(this.jumpPositionCurrent);
            }
        }
    }
    fnJumpEnd() {
        this.isJumpMoving = false;
        // 结束跳跃动作
        if (this.jumpAnim) {
            this.jumpAnim.play("idle02");
            this.node.emit("jumpEnd", this.jumpPositionIndex);
        }
    }

    // 重置信息
    resetAll() {
        this.node.setPosition(-6.429, 0.652, 0.105);
        this.jumpPositionIndex = 0;
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
