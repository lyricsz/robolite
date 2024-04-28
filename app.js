const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let score = 0;
context.font = "24pt Helvetica";
let timer = 10000;
let scoreUI = document.getElementById("scoreUI");
let max = 2;
let healthImage = document.getElementById("health");
let playerImg = document.getElementById("player");
let planet = document.getElementById("water");
let shock1 = document.getElementById("shock1");
let shock2 = document.getElementById("shock2");
let shock3 = document.getElementById("shock3");
let element = document.getElementById("element")

let shocks = [shock1, shock2, shock3];

class Health{
    constructor(x, y, width, height, zig){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "white";
        this.angle = 0;
        this.dx = 2;
        this.zig = zig;
        this.image = healthImage;
    }
    update(){
        this.x -= this.dx;
        this.y += Math.sin(this.angle) * 2;
        this.angle += 0.1;
        if(this.zig) this.dx += Math.cos(this.angle);
        if(this.x < 0 - this.width){
            this.x = canvas.width * 4;
        }
    }
    draw(){
        // context.fillStyle = this.color;
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

let health = new Health(canvas.width, 200, 50.5, 115.25, false);

let backgroundLayer1 = document.getElementById("layer1");
let backgroundLayer2 = document.getElementById("layer2");
let backgroundLayer3 = document.getElementById("layer3");
let gameSpeed = 10;
class Layer{
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 1025;
        this.height = 600;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = this.speedModifier  * gameSpeed;
    }
    update(){
        this.speed = this.speedModifier * gameSpeed;
        
        if(this.x <= -this.width) this.x  = 0;

        this.x -= this.speed;
        
}

    draw(){
        context.drawImage(this.image, 0, 0, 410, 480, this.x , this.y, this.width, this.height);
        context.drawImage(this.image, 0, 0, 410, 480, this.x + this.width , this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.8);
const layer3 = new Layer(backgroundLayer3, 1);

const gameObjects = [layer1, layer2, layer3];

const player = new Player(60, 60, 100, 100);

const goombu = new Goombu(canvas.width + 100, canvas.height - 100, 100, 100)
let enemies = [];
let enemyTime = 0;
let lastTime = 0;
let enemyTimer = 700;
let loop = true;
function animate(timestamp){

    
    gameObjects.forEach((object) => {
        object.update();
        object.draw();
    })

    createEnemies()
    player.update();
    player.draw();
    timer--;
        
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
    
    enemies.forEach((enemy) => {
        enemy.draw();
        enemy.update();
        let ourReturn = checkCollision(player, enemy)
        if(ourReturn === "score"){
            score++;
            scoreUI.innerText = score;
            player.health+=enemy.lives;
            enemy.markedForDeletion = true;
        } else if (ourReturn === "true"){
            gameOver();
            enemy.markedForDeletion = true;
        }
    });
    if(checkCollision(player, health) == "true"){
        player.health += 50;
        health.x = canvas.width * Math.floor(Math.random() * 2 + 2)
    }
    health.update();
    health.draw()

    ui()

    if(loop) requestAnimationFrame(animate);
}

window.onload = () => {
    requestAnimationFrame(animate)
};

window.addEventListener("keydown", function(e) {
    if((e.code === "ArrowUp" || e.code === "Space") && player.jump){
        player.vy = 15;
        player.jump = false;
    }
    if(e.code === "ArrowLeft"){
        player.vx = -3;
    }
    if(e.code === "ArrowRight"){
        player.vx = 3
    }
    
})

window.addEventListener("keyup", function(e) {
    if(e.code === "ArrowLeft" && !player.easeRight && !player.easeLeft){
        player.easeLeft = true;
    }
    if(e.code === "ArrowRight" && !player.easeLeft && !player.easeRight){
        player.easeRight = true;
    }
}, false);

function gameOver(){
    if(!(player.health < 0)) {
        player.health -= 50;
    }  else {
        player.health = 0;
        document.exitFullscreen().then(
            menu.setAttribute("class", "show")
        );

        loop = false;
    }
}

function checkCollision(a, b){
    if (a.x + a.width > b.x && a.x < b.x + b.width &&
             a.y + a.height > b.y && a.y < b.y + b.height)
    {
        if(a.y + a.height < b.y + 30 && a.vy < 0){
            return "score";
        }
        return "true";
    }
    return false;
}

function ui(){
    if(player.health > player.limit) player.health = player.limit;
    if(player.health < 0) gameOver()
    context.fillStyle = "#eee";
    context.fillText("Time Left: " + timer, 20, 98)
    context.fillText("Health: ", 20, 64);
    context.fillRect(124, 42, 400, 24);
    context.fillStyle = "red";
    context.fillRect(124, 42, player.health, 24);
}

let allEnemies = [Goombu, Water, Shocks];

function createEnemies(){
    if(enemyTime >= enemyTimer ){
        enemies.push(new allEnemies[Math.floor(Math.random()* allEnemies.length)](canvas.width + 100, canvas.height - 100, 100, 100, Math.floor(Math.random() * (max * 0.5) + max)))
        max+=0.1;
        enemyTime = 0;
        enemyTimer = Math.floor(Math.random() * (200 - 100) + 100)
    }
    else enemyTime++;
}