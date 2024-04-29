
class Player{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.dy = 0.2;
        this.dx = 0.5;
        this.jump = false;
        this.easeLeft = false;
        this.easeRight = false;
        this.health = 380;
        this.limit = 400;
        this.image = playerImg;
        this.spriteWidth = 1146;
        this.spriteHeight = 1080;
        this.frame = 0;
        this.timer = 3;
        this.time = 0;
    }
    update(){
        this.x += this.vx;
        this.y -= this.vy;

        if(this.easeLeft) {
            this.vx += this.dx;
            if(this.vx >= 0) this.easeLeft = false;
        }
        if(this.easeRight) {
            this.vx -= this.dx;
            if(this.vx <= 0) this.easeRight = false;
        }
        if(this.y > canvas.height - this.height) this.vy = 0, this.y = canvas.height - this.height, this.jump = true, this.dy = 0.2;
        else  this.vy -= this.dy, this.dy+=0.01;

        this.x = Math.max(48, Math.min(this.x, (canvas.width * 0.75) - this.width))
        
        if(this.health > 0) this.health-=0.1;
        else gameOver()
        if(this.time >= this.timer){
            this.time = 0;
            if(this.frame < 11) this.frame++;
            else this.frame = 0;
        }
        else {
            this.time++;
        }
    }
    draw(){
        // context.fillStyle = "gray"
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}
