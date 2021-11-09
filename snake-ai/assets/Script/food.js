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
        sprite: {
          default: null,
          type: cc.SpriteFrame,
        },
        
    },/**/
    reuse(foodManager) {
        /*
        setTimeout(function () {
          this.destroy();
        }.bind(foodManager), 200);*/
        //console.log(foodManager);
        if(!foodManager){
            console.log("hello");
            setTimeout(function () {
              this.node.destroy();
            }.bind(self), 200);
        }
    },
    onCollisionEnter: function (other, self) {
        var xx = other.node.parent.convertToWorldSpaceAR(other.node.getPosition());
        //xx.x -= 22.5;
        //xx.y -= 22.5;
        var ff = self.node.getPosition();
        //ff.x -= 9;
        //ff.y -= 9;
        var ccposx = Math.abs(xx.x - ff.x);
        var ccposy = Math.abs(xx.y - ff.y);

        //console.log(other.node.name+":"+xx.x + "-" + xx.y);
        //console.log(self.node.name+":"+ff.x + "-" + ff.y);
        cc.log("result:"+ccposx+":"+ccposy);
        console.log("=====================================");
        //console.log(other.node.parent.parent.children[0].children[1].getComponent("Main"));
        var snake_name = other.node.parent.name;
        //console.log(other.node.parent.name);
        var snake_num = other.node.parent.childrenCount;
        var pos_child = other.node.parent.children[snake_num-1];
        //贪吃蛇最后一个节点
        var pos_child2 = other.node.parent.children[0];
        //获取对象池
        var pool = '';
        //console.log(self.node);
        //用来判断 玩家 or 电脑
        var sanke = '';
        //console.log(pos_child.name);
        if( snake_name == 'sanke_play' && pos_child.name == 'sanke_play_head'){//玩家
            pool = other.node.parent.parent.children[0].children[1].getComponent("Main");
            //console.log(pool);
            sanke = other.node.parent.getComponent('sanke_play');
            /*
            if( (snake_num-6) % 4 == 0 && pool.mCamera.zoomRatio > 0.5 && snake_num != 6 ){
                pool.mCamera.zoomRatio = async.Subtr(pool.mCamera.zoomRatio,0.01);
            }
            /*
            if( (snake_num-6) % 1 == 0 && sanke.node.scale < 2.8 && snake_num != 6 && sanke._m_food_num % 10 == 0 ){
                if(sanke.mSnakeScale >= 2){
                    sanke.mSnakeScale = 2;
                }else{
                    sanke.mSnakeScale += 0.005;
                }
            }*/
            //snake_name = "sanke_play";//玩家身体节点名称创建
        }else if ( pos_child.name.substring(11) == 'head') {//电脑
            pool = other.node.parent.parent.parent.children[0].children[1].getComponent("Main");
            sanke = other.node.parent.getComponent('sanke_ai');
            //snake_name = "snake_a";//电脑身体节点名称创建
        }else{
            return false;
        }
        //隐藏
        self.node.active = false;
        //回收食物
        pool._myFoodPool.put(self.node);
        
        //更具条件增加身体节点
        sanke._m_food_num += 1;
        if(sanke._m_food_num % 5 == 0 && sanke._m_food_num != 0 ){
            //添加蛇身体
            var node = "";//new cc.Node( snake_name+snake_num );
            if(pool._mSnakeChildrenPool.size() > 0){
                node = pool._mSnakeChildrenPool.get();
                node.name = snake_name+snake_num;
                node.active = true;
                //碰撞脚本
                //node.addComponent("sanke_children");
                //碰撞壳
                //var cCollider = node.addComponent(cc.CircleCollider);
                //cCollider.radius = 20;
                //图片
                //var sp = node.addComponent(cc.Sprite);
                //sp.spriteFrame = this.sprite;
                //碰撞分组
                node.group = "food";
                var tex_total_time = sanke.BLOCK_LEN  /sanke.speed;
                var passed_time = 0;
                while( passed_time < tex_total_time ){
                    sanke.pos_set.unshift(cc.v3(pos_child2.x,pos_child2.y,pos_child2.z));
                    passed_time += sanke.m_time_cell;
                }

                var point_num = Math.floor( sanke.BLOCK_LEN / (sanke.speed * sanke.m_time_cell) );
                var index = point_num ;
                node.setPosition( cc.v2(sanke.pos_set[index].x,sanke.pos_set[index].y) );
                node.angle = sanke.pos_set[index].z;
                node.cur_index = index;
                node.zIndex = -1;
                //node.scale = pos_child.scale;
                node.parent = other.node.parent;
            }
        }
        /**/


        /*
        setTimeout(function () {
          this.node.destroy();
        }.bind(self), 200);
        */
    },
    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        //console.log('on collision stay');
    },
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        //console.log('on collision exit');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 开启碰撞检测系统，未开启时无法检测
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    start () {

    },

    // update (dt) {},
});
