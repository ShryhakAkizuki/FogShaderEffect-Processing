let t = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    makeTextures();
    generateForest();
}

function draw() {
    background(fogColor[0], fogColor[1], fogColor[2]);

    // TEMPORAL
    camera(0, 650, 650, 0, 0, 0, 0, 1, 0);

    drawGround();
    drawPath();
    drawForest();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
