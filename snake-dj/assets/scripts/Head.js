cc.Class({
    extends: cc.Component,

    properties: {
        bodyPrefab: {
            default: null,
            type: cc.Prefab
        },

        foodPrefab: {
            default: null,
            type: cc.Prefab
        },

        // number of bodies at start at start
        bodyNum: 2,

        // the length of each section(length between body prefabs)
        sectionLen: 25,

        // time needed to crawl one sectionLen(not based on real time)
        time: 5
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // array for head and bodies
        this.snakeArray = [];
        this.snakeArray.push(this.node);

        // set head's color, position, and direction
        this.node.color = this.randomColor();
        this.node.setPosition(this.randomPos());
        this.rotateHead(this.node.position);

        // record all points
        this.pointsArray = [];

        // snake's speed
        this.speed = this.sectionLen / this.time;

        // initialize bodies
        for (let i=1; i<=this.bodyNum; i++)
            this.getNewBody();

        // direction from joystick
        this.dir = null;

        // the number of points head has passed
        this.headPointsNum = 0;

        // enable collision system
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // produce new food
        let newFood = cc.instantiate(this.foodPrefab);
        this.node.parent.addChild(newFood);
    },

    randomColor () {
        // get random color
        let red = Math.round(Math.random()*255);
        let green = Math.round(Math.random()*255);
        let blue = Math.round(Math.random()*255);
        return new cc.Color(red, green, blue);
    },

    randomPos () {
        // get random position
        let width = this.node.parent.width;
        let height = this.node.parent.height;
        let x = Math.round(Math.random()*width) - width/2;
        let y = Math.round(Math.random()*height) - height/2;
        return cc.v2(x, y);
    },

    getNewBody () {
        // initialize body or get longer after eating food
        let newBody = cc.instantiate(this.bodyPrefab);

        if (this.snakeArray.length > this.bodyNum)
            newBody.curIndex = this.snakeArray[this.snakeArray.length-1].curIndex;
        else
            newBody.curIndex = 0;

        // set new body's position
        if(this.snakeArray.length == 1) {
            let dir = this.node.position.normalize();
            newBody.setPosition(this.node.position.sub(dir.mul(this.sectionLen)));
        }
        else {
            let lastBody = this.snakeArray[this.snakeArray.length-1];
            let lastBOBody = this.snakeArray[this.snakeArray.length-2];
            let dir = lastBOBody.position.sub(lastBody.position).normalize();
            newBody.setPosition(lastBody.position.sub(dir.mul(this.sectionLen)));
        }

        // new body's color should be same as that of head
        newBody.color = this.node.color;

        // add to canvas and snakeArray
        this.node.parent.addChild(newBody);
        this.snakeArray.push(newBody);

        // record points
        this.recordPoints()

        this.changeZIndex();
    },

    rotateHead (headPos) {
        // change head's direction
        let angle = cc.v2(1, 0).signAngle(headPos) * 180/Math.PI;
        this.node.angle = angle-90;
    },

    moveSnake() {
        // move snake
        let dis = this.dir.mul(this.speed);
        this.node.setPosition(this.node.position.add(dis));
        this.pointsArray.push(this.node.position);

        // plus one every time when head moves
        this.headPointsNum += 1;

        for(let i=1; i<this.snakeArray.length; i++) {
            let num = Math.floor((this.pointsArray.length-this.headPointsNum) / (this.snakeArray.length-1) * (this.snakeArray.length-1-i));
            this.snakeArray[i].setPosition(this.pointsArray[num+this.snakeArray[i].curIndex]);
            this.snakeArray[i].curIndex += 1;
        }
    },

    recordPoints () {
        // record points between bodies (head is a special body)
        let len = 0;
        let index = 0;

        while(len < this.sectionLen) {
            len += this.speed;

            let lastBody = this.snakeArray[this.snakeArray.length-1];
            let lastBOBody = this.snakeArray[this.snakeArray.length-2];
            let dir = lastBOBody.position.sub(lastBody.position).normalize();

            let pos = lastBody.position.add(dir.mul(len));
            this.pointsArray.splice(index, 0, pos);
            index += 1;
        };
    },

    changeZIndex(){
        for (let i=0; i<this.snakeArray.length; i++) {
            this.snakeArray[i].zIndex = cc.macro.MAX_ZINDEX - i;
        }
    },

    onCollisionEnter (other, self) {
        // remove current food
        other.node.removeFromParent();

        // produce new food
        let newFood = cc.instantiate(this.foodPrefab);
        this.node.parent.addChild(newFood);

        // generate new body
        this.getNewBody();
    },

    update (dt) {
        if (this.dir) {
            // change head's direction
            this.rotateHead(this.dir);

            // move snake
            this.moveSnake();
        }
    },
});
