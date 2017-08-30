
// This section contains some game constants. It is not super interesting
var GAME_WIDTH    = 1000;
var GAME_HEIGHT   = 700;

var ENEMY_WIDTH   = 45;
var ENEMY_HEIGHT  = 100;
var MAX_ENEMIES   = 5;

var MAX_LASERS    = 1;

var PLAYER_WIDTH  = 75;
var PLAYER_HEIGHT = 54;

var LASER_HEIGHT  = 75;
var LASER_WIDTH   = 75;

var PLAYER_LIVES  = 10;

// These three constants keep us from using "magic numbers" in our code
var LEFT_ARROW_CODE  = 37;
var RIGHT_ARROW_CODE = 39;
var UP_ARROW_CODE    = 38;
var DOWN_ARROW_CODE  = 40;
var SPACEBAR_CODE    = 32;
var W_KEY_CODE = 87;
var S_KEY_CODE = 83;
var D_KEY_CODE=68;
var A_KEY_CODE=65;

// These three constants allow us to DRY
var MOVE_LEFT  = 'left';
var MOVE_RIGHT = 'right';
var MOVE_UP    = 'up';
var MOVE_DOWN  = 'down';



//var canShoot = true;

// Preload game images
var images = {};
['caterpillar.png', 'background.jpg', 'charizard.png','fire.png'].forEach(imgName => {
    var img = document.createElement('img');
    img.src = 'images/' + imgName;
    images[imgName] = img;
});
//New Game button
var button = document.querySelector('#start')

function randomDirection(randNumber){
  switch(randNumber){
    case 1:
      return 'down'
      break;

   case 2:
      return 'left'
      break;
  case 3:
    return'right';
    break;

    default:
      break;
  }

}


class Entity {
    render(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y);
    }

    update(timeDiff, direction) {
        if (direction === 'down')  {
            this.y = this.y + timeDiff * this.speed;
        }
        else if(direction === 'left') {
          this.x = this.x - (timeDiff * this.speed);
        }
        else if(direction === 'right'){
          this.x = this.x +(timeDiff * this.speed);

        }

        else {
            this.y = this.y - timeDiff * this.speed;
        }
    }
}


// This section is where you will be doing most of your coding
class Enemy extends Entity {
    constructor(xPos,yPos,direction) {
        super();
        this.direction = direction;
        if(this.direction ==='left'){
          this.x = 950;
        }
        else if(this.direction ==='right'){
          this.x = 50;
        }
        else{
          this.x = xPos;
        }
        this.y = yPos || -ENEMY_HEIGHT;
        this.sprite = images['caterpillar.png'];

        this.width  = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;

        // Each enemy should have a different speed
        this.speed = Math.random() / 40 + 0.25;
        console.log(this.speed)
    }
}

class Player extends Entity {
    constructor() {
        super();

        this.x = 2 * PLAYER_WIDTH;
        this.y = GAME_HEIGHT - PLAYER_HEIGHT - 10;
        this.sprite = images['charizard.png'];

        this.width  = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;

        this.playerLives = PLAYER_LIVES;
    }

    // This method is called by the game engine when left/right arrows are pressed
    move(direction) {
        if (direction === MOVE_LEFT && this.x > 0) {
            this.x = this.x - PLAYER_WIDTH;

        }
        else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
            this.x = this.x + PLAYER_WIDTH;
        }
        else if (direction === MOVE_UP &&  this.y > PLAYER_HEIGHT) {
           this.y = this.y - PLAYER_HEIGHT;
       }
        else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT  - (PLAYER_HEIGHT + 10)) {
           this.y = this.y + PLAYER_HEIGHT;
       }
    }

    changeLives(change) {
        this.playerLives += change;
    }


    //shoot(canShoot) {
    shoot(direction) {
        if (!this.lasers) {
            this.lasers = [];
        }

        //while (canShoot) {
            if (this.lasers.length < MAX_LASERS) {
                var laser = new Laser(this.x, this.y-PLAYER_HEIGHT,direction);
                this.lasers.push(laser);
            }
        //}
    }
}

class Laser extends Entity {
    constructor(xPos, yPos,direction) {
        super();
        this.direction = direction;
        this.x = xPos;
        this.y = yPos;

        this.width  = LASER_WIDTH;
        this.height = LASER_HEIGHT;

        this.sprite = images['fire.png'];
        this.speed = 0.6;
    }
}


/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
The engine will try to draw your game at 60 frames per second using the requestAnimationFrame function
*/
class Engine {
    constructor(element) {
        // Setup the player
        this.player = new Player();

        // Setup enemies, making sure there are always three
        this.setupEnemies();

        // Setup the <canvas> element where we will be drawing
        var canvas = document.createElement('canvas');
        var app = document.querySelector('#app')
        canvas.width = GAME_WIDTH;
        canvas.height = GAME_HEIGHT;
        app.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        // Since gameLoop will be called out of context, bind it once here.
        this.gameLoop = this.gameLoop.bind(this);
    }

    /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
    setupEnemies() {
        if (!this.enemies) {
            this.enemies = [];
        }

        while (this.enemies.filter(e => !!e).length < MAX_ENEMIES) {
            this.addEnemy();
        }
    }

    // This method finds a random spot where there is no enemy, and puts one in there
    addEnemy() {
        var enemySpots = GAME_WIDTH / ENEMY_WIDTH;

        var enemySpot;
        var direction = randomDirection(Math.floor(Math.random() * 3) + 1 )
        if(direction === 'down'){
          while (this.enemies[enemySpot]) {
              enemySpot = Math.floor(Math.random() * enemySpots);
          }

          this.enemies[enemySpot] = new Enemy(enemySpot * ENEMY_WIDTH,undefined,'down');
      }
      else if(direction ==="left"){
        while (this.enemies[enemySpot]) {
            enemySpot = Math.floor(Math.random() * enemySpots);
        }

        this.enemies[enemySpot] = new Enemy(undefined,enemySpot * 40,'left');
    }
      else {
        while (this.enemies[enemySpot]) {
            enemySpot = Math.floor(Math.random() * enemySpots);
        }

        this.enemies[enemySpot] = new Enemy(undefined,enemySpot * 40,'right');

      }

        }



        // Keep looping until we find a free enemy spot at random


    // This method kicks off the game
    start() {
        this.score = 0;
        this.lastFrame = Date.now();
        this.player.playerLives = 10;

        // Listen for keyboard left/right and update the player
        document.addEventListener('keydown', e => {
            if (e.keyCode === LEFT_ARROW_CODE) {
                this.player.move(MOVE_LEFT);
            }
            else if (e.keyCode === RIGHT_ARROW_CODE) {
                this.player.move(MOVE_RIGHT);
            }
            else if (e.keyCode === UP_ARROW_CODE) {
                this.player.move(MOVE_UP);
            }
            else if (e.keyCode === DOWN_ARROW_CODE) {
                this.player.move(MOVE_DOWN);
            }
            else if(e.keyCode === W_KEY_CODE){
              this.player.shoot('up')
            }
            else if(e.keyCode === D_KEY_CODE){
              this.player.shoot('right')

            }
            else if(e.keyCode === S_KEY_CODE){
              this.player.shoot('down')
            }
            else if(e.keyCode === A_KEY_CODE){
              this.player.shoot('left')

            }
            else if (e.keyCode === SPACEBAR_CODE) {
                this.player.shoot();
                //this.player.shoot(canShoot);
                // canShoot = false
                // document.setTimeout(function() {
                //     canShoot = true
                // }, 5000);
            }
        });

        this.gameLoop();
    }

    /*
    This is the core of the game engine. The `gameLoop` function gets called ~60 times per second
    During each execution of the function, we will update the positions of all game entities
    It's also at this point that we will check for any collisions between the game entities
    Collisions will often indicate either a player death or an enemy kill

    In order to allow the game objects to self-determine their behaviors, gameLoop will call the `update` method of each entity
    To account for the fact that we don't always have 60 frames per second, gameLoop will send a time delta argument to `update`
    You should use this parameter to scale your update appropriately
     */
    gameLoop() {

        // Check how long it's been since last frame
        var currentFrame = Date.now();
        var timeDiff = currentFrame - this.lastFrame;

        // Increase the score!
        this.score += timeDiff;

        // Call update on all enemies
        this.enemies.forEach(enemy => enemy.update(timeDiff,enemy.direction));

        // if(this.isEnemyDead()){
        //     return true;
        // }
        this.isEnemyDead();

        // Draw everything!
        this.ctx.drawImage(images['background.jpg'], 0, 0,1000,700); // draw the star bg
        this.enemies.forEach(enemy => enemy.render(this.ctx)); // draw the enemies
        this.player.render(this.ctx); // draw the player

        if (this.player.lasers) {
            for (var i = 0, l = this.player.lasers.length; i < l; i++) {

                this.player.lasers[i].update(timeDiff, this.player.lasers[i].direction); // update each laser that has been used
            }

            this.player.lasers.forEach(laser => laser.render(this.ctx)); // draw the laser
        }

        // Check if any enemies should die
        this.enemies.forEach((enemy, enemyIdx) => {
            if (enemy.y > GAME_HEIGHT) {
                delete this.enemies[enemyIdx];
            }
           if(enemy.x < 1){

              delete this.enemies[enemyIdx];
            }
            if(enemy.x > 999){
              delete this.enemies[enemyIdx];
            }
        });
        this.setupEnemies();

        if (this.player.lasers) {
            this.player.lasers.forEach((laser, laserIdx) => {
                if ((laser.y + LASER_HEIGHT) < 0) {
                    this.player.lasers.splice(laserIdx, 1);
                }
                if((laser.x +LASER_WIDTH) > 999){
                  this.player.lasers.splice(laserIdx, 1);

                }
                if((laser.x <1)){
                  this.player.lasers.splice(laserIdx, 1);

                }
                if(laser.y > GAME_HEIGHT){
                  this.player.lasers.splice(laserIdx, 1);


                }
            });
        }


        // Check if player is dead
        if (this.isPlayerDead()) {
            // If they are dead, then it's game over!
            this.ctx.font = 'bold 30px Impact';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(this.score + ' GAME OVER', 5, 30);
            button.style.visibility ='initial';

        }
        else {
            // If player is not dead, then draw the score
            this.ctx.font = 'bold 30px Impact';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(this.score, 5, 30);

            // Set the time marker and redraw
            this.lastFrame = Date.now();
            requestAnimationFrame(this.gameLoop);
        }
    }

// Can turn these two functions (isPlayerDead and isEnemyDead) into 1 function that checks collision between two elements

    isColliding(entity1, entity2) {

        if (entity1.x < entity2.x + entity2.width -20 &&
            entity1.x + entity1.width-20 > entity2.x
            && entity1.y < entity2.y + entity2.height -20
            && entity1.height-20 + entity1.y > entity2.y)
            {
                return true;
            }
        else {
            return false;
        }
    }

    isPlayerDead() {
        // TODO: fix this function!
        for (var i = 0, l = this.enemies.length; i < l; i++) {
          if(this.enemies[i]=== undefined){
          }
          else{
            if (this.isColliding(this.player, this.enemies[i])) {
                this.player.changeLives(-1);
                delete this.enemies[i];

                if (this.player.playerLives === 0) {
                    return true;
                }
            }
          }
        }
        return false;

    }

    isEnemyDead() {
          for (var i = 0, l = this.enemies.length; i < l; i++)
            if(this.enemies[i]===undefined){
            }
              else{
                if (this.player.lasers) {
                    for (var j = 0, k = this.player.lasers.length; j < k; j++) {
                        if (this.isColliding(this.player.lasers[j], this.enemies[i])) {
                            delete this.enemies[i];
                            this.player.lasers.splice(j, 1);

                            this.score += 1000;

                            return true;
                        }
                     }
                   }
                }
          return false;

        }

        restart() {
            this.score = 0;
            this.lastFrame = Date.now();
            this.player.playerLives = 10;

            // Listen for keyboard left/right and update the player


            this.gameLoop();
        }

    }
    //couldnt use the start function to restart the game
    //because it will repeatedly addEventListeners causing
    //the player to move the entire width of the screen eventually
    //there is probably a better way to fix this issue, but this was quick and got the job done







// // This section will start the game
var gameEngine = new Engine(document.getElementById('app'));
gameEngine.start();

button.addEventListener('click',function(event){
  event.preventDefault()
  gameEngine.restart();
  button.style.visibility ='hidden';
});
