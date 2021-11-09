var time_cell = 0.02;
cc.Class({
    extends: cc.Component,

    properties: {
        //遥控
        mYg:{
            default:null,
            type:cc.Node,
        },
        time_01:0,
        //蛇身图片长度
        BLOCK_LEN:20,
        //速度
        speed:200,
        //摄像机
        mCamera:{
            type:cc.Camera,
            default:null,
        },
        speed_time:0.01,
        //记录-主函数约定的固定时间
        m_time_cell:0,
        //贪吃蛇-碰撞food的个数
        _m_food_num:0,
        //缩放-初始化
        //_m_sacle:1,
        //用来控制身体放大限制
        mSnakeScale:1,
        //用来控制摄像机视距拉远控制
        mCZoomRatio:1,
        //用来控制蛇身碰撞到墙,设置为true 暂停游戏 （复活贪吃蛇是否能这样做？暂定）
        gameOver:false,
    },
    onXXX(){
        var len = (this.node.childrenCount - 1) * this.BLOCK_LEN;
        var head = this.node.children[this.node.childrenCount - 1];
        var xpos = head.x;
        var ypos = head.y;
        var degree = head.z;
        //len = len * 2;
        //贪吃蛇  头到尾的距离，需要多长时间
        var total_time = len /this.speed;
        //数组 用来存储移动的位置 z轴坐标是用来记录角度用的
        this.pos_set = [];
        this.pos_set.push(cc.v3(xpos,ypos,degree));

        var passed_time = 0;
        while(passed_time < total_time) {
            //记录蛇头到蛇尾距离移动的位置，并添加到数组
            ypos += (this.speed * this.m_time_cell);
            this.pos_set.push(cc.v3(xpos,ypos,degree));//z轴坐标是角度
            //记录时间
            passed_time += this.m_time_cell;
        }
    }
    ,
    //初始化
    capture_points () {
        //console.log(this.node.children[0].name);
        //console.log(this.node.children[0].getComponent(cc.CircleCollider).radius);
        //贪吃蛇长度 节点个数乘以图片尺寸
        var len = (this.node.childrenCount - 1) * this.BLOCK_LEN;
        var head = this.node.children[this.node.childrenCount - 1];
        var xpos = head.x;
        var ypos = head.y;
        var degree = head.z;
        //len = len * 2;
        //贪吃蛇  头到尾的距离，需要多长时间
        var total_time = len /this.speed;
        //数组 用来存储移动的位置 z轴坐标是用来记录角度用的
        this.pos_set = [];
        this.pos_set.push(cc.v3(xpos,ypos,degree));

        var passed_time = 0;
        while(passed_time < total_time) {
            //记录蛇头到蛇尾距离移动的位置，并添加到数组
            ypos += (this.speed * this.m_time_cell);
            this.pos_set.push(cc.v3(xpos,ypos,degree));//z轴坐标是角度
            //记录时间
            passed_time += this.m_time_cell;
        }

        //获取蛇头节点
        var head = this.node.children[this.node.childrenCount - 1]; 
        head.zIndex = 100;
        //设置蛇头位置
        head.setPosition( cc.v2(this.pos_set[this.pos_set.length - 1].x,this.pos_set[this.pos_set.length - 1].y) );
        head.angle = this.pos_set[this.pos_set.length - 1].z;
        //计算蛇身体的每个节点距离需要移动的时间， 蛇身体图片的高度 / 速度 * 每帧的时间。 
        this.point_num = Math.floor(this.BLOCK_LEN / (this.speed * this.m_time_cell));
        //遍历节点
        for(let i = this.node.childrenCount-2; i >= 0; i--){
            var item = this.node.children[i];
            var index = this.point_num * i;
            item.setPosition(cc.v2(this.pos_set[index].x,this.pos_set[index].y));
            item.angle = this.pos_set[index].z;
            item.cur_index = index;
        }
    },

    onLoad () {
        //this.node.group   = "default";
        //this.node.children[0].color;
        this.m_time_cell = time_cell;
        this.speed_time = 2;

    },

    start () {
        //初始化-贪吃蛇位置
        this.capture_points();
        if(this.mYg != null){
            this.mYg = this.mYg.getComponent('yg');
        }
    },
    moveSanke (dt) { 
        //console.log("snake_ai:" + dt);
        //每帧移动的固定距离
        var s = this.speed * this.m_time_cell;
        //console.log(this.mYg.dir.y+"||"+this.mYg.dir.x);
        var tx = 0 - this.mYg.dir.x;
        var ty = 0 -this.mYg.dir.y;
        //console.log( ty +" && "+tx);
        //摇杆弧度
        var r = Math.atan2(this.mYg.dir.y,this.mYg.dir.x);
        //移动方向
        var sx = s * Math.cos(r);
        var sy = s * Math.sin(r);
        //获取蛇头节点并设置位置
        var head = this.node.children[this.node.childrenCount-1];
        var pos = head.getPosition();
        //用来转换坐标 校正head 父节点的位置-用来放大时不偏移
        //console.log(pos.x+":"+pos.y);
        pos.x += sx;
        pos.y += sy; 
        //console.log(head);
        head.setPosition(cc.v2(pos.x,pos.y));

        var tmp_pos = this.node.convertToWorldSpaceAR(cc.v2(head.x,head.y)); 
        //设置蛇头角度
        var degree = r * 180 / Math.PI;
        head.angle = degree - 90;
        pos.z = degree - 90;
        //蛇头位置保存到数组中
        this.pos_set.push(pos);
        //摄像机跟随蛇头节点
        if(this.mCamera !== null ){
            this.mCamera.node.x = tmp_pos.x-480;
            this.mCamera.node.y = tmp_pos.y-320;
            
        }
        //遍历蛇身体节点-并根据蛇头位置移动
        this.point_num = Math.floor( this.BLOCK_LEN / s );
        //console.log(this.point_num);
        //console.log(this.pos_set.length);
        for(let i = this.node.childrenCount-2; i >= 0; i--){
            var item = this.node.children[i];
            var index = this.point_num * i;
            item.setPosition(cc.v2(this.pos_set[index].x,this.pos_set[index].y));
            item.angle = this.pos_set[index].z;
            item.cur_index = index; 
            ///item.scale = 2;
            
            //清除-(旧)蛇头保存的位置
            if( i == 0 ){
                this.pos_set.shift();
            }
            //重置蛇身节点的下标-因为是索引数组
            //var index = this.point_num * i;
            //item.cur_index = index;
        }
    },
    
});
