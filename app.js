const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let score = 0;
context.font = "24pt Helvetica";
let timer = 20000;
let max = 2;
let healthImage = document.getElementById("health");
let playerImg = document.getElementById("player");
let planet = document.getElementById("water");
let shock1 = document.getElementById("shock1");
let shock2 = document.getElementById("shock2");
let shock3 = document.getElementById("shock3");
let element = document.getElementById("element")
let highscore = document.getElementById("highscore");
let sound = document.querySelector("audio");

if(window.localStorage.getItem("playingRoboliteFiorTheFirstTime") === "null" || window.localStorage.getItem("playingRoboliteFiorTheFirstTime") === "undefined" || window.localStorage.getItem("playingRoboliteFiorTheFirstTime") === " "){
    let confirmation = confirm("Want to checkout the tutorial?")
    if(confirm){
        window.localStorage.getItem("playingRoboliteFiorTheFirstTime") = "no";
        window.location = "./help.html";
    }
    
}
else{
    playSound();   
}

function playSound(){
    sound.currentTime = "0.00"
    sound.play()
}

let shocks = [shock1, shock2, shock3];

class Health{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "white";
        this.angle = 0;
        this.dx = 2;
        this.image = healthImage;
    }
    update(){
        this.x -= this.dx;
        this.y += Math.sin(this.angle) * 3;
        this.angle += 0.1;
        if(this.x < 0 - this.width){
            this.x = canvas.width * 3;
        }
    }
    draw(){
        // context.fillStyle = this.color;
        // context.fillRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

let health = new Health(canvas.width, 200, 50.5, 115.25);

let backgroundLayer1 = document.getElementById("layer1");
let backgroundLayer2 = document.getElementById("layer2");
let backgroundLayer3 = document.getElementById("layer3");
let gameSpeed = 7;
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

const layer1 = new Layer(backgroundLayer1, 0.1);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 1);

let gameObjects = [layer1, layer2, layer3];

let player = new Player(60, 60, 100, 100);

let goombu = new Goombu(canvas.width + 100, canvas.height - 100, 100, 100)
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
            score+=100;
            if(Number(highscore.textContent) < score) highscore.textContent = score;
            player.health+=enemy.lives;
            enemy.markedForDeletion = true;
        } else if (ourReturn === "true"){
            gameOver();
            enemy.markedForDeletion = true;
        }
    });
    if(checkCollision(player, health) == "true"){
        player.health += 140;
        health.x = canvas.width * Math.floor(Math.random() * 2 + 3)
    }
    if(gameSpeed < 34) gameSpeed+=0.001, player.timer -= 0.00005;
    health.update();
    health.draw();


    ui()
    if(timer < 0) loop = false, gameOver();
    if(loop) requestAnimationFrame(animate)
    else context.clearRect(0, 0, canvas.width, canvas.height);
}

window.onload = () => {
    requestAnimationFrame(animate)
};

window.addEventListener("keydown", function(e) {
    if((e.code === "ArrowUp" || e.code === "Space") && player.jump){
        player.vy = 14;
        player.jump = false;
    }
    if(e.code === "ArrowLeft"){
        player.vx = -3;
    }
    if(e.code === "ArrowRight"){
        player.vx = 3
    }
    e.preventDefault()
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
    if(!loop) player.health = -1;
    if(!(player.health <= 0)) {
        player.health -= 50;
    }  else {
        player.health = 0;
        if(document.fullscreenElement){
            document.exitFullscreen().then().catch(err => console.log(err));
            menu.setAttribute("class", "show");
        } else {
            menu.setAttribute("class", "show");
        }
        uiOff()
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
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#eee";
    context.fillText("Score: " + score, canvas.width * 0.5, canvas.height * 0.5);
    context.fillStyle = "#232333";
    context.fillText("Score: " + score, canvas.width * 0.5 + 1 , canvas.height * 0.5 + 3);
    context.restore()
}

let allEnemies = [Goombu, Water, Shocks];

function createEnemies(){
    if(enemyTime >= enemyTimer ){
        enemies.push(new allEnemies[Math.floor(Math.random()* allEnemies.length)](canvas.width + 100, canvas.height - 100, 100, 100, Math.floor(Math.random() * (max * 0.5) + max)))
        if(max < 10) max+=0.1;
        enemyTime = 0;
        enemyTimer = Math.floor(Math.random() * (200 - 100) + 100)
    }
    else enemyTime++;
}

function play(){

    score = 0;
    timer = 20000;
    max = 2;

    player = new Player(60, 60, 100, 100);
    health = new Health(canvas.width, 200, 50.5, 115.25, false);
    gameObjects = [layer1, layer2, layer3];
    enemies = [];
    enemyTime = 0;
    lastTime = 0;
    enemyTimer = 700;
    loop = true;
    gameSpeed = 7;
    
    let allElementShown = document.querySelectorAll(".show");
    allElementShown.forEach(el => {
        el.setAttribute("class", "hide")
    })

    playSound();
    animate();
}

document.getElementById("top").ontouchstart = (e) => {
    if(player.jump){
    player.vy = 14;
    player.jump = false;
    }
    e.preventDefault()
}

document.getElementById("left").ontouchstart = (e) => {
    player.vx = -3;
    e.preventDefault()
}

document.getElementById("right").ontouchstart = (e) => {
    player.vx = 3;
    e.preventDefault()
}

document.getElementById("left").ontouchend = (e) => {
    if(!player.easeRight && !player.easeLeft)
    {
        player.easeLeft = true;
    }
    e.preventDefault()
}

document.getElementById("right").ontouchend = (e) => {
    if(!player.easeRight && !player.easeLeft)
    {
        player.easeRight = true;
    }

    e.preventDefault()
}

function back(){
    window.location = "index.html"
}