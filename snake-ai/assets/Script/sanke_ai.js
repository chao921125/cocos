var time_cell = 0.02;
cc.Class({
    extends: cc.Component,

    properties: {
        time_01:0,
        BLOCK_LEN:32,
        speed:200,
        //btn_speed:1,
        speed_time:0.032,
        m_time_cell:0,
        _m_food_num:0,
        _m_random_time:0,
        mSnakeStart:1,
        gameOver:true,
        mRandomPos:cc.v2(0,0),
        
    }
    ,
    //初始化
    capture_points (posint) {

        //贪吃蛇长度 节点个数乘以图片尺寸
        var len = (this.node.childrenCount - 1) * this.BLOCK_LEN;
        //var head = this.node.children[this.node.childrenCount - 1];
        var xpos = posint.x;
        var ypos = posint.y;
        var degree = posint.z;
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
    //随机min 和max 之间数，从来设置坐标
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    },
    onLoad () {
        this.node.group   = "default";
        this.node.children[0].color;
        this.m_time_cell = time_cell;
        this.mRandomPos.x = ( Math.floor(Math.random() * (10 - (0 - 10)) ) + (0 - 10) ) / 10;
        this.mRandomPos.y = ( Math.floor(Math.random() * (10 - (0 - 10)) ) + (0 - 10) ) / 10;
        //this.randomAIx = cc.v2(this.getRndInteger(-1,1),this.getRndInteger(-1,1));
    },

    start () {
        var head = this.node.children[this.node.childrenCount - 1];
        var pos = cc.v3(head.x,head.y,0);
        this.capture_points(pos);
        if(this.mYg != null){
            this.mYg = this.mYg.getComponent('yg');
        }
    },
    moveSanke (dt) {
        //console.log("ai"+this.point_num);
        //获取蛇头节点并设置位置
        var head = this.node.children[this.node.childrenCount-1];
        var pos = head.getPosition();
        //console.log(head.name+"::"+pos.x +":"+pos.y);
        if(pos.x <= -2400 || pos.x >= 2400){
            this.mRandomPos.x = 0 - this.mRandomPos.x;
        }

        if(pos.y <= -2400 || pos.y >= 2400){
            this.mRandomPos.y = 0 - this.mRandomPos.y;
        }
        //每帧移动的固定距离
        var s = this.speed * this.m_time_cell;
        //摇杆弧度
        var r = Math.atan2(this.mRandomPos.y,this.mRandomPos.x);
        //移动方向
        var sx = s * Math.cos(r);
        var sy = s * Math.sin(r);
        //用来转换坐标 校正head 父节点的位置-用来放大时不偏移
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

        //遍历蛇身体节点-并根据蛇头位置移动
        this.point_num = Math.floor( this.BLOCK_LEN / (this.speed * this.m_time_cell));
        for(let i = this.node.childrenCount-2; i >= 0; i--){
            var item = this.node.children[i];
            var index = this.point_num * i;
            item.setPosition(cc.v2(this.pos_set[index].x,this.pos_set[index].y));
            item.angle = this.pos_set[index].z;
            item.cur_index = index;

            //清除-(旧)蛇头保存的位置
            if( i == 0 ){
                this.pos_set.shift();
            }
        }
    },

    
});
