// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var timeC = 0.02;
var async = require('./async');
cc.Class({
    extends: cc.Component,

    properties: {
        //贪吃蛇 玩家 预制件
        mPlaySanke:{
            default:null,
            type:cc.Prefab
        },
        //摇杆-方向操作 预制件
        mYK:{
            default:null,
            type:cc.Prefab,
        },
        //摄像机
        mCamera:{
            default:null,
            type:cc.Camera,
        },
        //控制update循环-玩家加速减速控制
        time_fiex:0,
        //控制电脑 均速
        time_fiex2:0,
        //加速按钮
        mSpeedBtn:{
            default:null,
            type:cc.Prefab,
        },
        //食物预制件
        mFood:{
            default:null,
            type:cc.Prefab,
        },
        //实物预制件
        mGameOverUI:{
            default:null,
            type:cc.Node,
        },
        _mScene:null,//场景
        _mTimeFood:0,//用来定时随机食物
        _mTimeConputer:0,//用来定时随机电脑
        //电脑-测试
        mSnakeAI:{
            type:cc.Prefab,
            default:[],
        },
        //电脑-数组
        _mSnakeArr:[],
        //电脑人数
        _mSnankeNum:10,
        //食物对象池
        _myFoodPool:{
            type:cc.NodePool,
            default:null,
        },
        //电脑贪吃蛇对象池
        _mSnakePool:{
            type:cc.NodePool,
            default:null,
        },
        //电脑贪吃蛇-身体-对象池
        _mSnakeChildrenPool:{
            type:cc.NodePool,
            default:null,
        },
        //身体预制件
        snake_children:{
            default:null,
            type:cc.Prefab,
        },
    },
    // LIFE-CYCLE CALLBACKS:

    //创建食物
    createFood (randomNum){
        for(let i = 0; i < randomNum; i++) {
            var mFood = cc.instantiate(this.mFood);
            this._myFoodPool.put(mFood); // 通过 put 接口放入对象池
        }
    },
    //创建蛇的身体
    createChildren (randomNum){
        for(let i = 0; i < randomNum; i++) {
            var children = cc.instantiate(this.snake_children);
            this._mSnakeChildrenPool.put(children); // 通过 put 接口放入对象池
        }
    }, 
    //随机食物
    randomFood(randomNum){
        if(this._mScene.children[1].childrenCount >= 500){
            return false;
        }
        let array = async.myrange(0,this._myFoodPool.size());
        async.eachLimit(array, randomNum, (i, cb) => {
            var foodRom = null;
            if(this._myFoodPool.size() > 0 ){
                foodRom = this._myFoodPool.get(this._myFoodPool);
                foodRom.color = new cc.Color(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255));
                foodRom.active = true;
                foodRom.x = this.getRndInteger(-2499,2500) + 480;
                foodRom.y = this.getRndInteger(-2499,2500) + 320;
            }else{
                foodRom = cc.instantiate(this.mFood);
                foodRom.color = new cc.Color(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255));
                foodRom.active = true;
                foodRom.x = this.getRndInteger(-2499,2500) + 480;
                foodRom.y = this.getRndInteger(-2499,2500) + 320;
            }
            foodRom.parent = this._mScene.children[1];
            //this.scheduleOnce(() => cb());
        }, () => {
            //cc.log('main_food任务完成');
        });
    },
    randomConputerSnake(){
        let array = async.myrange(0,this._mSnakePool.size());
        async.eachLimit(array, 10, (i, cb) => {
            var snake_com = null;
            if(this._mSnakePool.size() > 0 ){
                snake_com = this._mSnakePool.get(this._mSnakePool);
            }else{
                snake_com = cc.instantiate(this.mSnakeAI);
            }
            //snake_com.x = 480;
            //snake_com.y = 320;
            //snake_com.children[snake_com.childrenCount-1].x = this.getRndInteger(-2000,2000);
            //snake_com.children[snake_com.childrenCount-1].y = this.getRndInteger(-2000,2000);
            snake_com.active = true;
            snake_com.parent = this._mScene.children[5];
            //this.scheduleOnce(() => cb());
        }, () => {
            //cc.log('main_food任务完成');
        });
    },
    //随机min 和max 之间数，从来设置坐标
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    },
    //封装-没用另写到封装函数内
    onLoad () {

        //是否暂停
        if(cc.director.isPaused()){
            //取消暂停
            cc.director.resume();
        }
        // 蛇预制体
        var sanke = this.mPlaySanke.data;
        //摇杆预制体
        var yaogan = this.mYK.data;
        //加速按钮
        var speedBtn = this.mSpeedBtn;

        //场景
        this._mScene = cc.director.getScene();
        //玩家-操作杆-加速按钮
        this.mPlaySanke = cc.instantiate(sanke);
        this.mYK = cc.instantiate(yaogan);
        this.mSpeedBtn = cc.instantiate(speedBtn);

        //创建电脑贪吃蛇对象池-注意对象池的名称一定要和预制体名称一致
        //this._mSnakePool = new cc.NodePool("snake_ai");
        //创建电脑贪吃蛇-身体-对象池
        this._mSnakeChildrenPool = new cc.NodePool("snake_children");
        this.createChildren(300);
        //设置电脑个数
        this._mSnankeNum = 12;
        //创建贪吃蛇电脑
        for(let i = 0; i < this._mSnankeNum; i++){
            var item = cc.instantiate(this.mSnakeAI[i]);
            //console.log(item);
            item.x = 480;
            item.y = 320;
            item.children[item.childrenCount-1].x = this.getRndInteger(-2000,2000);
            item.children[item.childrenCount-1].y = this.getRndInteger(-2000,2000);
            //item.parent = this._mScene;
            this._mSnakeArr.push(item);
            //this._mSnakePool.put(item);
        }
        //console.log(this.mSnakeAI);
        //初始化蛇位置
        this.mPlaySanke.x = 480;
        this.mPlaySanke.y = 320;
        this.mPlaySanke.mYg = this.mYK.children[1];
        this.mPlaySanke.parent = this._mScene;

        //初始化摇杆
        this.mYK.x = 130;
        this.mYK.y = 130;
        this.mYK.parent = this._mScene; 

        //初始化加速按钮
        this.mSpeedBtn.x = 840;
        this.mSpeedBtn.y = 120;
        this.mSpeedBtn.parent = this._mScene;
        //获取脚本
        this.mPlaySanke = this.mPlaySanke.getComponent("sanke_play");
        this.mPlaySanke.gameOver = false;
        this.mPlaySanke.mYg = this.mYK.children[1].getComponent('yg');
        this.mPlaySanke.mCamera = this.mCamera;

        this.mSpeedBtn = this.mSpeedBtn.getComponent("sanke_btn");
        this.mSpeedBtn.m_sanke = this.mPlaySanke.node;

        //初始化实物
        //创建食物对象池
        this._myFoodPool = new cc.NodePool("food");
        this.createFood(800);
        this.randomFood(500);
        //主界面场景-预加载
        /*
        cc.director.preloadScene('test', (completedCount,totalCount,item)=>{
        },()=>{
            cc.log('预加载test');
        });
        */
        //console.log(this._mSnakePool.size());
        console.log(this._myFoodPool.size());
        //电脑-测试用
        //this.mSnakeAI = this.mSnakeAI.getComponent("sanke_ai");
        
        for(let i = 0; i < this._mSnankeNum; i++){
            //var item = this._mSnakePool.get().getComponent("sanke_ai");
            var item = this._mSnakeArr[i].getComponent("sanke_ai");
            item.mSnakeStart = 1 + i;
            item.node.parent = this._mScene.children[5];
            //this._mSnakeArr.push(item);
            //电脑ID
            //this._mSnakeArr[i].mSnakeStart = 1 + i;
            //console.log(this._mSnakeArr[i]);
        }/**/
        
        
    }
    ,
    //游戏结束-触发的按钮
    onGameOver (e,data) {
        switch(data){
            case "back_main":
                console.log("返回大厅");
                cc.director.loadScene('test');
                //清除对象池
                this._myFoodPool.clear();
                //this._mSnakePool.clear();
                this._mSnakeChildrenPool.clear();
                break;
            case "fuhuo":
                //是否暂停
                if(cc.director.isPaused()){
                    //取消暂停
                    cc.director.resume();
                }
                //暂停状态
                this.mPlaySanke.gameOver = false;
                //关闭结束UI框
                this.node.children[0].active = false;
                //获取蛇头节点
                var headArr = this.mPlaySanke.node;
                var len = headArr.childrenCount;
                var head = headArr.children[len-1];
                head.x = this.getRndInteger(-2000,2000) + 480;
                head.y = this.getRndInteger(-2000,2000) + 320;
                var sankeObj = head.parent.getComponent('sanke_play');
                //坐标重置
                for(let i = 0; i < len; i++){
                    sankeObj.pos_set[i].x = head.x;
                    sankeObj.pos_set[i].y = head.y
                    sankeObj.pos_set[i].z = 0;
                }
                break;
            default:
                console.log("服务器繁忙!");
                break;
        }
    },
    start () { },
    //固定时间循环(手机配置有高低区分，防止手机配置好的循环次数快于配置差的手机)，
    fiexd_update(dt){
        /*
        cc.log("Food"+this._mScene.children[1].childrenCount);
        cc.log(this._myFoodPool.size());
        cc.log("children:");
        cc.log(this._mSnakeChildrenPool.size());
        cc.log("snake:");
        cc.log(this._mSnakePool.size());*/
        //console.log(this.node.parent.parent.children[5]);
        //玩家-贪吃蛇移动函数
        this.mPlaySanke.moveSanke(dt);
        //获取贪吃蛇脚本
        var sankeObj = this.mPlaySanke.getComponent("sanke_play");
        //计算-分数
        var Scores = this._mScene.children[2].getComponent(cc.Label);
        Scores.string = "Score:" + (this.mPlaySanke.getComponent("sanke_play")._m_food_num * 10);
        //计算-坐标参数
        var PosTex = this._mScene.children[3].getComponent(cc.Label);
        PosTex.string = "Pos:" + Math.floor(this.mPlaySanke.node.children[this.mPlaySanke.node.childrenCount - 1].x) + "-" + Math.floor(this.mPlaySanke.node.children[this.mPlaySanke.node.childrenCount - 1].y);
        //计算-身体放大-视距拉远参数
        var ValTex = this._mScene.children[4].getComponent(cc.Label);
        var z1 = Math.round(this.mCamera.zoomRatio * 100) / 100;
        var z2 = Math.round(this.mPlaySanke.node.scale * 100) / 100;
        ValTex.string = "xxx:" + this.mCamera.zoomRatio;
        
        //视距控制
        if( this.mCamera.zoomRatio>this.mPlaySanke.getComponent("sanke_play").mCZoomRatio ){
            this.mCamera.zoomRatio -= 0.01
        }
        //this.mCamera.zoomRatio = 0.2;
        /*
        //贪吃蛇缩放控制
        
        console.log("Scale:"+ this.mPlaySanke.getComponent("sanke_play").mSnakeScale);
        if(this.mPlaySanke.node.scale<this.mPlaySanke.getComponent("sanke_play").mSnakeScale){
            this.mPlaySanke.node.scale += 0.001;
        }
        //食物-每大概10秒随机刷新30个食物
        this._mTimeFood += dt;
        if(this._mTimeFood >= 100000000000){
        	this.onInitFood(20);
        	this._mTimeFood -= 10000000;
        }*/
        //console.log(this.mCamera.zoomRatio);
        this._mTimeFood += dt;
        if(this._mTimeFood >= 100){
            //获取对象池中的食物
            this.randomFood(100);
            this._mTimeFood -= 100;
        }

        this._mTimeConputer += dt;
        if(this._mTimeConputer >= 500){
            //获取对象池中的电脑
            //this.randomConputerSnake();
            this._mTimeConputer -= 500;
        }

        //控制游戏-暂停 不确定游戏复活是否这样做
        if(this.mPlaySanke.gameOver){
            cc.director.pause();
            PosTex.string = "游戏结束";
            //弹出结束UI框
            this.node.children[0].active = true;
        }

        //电脑

        var computer_snake_len = this.node.parent.parent.children[5];
        let array2 = async.myrange(0,computer_snake_len.childrenCount);
        var num_ram = this._mSnankeNum < 10 ? 10 : this._mSnankeNum;
        async.eachLimit(array2,num_ram, (i, cb) => {
            var item = computer_snake_len.children[i].getComponent("sanke_ai");
            item._m_random_time += dt;
            if( item._m_random_time >= 200 ){
                item.mRandomPos.x = this.getRndInteger(-10,11) / 10;
                item.mRandomPos.y = this.getRndInteger(-10,11) / 10;
                item._m_random_time -= 200;
            }
            //this.scheduleOnce(() => cb());
        }, () => {
            //cc.log('move_snake任务完成');
        });
    },
    update (dt) {
        //手机的配置各有不同，dt时间不一，设置固定update
        //控制贪吃蛇 速度
        this.time_fiex += Math.round(dt*100);
        //console.log(Math.round(dt*100));
        var tmp = this.mPlaySanke.speed_time;
        //console.log(tmp);
        //console.log(this.node.parent.parent.children[5]);
        //玩家
        while(this.time_fiex > tmp){
            this.time_fiex -= tmp;
            this.fiexd_update(tmp);
        }

        
        
        //电脑 速度控制-缺陷：玩家加速时，电脑移动有概率会抖动
        this.time_fiex2 += Math.round(dt*100);//不加速
        while(this.time_fiex2 > 2){ 
            this.time_fiex2 -= 2;

            var computer_snake_len = this.node.parent.parent.children[5];
            let array3 = async.myrange(0,computer_snake_len.childrenCount);
            //console.log(this.node.parent.parent.children[5].childrenCount);
            var num_ram = this._mSnankeNum < 10 ? 10 : this._mSnankeNum;
            async.eachLimit(array3,num_ram, (i, cb) => {

                var item = computer_snake_len.children[i].getComponent("sanke_ai");
                item.moveSanke(0.016);
                //this.scheduleOnce(() => cb());
            }, () => {
                //cc.log('snake_dei_inti任务完成');
            });

        }

        
    },
});
