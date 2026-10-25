
let elements = [];

function drawGround() {
    push();
    rotateX(-HALF_PI);
    texture(grassTex);
    textureWrap(REPEAT);
    plane(GRASS_SIZE, GRASS_SIZE, GROUND_DETAIL, GROUND_DETAIL);
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

function rockRadius(e) {
    return e.w * ROCK_RADIUS_FACTOR;
}

function collisionRadius(e) {
    const base = (e.type === 'tree')
        ? e.w * TREE_TRUNK_RADIUS_RATIO
        : rockRadius(e);
    return base + COLLISION_MARGIN;
}

function makeCandidate() {
    const band = random() < 0.5 ? FOREST_BAND_INNER : FOREST_BAND_OUTER;
    const r = random(band[0], band[1]);
    const a = random(TWO_PI);
    return {
        x: r * cos(a),
        z: r * sin(a),
        type:  random() < TREE_RATIO ? 'tree' : 'rock',
        h: random(TREE_H_MIN, TREE_H_MAX),
        w: random(TREE_W_MIN, TREE_W_MAX),
        phase: random(TWO_PI)
    };
}

function fits(e) {
    const minD2 = collisionRadius(e);
    for (const o of elements) {
        const dx = e.x - o.x;
        const dz = e.z - o.z;
        const minD = minD2 + collisionRadius(o);
        if (dx * dx + dz * dz < minD * minD) return false;
    }
    return true;
}

function generateForest() {
    randomSeed(RANDOM_SEED);
    elements = [];
    for (let i = 0; i < FOREST_COUNT; i++) {
        let e = makeCandidate();
        let attempts = 0;
        while (!fits(e) && attempts < MAX_PLACEMENT_ATTEMPTS) {
            e = makeCandidate();
            attempts++;
        }
        if (!fits(e)) {
            console.warn(`[bosque] elemento ${i} no encontró lugar; omitido`);
            continue;
        }
        elements.push(e);
    }
    verifyNoCollisions();
}

function verifyNoCollisions() {
    // console.assert(elements.length === FOREST_COUNT,
    //     `[bosque] esperados ${FOREST_COUNT} elementos, generados ${elements.length}`);
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            const a = elements[i], b = elements[j];
            const dx = a.x - b.x;
            const dz = a.z - b.z;
            const minD = collisionRadius(a) + collisionRadius(b);
            console.assert(dx * dx + dz * dz >= minD * minD,
                `[bosque] colisión entre ${a.type}#${i} (${a.x.toFixed(1)}, ${a.z.toFixed(1)})`
                + ` y ${b.type}#${j} (${b.x.toFixed(1)}, ${b.z.toFixed(1)})`);
        }
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
    const r = rockRadius(e);
    push();
    rotateY(e.phase);
    scale(1, ROCK_SCALE_Y, 1);
    translate(0, r * ROCK_EMBED_RATIO, 0);
    texture(rockTex);
    sphere(r, ROCK_DETAIL);
    pop();
}
