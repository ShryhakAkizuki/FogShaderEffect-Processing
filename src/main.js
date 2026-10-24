const PATH_RADIUS              = 200;
const CAMERA_HEIGHT            = 30;
const SECONDS_PER_LAP          = 48;
const WALK_BOUNCE_AMPLITUDE    = 2;
const WALK_STEPS_PER_LAP       = 96;
const LOOK_AHEAD_ANGLE         = 0.02;
const LESSON_MODE_NEAR_PLANE   = 12;
const DISTANCE_MODE_NEAR_PLANE = 0.1;
const FAR_PLANE                = 2000;

let fogColor = [205, 214, 228];
let t = 0;

let grassTex, pathTex, treeTex, trunkTex, rockTex;

// Flag TEMPORAL
const DEBUG_TEXTURES = true;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();

    noiseSeed(42);
    grassTex = makeGrassTex();
    pathTex  = makePathTex();
    treeTex  = makeTreeTex();
    trunkTex = makeTrunkTex();
    rockTex  = makeRockTex();
}

function draw() {
    background(fogColor[0], fogColor[1], fogColor[2]);

    if (DEBUG_TEXTURES) {
        drawTextureBoard();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
