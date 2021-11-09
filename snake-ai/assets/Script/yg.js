cc.Class({
    extends: cc.Component,

    properties: {
        m_Max_Rlen:100,
        m_Min_Rlen:10,
        dir:cc.v2(0,0),
    },

    // LIFE-CYCLE CALLBACKS:
    onTouchMove (e) {
        this.node.x = 0;
        this.node.y = 0;
        let scene_pos = e.getLocation();
        let pos = this.node.convertToNodeSpaceAR(scene_pos);
        let len = pos.mag();

        this.dir.x = pos.x/len;
        this.dir.y = pos.y/len;
        
        //console.log(this.dir.x+":"+this.dir.y);
        if(len <= this.m_Min_Rlen){
            this.node.setPosition(pos);
            return false;
        }
        
        if(len > this.m_Max_Rlen){
            pos.x = pos.x * this.m_Max_Rlen / len;
            pos.y = pos.y * this.m_Max_Rlen / len;
        }

        //console.log(pos.x +":"+pos.y+"r:"+this.m_Max_Rlen);
        this.node.setPosition(pos);
        //let pos = e.getDelta();
        //this.node.setPosition(pos);

        //this.node.x += pos.x;
        //this.node.y += pos.y;
    },
    onTouchCancel (e) {
        //this.dir.x = 0;
        //this.dir.y = 0;

        this.node.x = 0;
        this.node.y = 0;
    },
    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchCancel,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    },

    start () {

    },

    //update (dt) {console.log(this.dir.x+":"+this.dir.y);},
});
