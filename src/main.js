let t = 0;
let resizeTimer = null;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(min(pixelDensity(), MAX_PIXEL_DENSITY));
    frameRate(FRAME_RATE_TARGET);
    noStroke();

    makeTextures();
    generateForest();
    initFog();
    initFogUI();
}

function draw() {
    background(fogColor[0], fogColor[1], fogColor[2]);

    t += min(deltaTime, MAX_DELTA_MS) / 1000;
    const theta = TWO_PI * (t % SECONDS_PER_LAP) / SECONDS_PER_LAP;
    setupCamera(theta);

    applyFog();
    drawGround();
    drawPath();
    drawForest();
}

function windowResized() {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        resizeTimer = null;
        resizeCanvas(windowWidth, windowHeight);
        pixelDensity(min(pixelDensity(), MAX_PIXEL_DENSITY));
        applyFog();
    }, 150);
}

function setupCamera(theta) {

    const fov = PI / 3;
    perspective(fov, width / height, DISTANCE_MODE_NEAR_PLANE, FAR_PLANE);

    const x = PATH_RADIUS * cos(theta);
    const z = PATH_RADIUS * sin(theta);

    const bounce = WALK_BOUNCE_AMPLITUDE * abs(sin(WALK_STEPS_PER_LAP * PI * (t % SECONDS_PER_LAP) / SECONDS_PER_LAP));
    const y = CAMERA_HEIGHT + bounce;

    const a  = theta + LOOK_AHEAD_ANGLE;
    const lx = PATH_RADIUS * cos(a);
    const ly = y;
    const lz = PATH_RADIUS * sin(a);

    camera(x, y, z, lx, ly, lz, 0, 1, 0);
}
