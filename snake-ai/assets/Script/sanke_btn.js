cc.Class({
    extends: cc.Component,

    properties: {
        m_sanke:{
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onStartBtn (e) { 
        this.m_sanke.speed_time = 1;
    },
    onUpBtn (e) { 
        this.m_sanke.speed_time = 2;
    },
    onLoad () {
        //触摸点击
        this.node.on(cc.Node.EventType.TOUCH_START,this.onStartBtn,this);
        //触摸抬起
        this.node.on(cc.Node.EventType.TOUCH_END,this.onUpBtn,this);
        //this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onUpBtn,this);
    },

    start () {
        this.m_sanke = this.m_sanke.getComponent('sanke_play');
    },

    // update (dt) {},
});
