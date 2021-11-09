// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    onCollisionEnter: function (other,self){
    	//自身节点触碰
        if(other.node.name.substring(0,10) === self.node.name.substring(0,10) || other.node.name == "food"){
            return false;
        }

        //判断是否为玩家
        /*
        	1>玩家 则暂停游戏
        	2>玩家身体 不触发效果
        	3>电脑 变成食物
			3>电脑身体 不触发效果
        */

        //cc.log(other.node.name);
        //电脑A身体 触碰 电脑B身体 (没有死亡)
        /*
        if(other.node.name.substring(0,10) != "sanke_play" && self.node.name.substring(0,10) != "sanke_play"){
        	console.log("没有死亡");
        }
        */
        //电脑A身体 触碰 电脑B头部 (电脑B死亡) *
        /*
        if(other.node.name.substring(0,10) != "sanke_play" && self.node.name.substring(11) == "head"){
        	console.log("电脑self死亡");
        }
        */
        if(other.node.name == "sanke_play_head"){
        	//cc.director.pause();
            var snakeObj = other.node.parent.getComponent('sanke_play');
            snakeObj.gameOver = true;//死亡的状态 
            return false;
        }
        //电脑A头部 触碰 电脑B身体 (电脑A死亡)
        if(other.node.name.substring(11) == "head" && self.node.name.substring(0,10) != "sanke_play"){
        	var obj = other.node.parent.getComponent('sanke_ai');
            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //console.log(obj);
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = other.node.parent.childrenCount;
            var pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);
            //pos_set数组下标
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

            return false;        
        }
        //电脑A头部 触碰 玩家身体 (电脑A死亡)
        if(other.node.name.substring(11) == "head" && self.node.name.substring(0,10) == "sanke_play"){
        	var obj = other.node.parent.getComponent('sanke_ai');
            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = other.node.parent.childrenCount;
            var pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);
            //pos_set数组下标
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

            return false;        
        }
        //电脑A身体 触碰 玩家身体  (没有死亡) *
        /*
        if(other.node.name.substring(0,10) == "head" && self.node.name.substring(0,10) != "sanke_play"){
        	console.log("电脑other死亡");
        }
        */
        //电脑A头部 触碰 玩家头部  (电脑A死亡)
        if(other.node.name.substring(11) == "head" && self.node.name == "sanke_play_head"){
        	var obj = other.node.parent.getComponent('sanke_ai');
            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = other.node.parent.childrenCount;
            var pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);
            //pos_set数组下标
            var pos_num = obj.point_num;
            //根据身体位置-随机食物
            for(let i = 0; i < children_num; i++){
                var foodRom = null;
                if(pool._myFoodPool.size() > 0 && i % 2 == 0){
                    foodRom = pool._myFoodPool.get(pool._myFoodPool);
                    foodRom.color = new cc.Color(pool.getRndInteger(0,255),pool.getRndInteger(0,255),pool.getRndInteger(0,255));
                    foodRom.active = true;
                    foodRom.x = arr[i*pos_num].x + 480 + pool.getRndInteger(-15,15);
                    foodRom.y = arr[i*pos_num].y + 320 + pool.getRndInteger(-15,15);
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

            return false;       
        }
        //玩家身体 触碰 电脑头部  (电脑A死亡) *
        /*
        if(other.node.name.substring(0,10) == "sanke_play" && self.node.name.substring(11) == "head"){
        	console.log("电脑other死亡");
        }
        */
        //玩家头部 触碰 电脑头部  (玩家死亡)
        /*
        if(other.node.name == "sanke_play_head" && self.node.name.substring(11) == "head"){
        	var snakeObj = other.node.parent.getComponent('sanke_play');
            snakeObj.gameOver = true;//死亡的状态 
            return false;
        }
        //玩家头部 触碰 电脑身体  (玩家死亡)
        if(other.node.name == "sanke_play_head" && self.node.name.substring(0,10) != "sanke_play"){
        	var snakeObj = other.node.parent.getComponent('sanke_play');
            snakeObj.gameOver = true;//死亡的状态 
            return false;
        }
		*/
        

        /*
        if(self.node.name.substring(11) == "head" && self.node.name != "sanke_play_head" ){
            console.log(self.node.name +"死亡");
            var obj = self.node.parent.getComponent('sanke_ai');
            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = self.node.parent.childrenCount;
            var pool = self.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);

            //pos_set数组下标

            var pos_num = obj.point_num;
            //根据身体位置-随机食物
            for(let i = 0; i < children_num; i++){
                var foodRom = null;
                if(pool._myFoodPool.size() > 0 ){
                    foodRom = pool._myFoodPool.get(pool._myFoodPool);
                    foodRom.color = new cc.Color(pool.getRndInteger(0,255),pool.getRndInteger(0,255),pool.getRndInteger(0,255));
                    foodRom.active = true;
                    foodRom.x = arr[i*pos_num].x + 480 + pool.getRndInteger(-5,5);
                    foodRom.y = arr[i*pos_num].y + 320 + pool.getRndInteger(-5,5);
                    foodRom.parent = self.node.parent.parent.parent.children[1];
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


        if(other.node.name.substring(11) == "head" ){
            console.log(other.node.name +"死亡");
            var obj = other.node.parent.getComponent('sanke_ai');
            var arr = obj.pos_set;//获取贪吃蛇身体位置
            //obj._m_food_num = 0;//吃的食物个数
            //获取身体个数
            var children_num = other.node.parent.childrenCount;
            var pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            
            //console.log(pool);
            //pool._mSnakePool.put(other.node.parent);
            //pos_set数组下标
            var pos_num = obj.point_num;
            //根据身体位置-随机食物
            for(let i = 0; i < children_num; i++){
                var foodRom = null;
                if(pool._myFoodPool.size() > 0 ){
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
        }*/
        

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    start () {

    },

    // update (dt) {},
});
