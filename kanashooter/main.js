// canvas size [x, y]. Remember to change wrapper too. (css)
var CANVAS_SIZE = [1280, 720];

// url params
const urlParams = new URLSearchParams(window.location.search);

// main function, executed on body load
function main() {
    // check if url params given
    let mobile = urlParams.get('mobile');
    
    if (mobile === '1') {
        CANVAS_SIZE = [720, 1280];
    }
    
    // init text input
    SPEED = document.getElementById("speed");
    window.addEventListener('range-changed', (e) => {
        LB_SPEED = e.detail.minRangeValue;
        UB_SPEED = e.detail.maxRangeValue;
    });
    // init text input
    DENSITY = document.getElementById("densityValue");
    DENSITY.innerText = document.getElementById("density").value
    // init text input
    USERINPUT = document.getElementById("kanaInput");
    // initialize main canvas
    let c = initCanvas("canvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
    // initialize scrolling background canvas
    let bgCanvas = initCanvas("bgCanvas", CANVAS_SIZE[0], CANVAS_SIZE[1]);
    
    // scroll background
    var ctx = bgCanvas.getContext("2d");
    var bgImg = new Image();
    bgImg.src = "space.png";

    bgImg.onload = function() {
        
        var imgHeight = 0;
        var scrollSpeed = 3;

        function loop() {
            if (INTERVAL !== null) {
                // Move background image up, but also draw another one below -> Creates a scrolling effect
                ctx.drawImage(bgImg, 0, imgHeight);
                ctx.drawImage(bgImg, 0, imgHeight - bgCanvas.height);
                imgHeight += scrollSpeed;
                
                // Reset when fully scrolled
                if (imgHeight == bgCanvas.height) {
                    imgHeight = 0;
                }
            }
            
            // let's make the loop... loop by requesting animation frame
            window.requestAnimationFrame(loop);
        }

        loop();
    }

    // start actual simulation
    startSimulation(c);
}

// Array for enemies
var ENEMIES=[];
// Array for bullets
var BULLETS=[];
// how many times is the simulation being done in a second (Hz)
var SIMULATION_RATE = 30;
var FULL_PACK_SCORE = 100;
// Score
var SCORE = -FULL_PACK_SCORE;
// Current combo
var COMBO = 0;
// the interval is stored in this variable
var INTERVAL = null;

// loops performed
let LOOPS = 0;
var DENSITY = null;
var SPEED = null;
// user input textbox
var USERINPUT = null;
// Erase textbox text automatically
var ENABLE_AUTO_ERASE = false;
// Current character set
var CURRENT_CHARSET = hiragana;
// Is game over?
var isGameOver = true;
var remainingCharacters = [];


//CHANGE HERE
var INCLUDE_YOUON = false
var INCLUDE_ALL = true
var SPARSITY = 30// The lower the more dense
var LB_SPEED = 3 // Lower bound for speed
var UB_SPEED = 5

function updateDensity(val){
    SPARSITY = val;
    DENSITY.innerText = val
}

// simulation logic, most the action happens here
function startSimulation(c) {
    // Player location
    var PLAYER = new Player([CANVAS_SIZE[0]/2, CANVAS_SIZE[1] - 25]);

    let ctx = c.getContext("2d");
    ctx.font = "32px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(`ゲームへようこそ！`, CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2);
    ctx.fillText(`Write H for Hiragana, K for Katakana`, CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2 + 64);
    ctx.fillText(`Please use the textbox below to play the game.`, CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2 + 128);

    USERINPUT.focus();


    INTERVAL = setInterval(function() {
        if (!isGameOver) {
            if (ENABLE_AUTO_ERASE && USERINPUT.value.length > 3) {
                USERINPUT.value = "";
            }
            // Clear the canvas
            clearCanvas(c);
            // Draw current score
            drawScore(c);
            // Draw player character on screen
            PLAYER.draw(c);

            // Generate ENEMIES
            // Add new enemy every N iteration of the interval loop
            if (LOOPS > (SPARSITY*(1/(SCORE===0)?1:SCORE))) {
                ENEMIES.push(new Enemy([rng(40, CANVAS_SIZE[0]-40),0], [0,rng(LB_SPEED, UB_SPEED)], INCLUDE_YOUON, INCLUDE_ALL));
                LOOPS = 0;
            }
            LOOPS++;
        
            // Calculate new locations to ENEMIES
            for (let i = 0; i < ENEMIES.length; ++i) {
                if (!ENEMIES[i].destroyed && !ENEMIES[i].hitTaken && USERINPUT.value.toLowerCase() === ENEMIES[i].kana.ro) {
                    PLAYER.location = [ENEMIES[i].location[0], PLAYER.location[1]];
                    BULLETS.push(new Bullet(PLAYER.location, [0, -20]));
                    USERINPUT.value = "";
                    ENEMIES[i].hitTaken = true;
                }
                // If the enemy ship is not destroyed, move it
                if (!ENEMIES[i].destroyed) {
                    // Get the new location
                    let velocity = subtractVectors(ENEMIES[i].location, ENEMIES[i].oldLocation);
                    let newLoc = addVectors(ENEMIES[i].location, velocity);

                    // Update old location and new location variables
                    ENEMIES[i].oldLocation = ENEMIES[i].location;
                    ENEMIES[i].location = newLoc;

                    // Draw the enemy on the canvas
                    ENEMIES[i].draw(c);

                    // If the enemy gets to the bottom of the screen
                    // it's game over
                    if (ENEMIES[i].location[1] >= CANVAS_SIZE[1]) {
                        clearCanvas(c);
                        drawScore(c, true);
                        isGameOver = true;
                        ENEMIES = [];
                        BULLETS = [];
                        SCORE = -FULL_PACK_SCORE;
                        COMBO = 0;
                        remainingCharacters = []
                        USERINPUT.value = "";
                    }
                }
            }

            // Calculate new locations to BULLETS
            for (let i = 0; i < BULLETS.length; ++i) {
                // Get the new location
                let velocity = subtractVectors(BULLETS[i].location, BULLETS[i].oldLocation);
                let newLoc = addVectors(BULLETS[i].location, velocity);

                // Update old location and new location variables
                BULLETS[i].oldLocation = BULLETS[i].location;
                BULLETS[i].location = newLoc;

                // Draw the bullet on the canvas
                BULLETS[i].draw(c);

                // Hit detection, if a hit is detected, mark bullet and enemy as destroyed
                for (let j = 0; j < ENEMIES.length; j++) {
                    if (ENEMIES[j] !== undefined && BULLETS[i] !== undefined && !BULLETS[i].destroyed && !ENEMIES[j].destroyed && ENEMIES[j].hitTaken && BULLETS[i].checkForHit(ENEMIES[j])) {
                            BULLETS[i].destroyed = true;
                            ENEMIES[j].destroyed = true;
                            SCORE += Math.round(3 * (ENEMIES[j].location[1] - ENEMIES[j].oldLocation[1]));

                            COMBO += 1; // get combo for a hit
                    }
                }
            }

            // Remove destroyed enemies
            for (let i = 0; i < ENEMIES.length; ++i) {
                if (ENEMIES[i].destroyed) {
                    ENEMIES[i].playHitSound();
                    ENEMIES.splice(i, 1); 
                }
                // Remove enemies when they are too far off screen
                else if (ENEMIES[i].location[1] < 0 || ENEMIES[i].location > CANVAS_SIZE[1]) {
                    ENEMIES.splice(i, 1);
                }
            }

            // Remove destroyed bullets
            for (let i = 0; i < BULLETS.length; ++i) {
                if (BULLETS[i].destroyed) {
                    BULLETS.splice(i, 1);
                }
                // Remove bullets when they are too far off screen
                else if (BULLETS[i].location[1] < 0 || BULLETS[i].location[1] > CANVAS_SIZE[1]) {
                    BULLETS.splice(i, 1);
                    COMBO = 0;
                }
            }

        }
        else {
            if (USERINPUT.value.toLowerCase() === "h") {
                CURRENT_CHARSET = hiragana;
                USERINPUT.value = "";
                isGameOver = false;
            }               
            else if (USERINPUT.value.toLowerCase() === "k") {
                CURRENT_CHARSET = katakana;
                USERINPUT.value = "";
                isGameOver = false;
            }
        }
    },1000/SIMULATION_RATE);
}
