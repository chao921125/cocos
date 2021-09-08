# cocos-basic
cocos基础学习

1、保持我们的脚本文件名大写
2、注意资源归类，避免资源混用

```
assets：资源目录
    scene：场景
    material：材质 一般是给地图等等渲染
    prefab：预制-模型
    texture：预制-模型-质地
    script：脚本
    animation：动画
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

# 摇杆
1、摇杆的初始化位置，相对于web \
2、固定范围内控制，监听移动等等 \
3、超过范围后，处理摇杆的位置 \
4、关联控制的单位 \
5、相机跟随 \