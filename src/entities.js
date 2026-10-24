
let elements = [];

function drawGround() {
    push();
    rotateX(-HALF_PI);
    texture(grassTex);
    textureWrap(REPEAT);
    plane(GRASS_SIZE, GRASS_SIZE);
    pop();
}

function drawPath() {
    push();
    translate(0, -PATH_SUNK, 0);
    rotateX(HALF_PI);
    texture(pathTex);
    textureWrap(REPEAT);
    torus(PATH_RADIUS, PATH_TUBE_RADIUS, PATH_RING_SEGMENTS, PATH_TUBE_SEGMENTS);
    pop();
}

function generateForest() {
    randomSeed(RANDOM_SEED);
    elements = [];
    for (let i = 0; i < FOREST_COUNT; i++) {
        const band = random() < 0.5 ? FOREST_BAND_INNER : FOREST_BAND_OUTER;
        const r = random(band[0], band[1]);
        const a = random(TWO_PI);
        elements.push({
            x: r * cos(a),
            z: r * sin(a),
            type:  random() < TREE_RATIO ? 'tree' : 'rock',
            h: random(TREE_H_MIN, TREE_H_MAX),
            w: random(TREE_W_MIN, TREE_W_MAX),
            phase: random(TWO_PI)
        });
    }
}

function drawForest() {
    for (const e of elements) {
        drawElement(e);
    }
}

function drawElement(e) {
    push();
    translate(e.x, 0, e.z);
    if (e.type === 'tree') {
        drawTree(e);
    } else {
        drawRock(e);
    }
    pop();
}

function drawTree(e) {
    const trunkH  = e.h * TREE_TRUNK_HEIGHT_RATIO;
    const trunkR  = e.w * TREE_TRUNK_RADIUS_RATIO;
    const crownH  = e.h * TREE_CROWN_HEIGHT_RATIO;
    const overlap = e.w * TREE_CROWN_OVERLAP_RATIO;

    push();
    translate(0, trunkH / 2, 0);
    texture(trunkTex);
    cylinder(trunkR, trunkH, TREE_DETAIL);
    pop();

    push();
    translate(0, trunkH - overlap + crownH / 2, 0);
    texture(treeTex);
    cone(e.w, crownH, TREE_DETAIL);
    pop();
}

function drawRock(e) {
    const r = e.w * 0.8;
    push();
    rotateY(e.phase);
    scale(1, ROCK_SCALE_Y, 1);
    translate(0, r * ROCK_EMBED_RATIO, 0);
    texture(rockTex);
    sphere(r, ROCK_DETAIL);
    pop();
}
