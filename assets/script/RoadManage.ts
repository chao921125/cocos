import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { SoldierControl } from './SoldierControl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RoadManage
 * DateTime = Thu Sep 09 2021 14:56:27 GMT+0800 (中国标准时间)
 * Author = hcprecog
 * FileBasename = RoadManage.ts
 * FileBasenameNoExtension = RoadManage
 * URL = db://assets/script/RoadManage.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
enum BlockType {
    BT_NONE,
    BT_STONE
}

enum GameState {
    GS_INIT,
    GS_PLAY,
    GS_END
}

@ccclass('RoadManage')
export class RoadManage extends Component {
    @property({ type: Prefab })
    prefabCurrent: Prefab | null = null!;

    @property
    roadLength: number = 100;

    @property({ type: SoldierControl })
    playControl: SoldierControl = null!;

    @property({ type: Node })
    startMenu: Node = null!;


    private enumRoadType: BlockType[] = [];
    // private gameStateCurrent: GameState = GameState.GS_INIT;

    set gameState(value: GameState) {
        switch (value) {
            case GameState.GS_PLAY:
                this.startMenu.active = false;
                setTimeout(() => {this.playControl.setInputActive(true)}, 0.1);
                break;
            case GameState.GS_END:
                break;
            default:
                this.init();
                break;
        }
    }

    init() {
        this.generateRoad();
        this.startMenu.active = true;
        this.playControl.setInputActive(false);
        this.playControl.resetAll();
    }

    start() {
        this.gameState = GameState.GS_INIT;
        this.playControl.node.on("jumpEnd", this.onGameEnd, this);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    generateRoad() {
        this.node.removeAllChildren();
        this.enumRoadType = [];
        this.enumRoadType.length = 0;
        // 默认初始化一个石头站立
        this.enumRoadType.push(BlockType.BT_STONE);
        for (let i = 1; i < this.roadLength; i++) {
            if (this.enumRoadType[i - 1] === BlockType.BT_NONE) {
                this.enumRoadType.push(BlockType.BT_STONE);
            } else {
                this.enumRoadType.push(Math.floor(Math.random() * 2));
            }
        }
        // 
        for (let j = 0; j < this.roadLength; j++) {
            const child = this.spwanBlockByType(this.enumRoadType[j]);
            // 是否是实体路面
            if (child) {
                this.node.addChild(child);
                child.setPosition(j, 0, 0);
            }
        }
    }

    spwanBlockByType(type: BlockType) {
        // 根据类型返回道路
        if (!this.prefabCurrent) {
            return null;
        }
        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE: block = instantiate(this.prefabCurrent); break;
        }
        return block;
    }

    onStartButtonClicked() {
        this.gameState = GameState.GS_PLAY;
    }

    onGameEnd(moveIndex: number) {
        if (moveIndex < this.roadLength) {
            if (this.enumRoadType[moveIndex] === BlockType.BT_NONE) {
                this.gameState = GameState.GS_INIT;
            }
        } else {
            this.gameState = GameState.GS_INIT;
        }
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
