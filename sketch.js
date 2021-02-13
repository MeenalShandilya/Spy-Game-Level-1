const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var gameState;
gameState="START";
var bg, bg1;
var back, lost, lostImg, start, startImg, lasergun, lasergunImg;
var amanda, amandaAni;
var invisible;
var laserGroup, gunGroup, knifeGroup, bulletGroup;
var score, lives, level, gunCount, knifeCount, knife, knifeImage, gun, gunImage, bullet, bulletImage;
score=0;
lives=3;
level=1;
gunCount=0;
knifeCount=0;

function preload() {
  bg1 = loadImage("images/bg.png");
  startImg = loadImage("images/start.png");
  amandaAni = loadAnimation("animation/1.png","animation/2.png","animation/3.png","animation/4.png",
  "animation/5.png","animation/6.png","animation/7.png")
  lasergunImg = loadImage("images/laserGun.png");
  lostImg = loadImage("images/lost.png");
  gunImage = loadImage("images/gun.png");
  knifeImage = loadImage("images/knife.png");
  bulletImage = loadImage("images/bullet.png");
}
function setup() {
   var canvas=createCanvas(1000,500);
   engine=Engine.create();
   world=engine.world;
   bg = createSprite(1680,height/2);
   bg.addImage(bg1);
   bg.scale=1.8;

   start = createSprite(800,400);
   start.addImage(startImg);

   amanda = createSprite(100,400);
   amanda.addAnimation("running",amandaAni);
   amanda.scale=0.3;

   invisible = createSprite(500,470,1000,20);
   invisible.visible=false;

   lost = createSprite(460,180);
   lost.addImage(lostImg);
   lost.scale=1;
   lost.visible=false;

   laserGroup = createGroup();
   gunGroup = createGroup();
   knifeGroup = createGroup();
   bulletGroup = createGroup();
   
   Engine.run(engine);
}
function draw() {
    if (back) {background(back);} 
    amanda.collide(invisible);
    if (gameState==="START") {
      back="black";
      bg.visible=false;
      amanda.visible=false;
      
      textFont("Papyrus");
      textSize(30);
      fill("yellow");
      text("STORY",400,45);
      text("CONTROLS",360,355);
      fill("white");
      text("Amanda is a spy working for the B.E.A.S.T. (Board of Espionage,",10,90);
      text("Analysis, Security and Technology) who has a mission. The Department of",10,130);
      text("Research and Analysis has been sabotaged and she needs to find out who is",10,170);
      text("the culprit. The B.E.A.S.T. suspects Thomas Rudd. Amanda has to enter",10,210);
      text("the Lair, which is the office of Thomas Rudd. But to do that, she needs to",10,250); 
      text("pass various traps laid in the Lair. Help her get pass all of them and determine",10,290);
      text("the truth.",10,330);
      text("1. Press space to shoot.",10,395);
      text("2. Press up arrow to jump.",10,430);

      if (mousePressedOver(start)) {
        gameState="PLAY";
      }
    }  
    if (gameState==="PLAY") {
      bg.visible=true;
      amanda.visible=true;
      start.visible=false;
      bg.velocityX=-3;

      amanda.velocityY+=0.5;
      if (keyDown(UP_ARROW)&&amanda.y>150) {
        amanda.velocityY=-10;        
      }
      if (bg.x<-900) {
        bg.x=1680;
      }

      if (lives<=0) {
        gameState="END";
      }

      score = score+Math.round(getFrameRate()/60);

      if (score>=500) {
        level++;
        score=0;
      }

      spawnGuns();
      if (amanda.isTouching(gunGroup)) {
        gunCount++;
        gunGroup.destroyEach();
      }
      spawnKnives();
      if (amanda.isTouching(knifeGroup)) {
        knifeCount++;
        knifeGroup.destroyEach();
      }

      if (level===1) {
      spawnLasers();
        if (amanda.isTouching(laserGroup)) {
          laserGroup.destroyEach();
          lives--;
        } 
        if (gunCount>0&&keyDown("space")) {
          bullet = createSprite(amanda.x+20,amanda.y,20,20);
          bullet.velocityX=3;
          bullet.addImage(bulletImage);
          bullet.scale=0.3;
          bulletGroup.add(bullet);
          gunCount--;
        }
        if (bulletGroup.isTouching(laserGroup)) {
          laserGroup.destroyEach();
          bulletGroup.destroyEach();
        }
      }
      if (level===2) {
        laserGroup.destroyEach();
      }
    }

    if (gameState==="END") {
      bg.visible=false;
      amanda.visible=false;
      back="black";
      lost.visible=true;
    }
    drawSprites(); 
    if (gameState==="PLAY") {
      fill("white");
      rectMode(CENTER);
      //for score
      rect(65,15,130,30);
      //for lives
      rect(935,15,130,30);
      //for level
      rect(523,15,130,30);

      fill("yellow");
      //for guns
      rect(320,15,130,30);
      //for knives
      rect(726,15,140,30);

      textFont("Candara");
      textSize(30);
      fill(0);
      text("Score: "+score,6,25);
      text("Lives: "+lives,890,25);
      text("Level: "+level,480,25);
      text("Guns: "+gunCount,260,25);
      text("Knives: "+knifeCount,660,25);
    }
}
function spawnLasers() {
  if (frameCount%130===0) {
    lasergun = createSprite(random(800,1000),random(200,460));
    lasergun.velocityX=-4;
    lasergun.addImage(lasergunImg);
    lasergun.scale=0.15;
    lasergun.lifetime=220;
    laserGroup.add(lasergun);
  }
}
function spawnGuns() {
  if (frameCount%150===0) {
    gun = createSprite(random(800,1000),random(200,460));
    gun.velocityX=-5;
    gun.addImage(gunImage);
    gun.scale=0.3;
    gun.lifetime=200;
    gunGroup.add(gun);
  }
}
function spawnKnives() {
  if (frameCount%250===0) {
    knife = createSprite(random(800,1000),random(200,460));
    knife.velocityX=-5;
    knife.addImage(knifeImage);
    knife.scale=0.2;
    knife.lifetime=200;
    knifeGroup.add(knife);
  }
}