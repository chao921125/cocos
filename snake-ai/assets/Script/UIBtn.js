// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mProgressBar:{
            default:null,
            type:cc.Node,
        },
        mLabel: {
            default:null,
            type:cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onIsOK(e,data){
        console.log(data);
    },
    onLoginGame(e,data){
        switch(data){
            case 'login_game':
                console.log("登录游戏");
                cc.director.loadScene('helloworld');
                break;
            default:
                console.log("服务器繁忙！请稍后再试")
                break;
        }
    },

    onLoad () {

        this.node.children[0].active = false;
        var progress = this.mProgressBar.getComponent(cc.ProgressBar);
        var labelTex = this.mLabel.getComponent(cc.Label);
        cc.director.preloadScene('helloworld', (completedCount,totalCount,item)=>{
            let p = completedCount/totalCount;
            //console.log(p);
            progress.progress = p;
            labelTex.string = Math.floor(p * 100) + "%";
        },()=>{
            cc.log('预加载helloworld');
            this.node.children[0].active = true;
        });

    },

    start () {
        /*
        this.node.children[0].active = false;
        this.mProgressBar.getComponent(cc.ProgressBar).progress = 0;
        cc.director.preloadScene('helloworld', (completedCount,totalCount,item)=>{
            let p = completedCount/totalCount;
            //console.log(p);
            this.mProgressBar.getComponent(cc.ProgressBar).progress = p;
            this.mLabel.getComponent(cc.Label).string = Math.floor(p * 100) + "%";
        },()=>{
            cc.log('预加载');
            this.node.children[0].active = true;
        });
        */
    },

    // update (dt) {},
});
