var isClickCd = false;
var btnWeixinUser;
var nickName;
var avatarUrl;
var g_info;
var g_myHeadSpriteFrame;
var g_myHead_Ready = false;

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        
        msgBox: {
            default: null,
            type: cc.EditBox
        },
        
        mySprite: {
            default: null,
            type: cc.Sprite
        },
    },

     btnClick1: function (event, customEventData) {
        this.msgBox.Label  = nickName;
        this.msgBox.string = avatarUrl;
        
        if (g_myHead_Ready)
            this.mySprite.spriteFrame  = g_myHeadSpriteFrame;
        else
            console.log('downloading...');
    },
    onLoad(){
    },
    start () {
        if (window.wx) {
            this.msgBox.string = "Weixin";
            cc.log("Yes.")
            wx.getSystemInfo({
                success: function(data) {
                    btnWeixinUser = wx.createUserInfoButton({
                        type: 'text',
                        text: '开始多人游戏',
                        style: {
                            left: data.screenWidth * 0.2,
                            top: data.screenHeight * 0.73,
                            width: data.screenWidth * 0.65,
                            height: data.screenHeight * 0.07,
                            lineHeight: data.screenHeight * 0.07,
                            backgroundColor: '#fe714a',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: data.screenHeight * 0.025,
                            borderRadius: 8
                        }
                    });
                    btnWeixinUser.onTap(function(res) {
                        console.log("这里是index");
                        console.log(res);
                        if (isClickCd) {
                            return;
                        }
                        isClickCd = true;
                        setTimeout(function() {
                            isClickCd = false;
                        }, 1000);
                        nickName = res.userInfo.nickName;
                        var url = res.userInfo.avatarUrl;
                        avatarUrl = res.userInfo.avatarUrl + "?.jpg";
                        btnWeixinUser.hide();
                        console.log("two");
                        cc.loader.load(avatarUrl, function (err, texture) {
                            console.log("2");
                            g_myHeadSpriteFrame = new cc.SpriteFrame(texture);
                            g_myHead_Ready = true;
                            console.log(avatarUrl);
                            cc.director.loadScene('test');
                            });
                        console.log("three");
                    });
                }
            });
            /*
            wx.log({
                success:function(res){
                    if(res.code){
                        console.log("登录成功,获取到code",res.code);
                    }
                    let width = window.wx.getSystemInfoSync().screenWidth;
                    let height = window.wx.getSystemInfo().screenHeight;

                    var button = wx.createUserInfoButton({
                        type:'text',
                        text:'haha',
                        style:{
                            left:0,
                            top:0,
                            width:width,
                            height:height,
                        }
                    });

                    button.show();
                    button.onTap((res)=>{
                        console.log("这里是index");
                        console.log(res);
                        if(res.errMsg === "getUserInfo:ok"){
                            console.log("已经授权");
                            WeChat.onRegisterUser(res.userInfo);
                            button.destroy();
                        }else{
                            console.log("拒绝授权");
                        }
                    })

                }
            });*/
        } else {
            cc.log("no.")
            this.label.string = "no Weixin";
            this.msgBox.string = "no Weixin";
        }

    },
    update(){
        this.label.string = nickName;
        if (g_myHead_Ready)
            this.mySprite.spriteFrame  = g_myHeadSpriteFrame;
    },
});
