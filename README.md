# cocos-basic
cocos基础学习

1、保持我们的脚本文件名大写
2、注意资源归类，避免资源混用（可以根据功能或者类型区分）

```
assets：资源目录
    scene：场景
    
    res：使用资源
    resources：动态加载资源loader加载
    
    script：脚本
    material：场景背景图等等（此项可以和model合并）
    model：设计的人物模型等等
    prefab：预制-模型，无需动态加载的预制体
    texture：预制-模型-质地，一些贴图资源
    animation：动画文件
    font：字体
    audio：音频
    particle：粒子特效
    

build：构建目录（在构建某平台后会生成该目录）

library：导入的资源目录

local：日志文件目录

profiles：编辑器配置

temp：临时文件目录

package.json：项目配置
```

# 制作开屏页等等非游戏内页面
```
1、创建Canvas
2、Canvas内部创建Node
3、Node内部创建Sprite，适配Node大小的时候需要创建一个Widget
```

# 摇杆
1、摇杆的初始化位置，相对于web \
2、固定范围内控制，监听移动等等 \
3、超过范围后，处理摇杆的位置 \
4、关联控制的单位 \
5、相机跟随 \
