let t = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    makeTextures();
    generateForest();
}

function draw() {
    background(fogColor[0], fogColor[1], fogColor[2]);

    const theta = 0;
    setupCamera(theta);

    drawGround();
    drawPath();
    drawForest();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setupCamera(theta) {

    const fov = PI / 3;
    perspective(fov, width / height, DISTANCE_MODE_NEAR_PLANE, FAR_PLANE);

    const x = PATH_RADIUS * cos(theta);
    const z = PATH_RADIUS * sin(theta);
    const y = CAMERA_HEIGHT;

    const a  = theta + LOOK_AHEAD_ANGLE;
    const lx = PATH_RADIUS * cos(a);
    const ly = y;
    const lz = PATH_RADIUS * sin(a);

    camera(x, y, z, lx, ly, lz, 0, 1, 0);
}
