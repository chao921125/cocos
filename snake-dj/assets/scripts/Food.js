cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.color = this.randomColor();
        this.node.setPosition(this.randomPos());
    },

    randomColor () {
        // get random color
        let red = Math.round(Math.random()*255);
        let green = Math.round(Math.random()*255);
        let blue = Math.round(Math.random()*255);

        return new cc.Color(red, green, blue);
    },

    randomPos () {
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        let x = Math.round(Math.random()*width) - width/2;
        let y = Math.round(Math.random()*height) - height/2;
        return cc.v2(x, y);
    }
});
