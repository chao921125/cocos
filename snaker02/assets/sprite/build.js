cc.Class({
    extends: cc.Component,

    properties: {
        rect0:cc.Prefab,
        rect1:cc.Prefab,
        rect2:cc.Prefab,
        rect3:cc.Prefab,
        rect4:cc.Prefab,
        rect5:cc.Prefab,
        rect6:cc.Prefab,
        rect7:cc.Prefab,
       //播放预制资源
       player:cc.Prefab,
       basepoint:cc.Prefab,
       //按钮节点
       button:cc.Label,
       score:cc.Label,
       over:cc.Node,
       //速度调节滑动
       sliderv:cc.Slider,
       //音频
       audio:cc.AudioClip,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        cc.log("onload start");
        //游戏状态  0-暂停 1-运行 2-游戏结束 
        this.gameState = 1;
        //音效
        cc.audioEngine.playEffect(this.audio, true);
        //分数
        this.scoreNum=0;
        //边界值
        this.leftX;
        this.rightX;
        //速度
        this.speed=0.5;
        //方向,up-0,down-1,left-2,right-3
        this.direction = 0;
        //贪吃蛇数组,二位数组
        this.snakeArrX=[];
        this.snakeArrY=[];
        this.snakeArr=[];
        //地图上随机生成果实(x,y)坐标
        this.nextGoal = Math.floor(7*Math.random());
        this.goalX = Math.floor(10*Math.random());
        this.goalY = Math.floor(15*Math.random());
        //设置贪吃蛇头部
         this.snakeHead = cc.instantiate(this.rect7).getComponent('rect');
         this.snakeHead.node.x=240;
         this.snakeHead.node.y=336;
         var box=cc.find('Canvas/box');
         box.addChild(this.snakeHead.node);
         this.snakeArrX[0]=this.snakeHead.node.x;
         this.snakeArrY[0]=this.snakeHead.node.y;
         this.snakeArr[0] = this.snakeHead;
         //地图
         this.boxMap=[];
         for(let i=0;i<10;i++){
            this.boxMap[i]=[];
            for(let j=0;j<15;j++){
                this.boxMap[i][j]=0;
            }
         }
        //注册按下监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
       //this.ontouchmove();
       this.setGame();

        cc.log("onload end");

    },
    //
    setGame(){
        cc.log("setGame start");
         //下个果实方块
         var goal = this.nextGoal;
         this.buildBody(goal);
         cc.log("setGame end");
    },
    //获取颜色后实例化6种图像,还有一个种作为head
    buildBody(goal){
        cc.log("goal:"+goal);
         this.produceFoot();
         //移动
         this.schedule(this.move,this.speed);
         cc.log("goal2:"+goal);

    },
    //检测果实生成位置是否重叠贪吃蛇
    overlapFoot(){
        this.goalX = Math.floor(10*Math.random());
        this.goalY = Math.floor(15*Math.random());
        //判断贪吃蛇所有部位是否重叠
        for(let j=0;j<this.snakeArrX.length;j++){
            if(this.boxMap[this.goalX][this.goalY]===1){
                //重新生成，并且重新检测
                this.overlapFoot();
                break;
            }
        }
        this.produceFoot();
    },
    //生成果实
    produceFoot(){
        this.nextGoal = Math.floor(7*Math.random());
        //随机生成某种颜色
         if(this.nextGoal===0){this.prefab=this.rect0;}
         if(this.nextGoal===1){this.prefab=this.rect1;}
         if(this.nextGoal===2){this.prefab=this.rect2;}
         if(this.nextGoal===3){this.prefab=this.rect3;}
         if(this.nextGoal===4){this.prefab=this.rect4;}
         if(this.nextGoal===5){this.prefab=this.rect5;}
         if(this.nextGoal===6){this.prefab=this.rect6;}
        //贪吃蛇身体
         this.snakeBody = cc.instantiate(this.prefab).getComponent('rect');
         var box=cc.find('Canvas/box');
         box.addChild(this.snakeBody.node);
         this.snakeBody.node.x=this.goalX*48;       
         this.snakeBody.node.y=this.goalY*48;
         //记录地图这里已经有果实
         var boxMapX = this.snakeBody.node.x/48;
         var boxMapY = this.snakeBody.node.y/48;
         this.boxMap[boxMapX][boxMapY]=1;
    },
    //吃到果实
    eatFoot(){
         var boxMapX = this.snakeHead.node.x/48;
         var boxMapY = this.snakeHead.node.y/48;
        //判断是否位置是否有果实
        if(this.boxMap[boxMapX][boxMapY]===1){
            //cc.log("位置有果实");
            //加在尾部
            var len = this.snakeArrX.length;
            this.snakeArrX[len]=this.snakeBody.node.x;
            this.snakeArrY[len]=this.snakeBody.node.y;
            this.snakeArr[len]=this.snakeBody;
            //果实被吃了 
            this.boxMap[boxMapX][boxMapY]=0;
            //加分数
            this.addScore();
            //随机生成下一个果实
            this.overlapFoot();
        }
    },
    //加分数
    addScore(){
        //根据不同果实增加分数
        if(this.nextGoal===0){this.scoreNum+=50;}
        if(this.nextGoal===1){this.scoreNum+=100;}
        if(this.nextGoal===2){this.scoreNum+=200;}
        if(this.nextGoal===3){this.scoreNum+=300;}
        if(this.nextGoal===4){this.scoreNum+=400;}
        if(this.nextGoal===5){this.scoreNum+=500;}
        if(this.nextGoal===6){this.scoreNum+=600;}
        this.score.string=this.scoreNum;
    },
    //移动方法
    move (){
        //方向,up-0,down-1,left-2,right-3
        if(this.direction===0){
            //移动前，判断游戏是否结束
            this.isGameOver(this.snakeHead.node.x,this.snakeHead.node.y+48);
            if(this.gameState===1){
                this.snakeHead.node.y+=48; 
            }
            //cc.log("up");
        }else if(this.direction===1){
            //移动前，判断游戏是否结束
            this.isGameOver(this.snakeHead.node.x,this.snakeHead.node.y-48);
               
            if(this.gameState===1){
                this.snakeHead.node.y-=48;
            }
           // cc.log("down");
        }else if(this.direction===2){
            this.isGameOver(this.snakeHead.node.x-48,this.snakeHead.node.y);
            
            if(this.gameState===1){
                this.snakeHead.node.x-=48;
            }
            //cc.log("left");
        }else if(this.direction===3){
            //移动前，判断游戏是否结束
            this.isGameOver(this.snakeHead.node.x+48,this.snakeHead.node.y);
             
            if(this.gameState===1){
                this.snakeHead.node.x+=48;
            }
            //cc.log("right");
        }
        if(this.gameState===1){
            this.eatFoot();
            this.moveAll();
        }
    },
    //移动的时候，身体也向头移动
    moveAll(){
        for(let i=this.snakeArrX.length-1;i>0;i--){
            this.snakeArrX[i]=this.snakeArrX[i-1];
            this.snakeArrY[i]=this.snakeArrY[i-1];
        }
        //更新贪吃蛇头部位置,贪吃蛇随头部移动
        this.snakeArrX[0]=this.snakeHead.node.x;
        this.snakeArrY[0]=this.snakeHead.node.y;
        for(let j=1;j<this.snakeArrX.length;j++){
            this.snakeArr[j].node.x=this.snakeArrX[j];
            this.snakeArr[j].node.y=this.snakeArrY[j];
        }
        cc.log("moveAll"+this.snakeArrX.length);
    },
    //键盘监听
    onKeyDown (event) {
            switch(event.keyCode) {
                case cc.KEY.a:
                case cc.KEY.left:
                   // cc.log("key code is  a and left");
                   if(this.direction!=3){
                        this.direction=2;
                   }
                    break;
                case cc.KEY.d:
                case cc.KEY.right:
                  // cc.log("key code is  d and right");
                   if(this.direction!=2){
                     this.direction=3;
                   }
                    break;
                case cc.KEY.w:
                case cc.KEY.up:
                   // cc.log("key code is  w and up");
                    if(this.direction!=1){
                     this.direction=0;
                    }
                    break;
                case cc.KEY.s:
                case cc.KEY.down:
                   // cc.log("key code is  s and down");
                    if(this.direction!=0){
                        this.direction=1;
                    }
                    break;
            }
    },
    //判断游戏结束的条件
    isGameOver(x,y){
         //判断是否超出地图
        if(x<0 || x>=480 || y<0 || y>=720){
            this.gameOver();
            return;
        }
        //判断是否碰撞到贪吃蛇身体
        for(let i=0;i<this.snakeArrX.length;i++){
            if(this.snakeArrX[i]==x && this.snakeArrY[i]==y){
                this.gameOver();
                return;
            }
        }
    },
    //游戏结束
    gameOver (){
            //游戏状态
            this.gameState = 2;
            //将失败的画面显示出来
            this.over.active=true;
            //停止移动
            this.unschedule(this.move);
            //停止所有音乐
            cc.audioEngine.stopAll();
        
    },
    //暂停游戏
    pause(){
        //2表示游戏结束
        if(this.gameState!==2){
            if(this.gameState===1){
                this.gameState=0;
                this.button.string = "Play";
                //停止移动
                this.unschedule(this.move);
            }else if(this.gameState===0){
                this.gameState=1;
                this.button.string = "Pause";
                //停止移动
                this.schedule(this.move,this.speed);
            }
        }
    },
    //重新开始游戏
    replay(){
         //重新加载游戏场景
        cc.director.loadScene("snaker");
    },
});

