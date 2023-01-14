// draw a bullet originating from location with the speed of velocity
function drawBullet(canvas, location, velocity) {
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(location[0], location[1]);
    ctx.lineTo(location[0] + velocity[0], location[1] + velocity[1]);
    ctx.stroke();
}


// Draw score on canvas
function drawScore(c, isGameOver=false) {
    let ctx = c.getContext("2d");
    ctx.font = "32px Arial";
    if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(`GAME OVER! Final score: ${SCORE}.`, CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2);
        ctx.fillText(`Write H for Hiragana, K for Katakana`, CANVAS_SIZE[0]/2, CANVAS_SIZE[1]/2 + 48);
    }
    else {
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${SCORE}`, 0, 32);
    }
}

// draw polygon
// goes through unit circle
function drawRegularPolygon(canvas, location, radius, sides, color=null, rotation=0) {
    var ctx = canvas.getContext("2d");
    
    // Random color if no color is given (Flashing every update)
    if (color === null) {
        let r = rng(0, 255);
        let g = rng(0, 255);
        let b = rng(0, 255);

        let strokeStyleString = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        ctx.strokeStyle = strokeStyleString;
    }
    else {
        ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    var x=location[0]+Math.cos(0+rotation)*radius;
    var y=location[1]+Math.sin(0+rotation)*radius;
    ctx.moveTo(x, y);
    sides/=2;
    for(var i=Math.PI/sides;i<=Math.PI*2;i+=Math.PI/sides){
        var x=location[0]+Math.cos(i+rotation)*radius;
        var y=location[1]+Math.sin(i+rotation)*radius;
        ctx.lineTo(x, y);
    }
    var x=location[0]+Math.cos(0+rotation)*radius;
    var y=location[1]+Math.sin(0+rotation)*radius;
    ctx.lineTo(x, y);
    
    ctx.stroke();
}