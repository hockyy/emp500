// random number generator
function rng(min, max) {
    return Math.random() * (max - min) + min;
}

// clear canvas
function clearCanvas(canvas){
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,CANVAS_SIZE[0],CANVAS_SIZE[1]);
}

// initialize canvas with selected width and height
function initCanvas(canvasID, width, height) {
    let c = document.getElementById(canvasID);
    let ctx = c.getContext("2d");
    c.setAttribute("width",width+"px");
    c.setAttribute("height",height+"px");
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    return c;
}