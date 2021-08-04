//Project made by Dor Shemesh

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

const FACING_DOWN = 0; //Down index
const FACING_UP = 3; // UP Index
const FACING_LEFT = 1; //Left Index
const FACING_RIGHT = 2; //Right Index
const FLOOR = 450; //Floor illusion
const TOP = 0; //TOP illusion
const LEFT_WALL = 78; //Left Wall illusion
const RIGHT_WALL = 700;//Right Wall illusion
const SHADOW_X = 0;
const SHADOW_Y = 25;

let keyPresses = {}; //A varible for the pressed keys
let boss = new Image();
let blackmage = new Image(); //Picture named olive object
let shadow = new Image();
let bg = new Image(); //Background IMG Object




class Boss{
	constructor(){
	this.health = 300;
	this.damage = 15;
	this.W = 120;
	this.H = 200;
	this.width = 384/4;
	this.height = 384/4;
	this.source = 'images/sprites/bahamut.png';
	
	//Movement values
	this.hasMove = false;
	this.posX = 315;
	this.posY = 50;
	this.speed = 0.5;
	this.direction = 0;
	this.CycleLoop = [0, 1, 2, 3];
	
	//Animation values
	this.frameLimit = 9;
	this.frameX = 0;
	this.frameCount = 0;
	this.curLoopIndex = 0;
	this.zIndexInc = false;
	
	//Attack
	this.inRadius = false;
	
	//Fixed coordinates (Fix the center of the boss)
	this.fixedPosX = 27;
	this.fixedPosY = 115;

		}
	}


class Player{
	constructor(){
		this.source = 'images/sprites/blackmage.png'
		this.health = 100;
		this.stamina = 100;
		this.W = 50;
		this.H = 80;
		this.width = 128/4; //Frame player.width
		this.height = 192/4; //Frame player.height
		this.speed = 2.5;
		this.posX = 350;
		this.posY = 400;

		//Animation
		this.hasMoved = false;
		this.currentDirection = FACING_UP;
		this.FPSLimit = 6;
		this.curLoopIndex = 0;
		this.frameCount = 0;
		this.CycleLoop = [0,1,2,3];

		this.zIndexInc = false;
		this.isTakingDMG = false;


		
	}
}

function Skill (source, name, width, height,H , W, posX, posY, FPSLimit, frames, coolDown, damage, stamina, radius){
		this.isATK = false;
		this.source = source;
		this.name = new Image();
		this.width = width;
		this.height = height;
		this.H = H;
		this.posX = posX;
		this.posY = posY;

		//Animation
		this.frameCount = 0;
		this.FPSLimit = FPSLimit;
		this.frameY = 0;
		this.CycleLoop = [];
		for(var i=0; i<frames; i++){
			this.CycleLoop.push(i);
		}
		this.curLoopIndex = 0;
		
		//Stats
		this.isCoolDown = false;
		this.coolDown = coolDown;
		this.damage = damage;	
		this.stamina = stamina;
		this.radius = radius;
		this.direction = 0;

	}



const currentBoss = new Boss();

const player = new Player();

const energyBall = new Skill("images/skills/player/energyBall_attack.png",
					  "EnergyBall",
					  512/4,
					  128,
					  128,
					  512/4,
					  0,
					  0,
					  5,
					  4,
					  1500,
					  25,
					  15,
					  100		  		   
					 );

const lightning = new Skill("images/skills/player/lightning_attack.png",
					 "Lightning",
					 512/8,
					 256,
					 256,
					 512/8,
					 0,
					 0,
					 5,
					 8,
					 1000,
					 15,
					 10,
					 70
					 );	
					 
const energyBall_hit = new Skill("images/skills/player/energyball_hit.png",
						   "EnergyBall_hit",
						   896/7,
						   128,
						   128,
						   896/7,
						   0,
						   0,
						   5,
						   7,
						   0,
						   0,
						   0,
						   0
						   );

//Load all the images
function loadImage() {
  blackmage.src = player.source;
  bg.src = 'images/maps/Arena.png';
  boss.src = currentBoss.source;
  shadow.src = 'images/particles/shadow.png';
  energyBall.name.src = energyBall.source;
  energyBall_hit.name.src = energyBall_hit.source;
  lightning.name.src = lightning.source;
  blackmage.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

//Draw player's animation
function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(blackmage,
                frameX * player.width, frameY * player.height, player.width, player.height,
                canvasX, canvasY, player.W, player.H);
  
}

//Draw boss's animation
function drawBoss(frameX, frameY, canvasX, canvasY){
  ctx.drawImage(boss,
                frameX * currentBoss.width, frameY * currentBoss.height, currentBoss.width, currentBoss.height,
                canvasX, canvasY, currentBoss.W, currentBoss.H);
  
}


//A function to get X,Y coordinates + Lightning skill attack
	function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
	drawSkill(lightning, x-30, y-200);
    console.log("Cursor:  x: " + x + " y: " + y);
	console.log("Monster: x: " + currentBoss.posX + " y: " + currentBoss.posY);
	console.log("Player:  x: " + player.posX + " y: " + player.posY);
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})


//Player take damage -> (can be collab with function bossTakeDamage)
function takeDMG(object, damage){
	if(!object.isTakingDMG){
	console.log("Player is taking " + damage + " damage.");
	object.health-=damage;
	object.isTakingDMG = true;
	setTimeout(function(){ object.isTakingDMG = false; }, 3000);	
	}
}

//Boss taking damage function
function bossTakeDamage(skill, X, Y){
	var r = skill.radius;
	var xRadius = Boolean(X+r/2 > currentBoss.posX && X-r/2 < currentBoss.posX);
	var yRadius = Boolean(Y-r-25 < currentBoss.posY && Y+r > currentBoss.posY);
	if(xRadius && yRadius){
		console.log("Boss hit");
		currentBoss.health-=skill.damage;
		if(skill == energyBall){
			drawSkill(energyBall_hit, X, Y);
			skill.isATK = false;
		}
		
	}  
}


//Draw Skill function + assigning specific data to certain skills
function drawSkill(skill, X, Y){
			if(!skill.isATK && player.stamina-skill.stamina > 0 && !skill.isCoolDown){
					skill.isCoolDown = true;
					skill.posX = X;
					skill.posY = Y;
					skill.isATK = true;
					setTimeout(function(){ skill.isCoolDown = false; }, skill.coolDown);
				
					
			if(skill == energyBall){

						//player.zIndexInc = true;
						skill.posX-=40;
						skill.posY-=25;
				switch(player.currentDirection){
					case 0:	//down
						skill.posY+=15;
						skill.direction = 0;
					break;
					case 1:	//left
						skill.posX-=30;
						skill.direction = 1;
					break;
					case 2:	//right
						skill.posX+=25;
						skill.direction = 2;
					break;
					case 3:	//up
						skill.posY+=5;
						skill.direction = 3;
					break;
			}
			bossTakeDamage(skill, X, Y);
		}else if(skill == lightning){
			bossTakeDamage(skill, X-40, Y+100);
		}
		player.stamina-=skill.stamina;
		
	}
}

function refillStamina(){
	if(player.stamina <= 100){
		player.stamina+=0.05;
	}
}

//Draw function
function draw(skill){
	if(skill.isATK){
		if(skill == energyBall){
			switch(skill.direction){
				case 0:	//down
					skill.posY+=10;
				break;
				case 1:	//left
					skill.posX-=10;
				break;
				case 2:	//right
					skill.posX+=10
				break;
				case 3:	//up
					skill.posY-=10;
				break;
			}
			bossTakeDamage(energyBall, skill.posX, skill.posY);
			
		}	

	  skill.frameCount++;
	  if (skill.frameCount >= skill.FPSLimit) {
		skill.frameCount = 0;
		//Controlls the animation
		skill.curLoopIndex++;
		if (skill.curLoopIndex >= skill.CycleLoop.length) {
			skill.isATK = false;
			skill.curLoopIndex = 0;
			
		}
		
	  }

		ctx.drawImage(skill.name,
                skill.CycleLoop[skill.curLoopIndex] * skill.width, 
				skill.frameY * skill.height, skill.width, skill.height,
                skill.posX, skill.posY, skill.width, skill.H);
									
	}	
}
	



//Cause the boss to follow the player, detects every situation
function bossFollow(){
	
	var incDistance = 80;
	
	currentBoss.hasMoved = false;
	
	//Movement booleans
	let isEqual = Boolean(currentBoss.posX == player.posX 
	&& currentBoss.posY == player.posY);
	let isAbove = Boolean(currentBoss.posY + incDistance < player.posY - currentBoss.fixedPosY);
	let isUnder = Boolean(currentBoss.posY - incDistance > player.posY - currentBoss.fixedPosY);
	let isLeft = Boolean(currentBoss.posX + incDistance < player.posX - currentBoss.fixedPosX);
	let isRight = Boolean(currentBoss.posX - incDistance > player.posX - currentBoss.fixedPosX);
	let isLeftAbove = Boolean(isAbove == true && isLeft == true);
	let isRightAbove = Boolean(isAbove == true && isRight == true);
	let isLeftUnder = Boolean(isUnder == true && isLeft == true);
	let isRightUnder = Boolean(isUnder == true && isRight == true);
	currentBoss.inRaius = false;
	player.zIndexInc = false;
	
		switch (true){
			case isLeftAbove:
				currentBoss.posY+=currentBoss.speed;
				currentBoss.posX+=currentBoss.speed;
				currentBoss.direction = 2;
				currentBoss.hasMoved = true;
				
			break;
			
			case isLeftUnder:
				currentBoss.posY-=currentBoss.speed;
				currentBoss.posX+=currentBoss.speed;
				currentBoss.direction = 2;
				currentBoss.hasMoved = true;
			break;
			
			case isRightAbove:
				currentBoss.posY+=currentBoss.speed;
				currentBoss.posX-=currentBoss.speed;
				currentBoss.direction = 1;
				currentBoss.hasMoved = true;
			break;
			
			case isRightUnder:
				currentBoss.posY-=currentBoss.speed;
				currentBoss.posX-=currentBoss.speed;
				currentBoss.direction = 1;
				currentBoss.hasMoved = true;
			break;
			
			case isAbove:
				currentBoss.posY+=currentBoss.speed;
				currentBoss.direction = 0;
				currentBoss.hasMoved = true;
			break;
			case isUnder:
				currentBoss.posY-=currentBoss.speed;
				currentBoss.direction = 3;
				currentBoss.hasMoved = true;
			break;
			case isLeft:
				currentBoss.posX+=currentBoss.speed;
				currentBoss.direction = 2;
				currentBoss.hasMoved = true;
			break;
			case isRight:
				currentBoss.posX-=currentBoss.speed;
				currentBoss.direction = 1;
				currentBoss.hasMoved = true;
			break;

			
			
			default:
				currentBoss.inRadius = true;
				if(currentBoss.posY< player.posY - currentBoss.fixedPosY){
					player.zIndexInc = true;
				}
				//Add Boss attack
			break;
		}
		if(currentBoss.hasMoved == true){
		  //Controlls the FPS
		  
		currentBoss.frameCount++;
		if (currentBoss.frameCount >= currentBoss.frameLimit) {
		  currentBoss.frameCount = 0;
		  //Controlls the animation
		  currentBoss.curLoopIndex++;
		  if (currentBoss.curLoopIndex >= currentBoss.CycleLoop.length) {
				currentBoss.curLoopIndex = 0;
		  }
		  
		}
		
	  }	
	   if (!currentBoss.hasMoved) {
    currentBoss.curLoopIndex = 0;
	}
	 drawBoss(currentBoss.CycleLoop[currentBoss.curLoopIndex], currentBoss.direction, currentBoss.posX, currentBoss.posY);
	
}

//Draw Health-bar and texts
function updateUI(playerHealth, playerStamina, bossHealth){

	ctx.shadowColor="transparent";
	ctx.fillStyle = "black";
	ctx.font = "30px classicArcade";
	ctx.fillText("Level 1", 10, 25);
	ctx.fillText("Boss Health", 300, 25);
	
	ctx.font = "25px classicArcade";
	ctx.fillText("Health", 15,570);
	ctx.fillText("Stamina", 675, 570);
	ctx.beginPath();
	ctx.rect(250, 26, 300, 15);	//Boss health -> bar
	ctx.rect(110, 555, 100, 15); //Player health -> bar
	ctx.rect(565, 555, 100, 15); //Player Stamina -> bar
	ctx.fillStyle = "red";
	ctx.fillRect(110, 555, playerHealth, 15); //Player health -> health
	ctx.fillRect(250, 26, bossHealth, 15); //Boss health -> health
	ctx.fillStyle = "blue";
	ctx.fillRect(565, 555, playerStamina, 15); 
	ctx.stroke();
}



window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.keyCode] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.keyCode] = false;
}


loadImage();

//Game loop, Insert here all the function you would like to interval
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.shadowOffsetY = SHADOW_Y;
  ctx.shadowOffsetX = SHADOW_X;
  ctx.shadowColor = "black";
  ctx.shadowBlur = 22.5;

  refillStamina();
  

  ctx.drawImage(bg, 0, 0, 785, 700);
  
  

  player.hasMoved = false;

  if (keyPresses[38]) { //38 == UP key
    moveCharacter(0, -player.speed, FACING_UP);
    player.hasMoved = true;
  } else if (keyPresses[40]) { //40 == DOWN Key
    moveCharacter(0, player.speed, FACING_DOWN);

    player.hasMoved = true;
  }

  if (keyPresses[37]) { //37 == LEFT Key
    moveCharacter(-player.speed, 0, FACING_LEFT);
    player.hasMoved = true;
  } else if (keyPresses[39]) { //39 == RIGHT Key
    moveCharacter(player.speed, 0, FACING_RIGHT);
    player.hasMoved = true;
  }else if (keyPresses[32]){
	  drawSkill(energyBall, player.posX, player.posY);
  }

  if (player.hasMoved) {
	  //Controlls the FPS
    player.frameCount++;
    if (player.frameCount >= player.FPSLimit) {
      player.frameCount = 0;
	  //Controlls the animation
      player.curLoopIndex++;
      if (player.curLoopIndex >= player.CycleLoop.length) {
        player.curLoopIndex = 0;
      }
    }
  }
 
  
  if (!player.hasMoved) {
    player.curLoopIndex = 0;

  }
 
	//Updates directions and looping the animation from currentBoss.CycleLoop
  drawFrame(player.CycleLoop[player.curLoopIndex], player.currentDirection, player.posX, player.posY);
  bossFollow();
  updateUI(player.health, player.stamina, currentBoss.health);
  //Draw Skills
	draw(lightning);
	draw(energyBall);
	draw(energyBall_hit);
	if(player.zIndexInc == true){
		drawFrame(player.CycleLoop[player.curLoopIndex], player.currentDirection, player.posX, player.posY);
	}else if(currentBoss.zIndexInc == true){
		drawBoss(currentBoss.CycleLoop[currentBoss.curLoopIndex], currentBoss.currentDirection, currentBoss.posX, currentBoss.posY);
	}
  window.requestAnimationFrame(gameLoop);
}


//Also checks for borders
function moveCharacter(deltaX, deltaY, direction) {
	//Check if X + DeltaX == Boss X
	var bossBarrierX = Boolean(player.posX+deltaX<currentBoss.posX+80
	&& player.posX+deltaX>currentBoss.posX-20);
	//Check if Y + DeltaY == Boss Y
	var bossBarrierY = Boolean(player.posY+deltaY<currentBoss.posY+120 
	&& player.posY+deltaY>currentBoss.posY+80);
	
  if (player.posX + deltaX < RIGHT_WALL && player.posX+ deltaX > LEFT_WALL) { //X - Scale borders
  if(!bossBarrierY || !bossBarrierX){
		player.posX += deltaX;
	}else{
		takeDMG(player, currentBoss.damage);
	}
  }

  
  if (player.posY + deltaY> TOP && player.posY + deltaY < FLOOR) { //Y - Sacle borders
	if(!bossBarrierX || !bossBarrierY){
    player.posY += deltaY;
	}else{
		takeDMG(player, currentBoss.damage);
	}
  }
  
  player.currentDirection = direction;
}