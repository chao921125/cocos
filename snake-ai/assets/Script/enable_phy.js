cc.Class({
    extends: cc.Component,

    properties: {
        gravity:cc.v2(0,-320),
        is_debug:true,
    },
    onLoad () {
        //三个步骤
        //1>开启物理引擎
        cc.director.getPhysicsManager().enabled = true;
        //2>配置物理引擎的重力
        cc.director.getPhysicsManager().gravity = this.gravity;
        //3>配置调试区域
        if(this.is_debug) {
            var Bits = cc.PhysicsManager.DrawBits;
            cc.director.getPhysicsManager().debugDrawFlags = Bits.e_aabbBit |
                                                             Bits.e_centerOfMassBit |
                                                             Bits.e_jointBit |
                                                             Bits.e_shapeBit;
        }else{
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }
    },

    start () {

    },

    // update (dt) {},
});
