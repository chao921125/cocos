cc.Class({
    extends: cc.Component,

    properties: {
        head: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // hide FPS info
        cc.debug.setDisplayStats(false);

        // get joyStickBtn
        this.joyStickBtn = this.node.children[0]; 

        // touch event
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchCancel, this);
    },

    onDestroy() {
        // touch event
        this.node.off('touchstart', this.onTouchStart, this);
        this.node.off('touchmove', this.onTouchMove, this);
        this.node.off('touchend', this.onTouchEnd, this);
        this.node.off('touchcancel', this.onTouchCancel, this);
    },

    onTouchStart(event) {
        // when touch starts, set joyStickBtn's position 
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.joyStickBtn.setPosition(pos);
    },

    onTouchMove(event) {
        // constantly change joyStickBtn's position
        let posDelta = event.getDelta();
        this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));
                
        // get direction
        let dir = this.joyStickBtn.position.normalize();
        this.head.getComponent('Head').dir = dir;
    },

    onTouchEnd(event) {
        // reset
        this.joyStickBtn.setPosition(cc.v2(0, 0));
    },

    onTouchCancel(event) {
        // reset
        this.joyStickBtn.setPosition(cc.v2(0, 0));
    },

    update (dt) {
        // get ratio
        let len = this.joyStickBtn.position.mag();
        let maxLen = this.node.width / 2;
        let ratio = len / maxLen;

        // restrict joyStickBtn inside the joyStickPanel
        if (ratio > 1) {
            this.joyStickBtn.setPosition(this.joyStickBtn.position.div(ratio));
        }

        // restrict head inside the Canvas
        if (this.head.x > this.head.parent.width / 2)
            this.head.x = this.head.parent.width / 2;
        else if (this.head.x < -this.head.parent.width / 2)
            this.head.x = -this.head.parent.width /2;

        if (this.head.y > this.head.parent.height / 2)
            this.head.y = this.head.parent.height / 2;
        else if (this.head.y < -this.head.parent.height / 2)
            this.head.y = -this.head.parent.height / 2;
    },
});
