import { constant } from './../../framework/constant';
import { uiManager } from './../../framework/uiManager';
import { _decorator, Component, Node, Tween, tween, UIOpacityComponent, UIComponent, easing, AnimationComponent } from 'cc';
import { clientEvent } from '../../framework/clientEvent';
import { GameManager } from '../../fight/gameManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingPanel')
export class LoadingPanel extends Component {
    @property(AnimationComponent)
    public aniCloud: AnimationComponent = null!;

    private _isShowOver: boolean = false;//
    private _isNeedHide: boolean = false;
    private _showCb: Function =  null!;
    private _hideCb: Function =  null!;

    onEnable () {
        clientEvent.on(constant.EVENT_TYPE.HIDE_LOADING_PANEL, this._hideLoadingPanel, this);
    }

    onDisable () {
        clientEvent.off(constant.EVENT_TYPE.HIDE_LOADING_PANEL, this._hideLoadingPanel, this);
    }

    start () {
        // [3]
    }

    public show (callback: Function) {
        this._isShowOver = false;
        this._isNeedHide = false;
        this._hideCb = null!;
        this._showCb = callback;

        this._showLoadingPanel();
    }

    private _hideLoadingPanel (callback?: Function) {
        this._hideCb = callback!;
        this._isNeedHide = true;
        if (this._isShowOver) {
            this._hideCb && this._hideCb();
            this.aniCloud.getState("cloudAnimationOut").time = 0;
            this.aniCloud.getState("cloudAnimationOut").sample();
            this.aniCloud.play("cloudAnimationOut");
            this.aniCloud.once(AnimationComponent.EventType.FINISHED, ()=>{
                uiManager.instance.hideDialog("loading/loadingPanel");
                uiManager.instance.showDialog("fight/fightPanel", [this]);
            });

            GameManager.scriptGameCamera.resetCamera();   
        }
    }

    private _showLoadingPanel () {
        this.aniCloud.getState("cloudAnimationIn").time = 0;
        this.aniCloud.getState("cloudAnimationIn").sample();
        this.aniCloud.play("cloudAnimationIn");
        this.aniCloud.once(AnimationComponent.EventType.FINISHED, ()=>{
            this._showCb && this._showCb();

            this._isShowOver = true;
            if (this._isNeedHide) {
                this._hideLoadingPanel(this._hideCb);
            }
        });
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}