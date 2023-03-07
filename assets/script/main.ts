import { AudioManager } from './framework/audioManager';
import { GameManager } from './fight/gameManager';
import { constant } from './framework/constant';
import { clientEvent } from './framework/clientEvent';
import { _decorator, Component, game, Game, PhysicsSystem, Node, profiler, TERRAIN_HEIGHT_BASE } from 'cc';
import { playerData } from './framework/playerData';
import { StorageManager } from './framework/storageManager';
import { localConfig } from './framework/localConfig';
import { util } from './framework/util';
import { SdkUtil } from './framework/sdkUtil';
import { uiManager } from './framework/uiManager';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Node)
    public ndGameStart: Node = null!;

    private _minLoadDuration: number = 3.5;//加载开屏最小持续时间
    private _curLoadDuration: number = 0;//当前加载开屏界面时间
    private _isHideNdGameStart: boolean = false;//是否把gameStart这个节点隐藏
    private _scriptFightPanel: any = null!;
    private _scriptHomePanel: any = null!;

    onEnable () {
        clientEvent.on(constant.EVENT_TYPE.REMOVE_NODE_GAME_START, this._removeNdGameStart, this);
    }

    onDisable () {
        clientEvent.off(constant.EVENT_TYPE.REMOVE_NODE_GAME_START, this._removeNdGameStart, this);
    }

    start () {
        let frameRate = StorageManager.instance.getGlobalData("frameRate");
        if (typeof frameRate !== "number") {
            frameRate = constant.GAME_FRAME;
            //@ts-ignore
            if (window.wx && util.checkIsLowPhone()) {
                frameRate = 30;
            } 

            StorageManager.instance.setGlobalData("frameRate", frameRate);
        } 

        console.log("###frameRate", frameRate);

        game.frameRate = frameRate;
        PhysicsSystem.instance.fixedTimeStep = 1 / frameRate;


        let isDebugOpen = StorageManager.instance.getGlobalData("debug") ?? false;
        isDebugOpen === true ? profiler.showStats() : profiler.hideStats();

        this.ndGameStart.active = true;       
        this._curLoadDuration = 0; 

        //@ts-ignore
        if (window.cocosAnalytics) {
            //@ts-ignore
            window.cocosAnalytics.init({
                appID: "605630324",              // 游戏ID
                version: '1.0.0',           // 游戏/应用版本号
                storeID: "cocosPlay",     // 分发渠道
                engine: "cocos",            // 游戏引擎
            });
        }
        
        playerData.instance.loadGlobalCache();
        if (!playerData.instance.userId) {
            playerData.instance.generateRandomAccount();
            console.log("###生成随机userId", playerData.instance.userId);
        }

        playerData.instance.loadFromCache();

        if (!playerData.instance.playerInfo || !playerData.instance.playerInfo.createDate) {
            playerData.instance.createPlayerInfo();
        }

        //加载CSV相关配置
        localConfig.instance.loadConfig(()=>{
            this._loadFinish();
            SdkUtil.shareGame(constant.GAME_NAME_CH, "");
        })

        // AudioManager.instance.init();
        AudioManager.instance.setMusic(0.3);

        //引导
        //GuideManager.instance.start();

        //加载子包
        // SubPackageManager.instance.loadAllPackage();

        //记录离线时间
        game.on(Game.EVENT_HIDE, ()=>{
            if (!playerData.instance.settings) {
                playerData.instance.settings = {}
            }

            playerData.instance.settings.hideTime = Date.now();
            playerData.instance.saveAll();
            StorageManager.instance.save();
        })
    }

    private _loadFinish () {
        GameManager.isFirstLoad = true;

        uiManager.instance.showDialog("home/homePanel", [()=>{
            if (this._scriptFightPanel) {
                this._scriptFightPanel.node.active = true;
            }
        }], (script: any)=>{                
            this._scriptHomePanel = script;

            uiManager.instance.showDialog("fight/fightPanel", [], (script: any)=>{
                this._scriptFightPanel = script;
                script.node.active = false;
                clientEvent.dispatchEvent(constant.EVENT_TYPE.ON_GAME_INIT);
            }, constant.PRIORITY.ZERO);
        }, constant.PRIORITY.ZERO);
    }

    private _removeNdGameStart () {
        this._isHideNdGameStart = true;
        this._scriptHomePanel.node.setSiblingIndex(this._scriptHomePanel.node.parent.children.length - 1);
    }

    update (deltaTime: number) {
        if (this.ndGameStart.parent) {
            this._curLoadDuration += deltaTime;
            if (this._curLoadDuration >= this._minLoadDuration && this._isHideNdGameStart) {
                this.ndGameStart.removeFromParent();   
            }
        }
    }
}
