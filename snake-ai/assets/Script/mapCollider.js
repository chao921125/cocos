// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var async = require('./async');
cc.Class({
    extends: cc.Component,

    properties: {
        mPrefab:{
            type:cc.Prefab,
            default:null,
        }
    },
    reuse(snakeManager) {
        /*
        setTimeout(function () {
          this.destroy();
        }.bind(snakeManager), 200);
        
        if(!snakeManager){
            setTimeout(function () {
              this.node.destroy();
            }.bind(self), 200);
        }*/
        console.log(snakeManager);
    },
    // LIFE-CYCLE CALLBACKS:
    onCollisionEnter: function (other,self){
        //判断玩家撞墙
        if( other.node.parent.name == "sanke_play" && other.node.name == "sanke_play_head" ){
            var snakeObj = other.node.parent.getComponent('sanke_play');
            snakeObj.gameOver = true;//死亡的状态 
        //判断电脑撞墙
        }else if( other.node.name.substring(11) == "head" ){
            //console.log("电脑碰墙了:" + other.node.parent.snake_index);
            //other.node.parent.active = false;//节点不显示
            var obj = other.node.parent.getComponent('sanke_ai');

            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = other.node.parent.childrenCount;
            var pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);
            /**/
            //pos_set数组下标
            /**/
            var pos_num = obj.point_num;
            //根据身体位置-随机食物
            for(let i = 0; i < children_num; i++){
                var foodRom = null;
                if(pool._myFoodPool.size() > 0 && i % 2 == 0){
                    foodRom = pool._myFoodPool.get(pool._myFoodPool);
                    foodRom.color = new cc.Color(pool.getRndInteger(0,255),pool.getRndInteger(0,255),pool.getRndInteger(0,255));
                    foodRom.active = true;
                    foodRom.x = arr[i*pos_num].x + 480 + pool.getRndInteger(-5,5);
                    foodRom.y = arr[i*pos_num].y + 320 + pool.getRndInteger(-5,5);
                    foodRom.parent = other.node.parent.parent.parent.children[1];
                }
            }
            //重生
            obj.node.x = 480;
            obj.node.y = 320;
            var ran_pos_x = Math.floor(Math.random() * (2000 - (0 -2000)) ) + (0 -2000);
            var ran_pos_y = Math.floor(Math.random() * (2000 - (0 -2000)) ) + (0 -2000);
            for(let i=0;i<obj.node.childrenCount;i++){
                obj.node.children[i].setPosition(cc.v2(ran_pos_x,ran_pos_y));
            }
            
            for(let j=0;j<obj.pos_set.length;j++){
                obj.pos_set[j] = cc.v3(ran_pos_x,ran_pos_y,0);
            }
            
        }
        
    },
    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    start () {
        
    },

    // update (dt) {},
});
