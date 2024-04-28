
class Enemies{
    constructor(x, y, width, height, speed){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
        this.speed = speed;
    }
    update(){
        this.x-=this.speed;
        if(this.x < 0 - this.width){
            this.markedForDeletion = true;
            if(this.type !== "electric") player.health -= 100;
        }
        if(this.frame !== null){
            this.frame < this.maxFrame? this.frame++ : this.frame = 0;
        }
    }
}

class Goombu extends Enemies{
    constructor(x, y, width, height, speed){
        x = canvas.width + 64;
        y = canvas.height - 64;
        super(x, y, width, height, speed);
        this.lives = 30;
        this.width = 64;
        this.height = 64;
        this.image = element;
        this.type = "element"
    }
    draw(){
        context.drawImage(this.image, 0, 0, 32, 32, this.x, this.y, this.width, this.height)
    }
}

class Water extends Enemies{
    constructor(x, y, width, height, speed){
        super(x, y, width, height, speed);
        this.lives = 20;
        this.image = planet;
        this.type = "water";
    }
    draw(){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Shocks extends Enemies{
    constructor(x, y, width, height, speed){
        x = canvas.width - 34.25;
        y = canvas.height - 149.25;
        super(x, y, width, height, speed);
        this.width = 68.5;
        this.height = 149.25;
        this.lives = -40;
        this.frame = 0;
        this.maxFrame = 2;
        this.type = "electric";
        this.image = shock1;
    }
    draw(){
        this.image = shocks[this.frame]
        context.drawImage(this.image, 40, 0, 245, 1194, this.x, this.y, this.width, this.height);
    }
}
