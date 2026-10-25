// Estado
let grassTex, pathTex, treeTex, trunkTex, rockTex;

function makeTextures() {
    noiseSeed(NOISE_SEED);
    grassTex = makeGrassTex();
    pathTex  = makePathTex();
    treeTex  = makeTreeTex();
    trunkTex = makeTrunkTex();
    rockTex  = makeRockTex();
}

function tileNoise(sizeX, sizeY, scale, x, y) {
    const mx = Math.min(x, sizeX - x) * scale;
    const my = Math.min(y, sizeY - y) * scale;
    return noise(mx, my);
}

function makeGrassTex() {
    const S = 512;
    const g = createGraphics(S, S);
    g.loadPixels();
    const px = g.pixels;
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            const i = (y * S + x) * 4;
            const patch = tileNoise(S, S, 1 / 28, x, y); // manchas claras/oscuras
            const grain = tileNoise(S, S, 1 / 5, x, y);  // grano fino
            px[i]     = 48 + patch * 30 + (grain - 0.5) * 16;
            px[i + 1] = 96 + patch * 48 + (grain - 0.5) * 24;
            px[i + 2] = 36 + patch * 16 + (grain - 0.5) * 8;
            px[i + 3] = 255;
        }
    }
    g.updatePixels();
    return g;
}

function makePathTex() {
    const S = 256;
    const g = createGraphics(S, S);
    g.loadPixels();
    const px = g.pixels;
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            const i = (y * S + x) * 4;
            const clumps = tileNoise(S, S, 1 / 16, x, y);
            const gravel = tileNoise(S, S, 1 / 4, x, y);
            let cr = 128 + (clumps - 0.5) * 46 + (gravel - 0.5) * 20;
            let cg = 100 + (clumps - 0.5) * 36 + (gravel - 0.5) * 16;
            let cb = 74 + (clumps - 0.5) * 24 + (gravel - 0.5) * 10;
            // borde oscuro arriba/abajo 
            const edge = Math.min(1, Math.min(y, S - 1 - y) / 26);
            const shade = 0.45 + 0.55 * edge;
            px[i]     = cr * shade;
            px[i + 1] = cg * shade;
            px[i + 2] = cb * shade;
            px[i + 3] = 255;
        }
    }
    g.updatePixels();
    return g;
}

function makeTreeTex() {
    const S = 256;
    const g = createGraphics(S, S);
    g.loadPixels();
    const px = g.pixels;
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            const i = (y * S + x) * 4;
            const band = tileNoise(S, S, 1 / 7, x, y);
            const fine = tileNoise(S, S, 1 / 3, x, y * 0.3);
            let cr = 22 + band * 26 + (fine - 0.5) * 12;
            let cg = 58 + band * 44 + (fine - 0.5) * 18;
            let cb = 26 + band * 18 + (fine - 0.5) * 8;

            const shade = 1.15 - 0.55 * (y / S);
            px[i]     = cr * shade;
            px[i + 1] = cg * shade;
            px[i + 2] = cb * shade;
            px[i + 3] = 255;
        }
    }
    g.updatePixels();
    return g;
}

function makeTrunkTex() {
    const W = 128, H = 256;
    const g = createGraphics(W, H);
    g.loadPixels();
    const px = g.pixels;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4;
            const base = tileNoise(W, H, 1 / 20, x, y);
            const grain = tileNoise(W, H, 1 / 6, x, y * 0.35);
            let cr = 84 + (base - 0.5) * 30 + (grain - 0.5) * 22;
            let cg = 58 + (base - 0.5) * 22 + (grain - 0.5) * 14;
            let cb = 38 + (base - 0.5) * 14 + (grain - 0.5) * 8;
            const shade = 1.08 - 0.3 * (y / H); // más oscuro hacia la base
            px[i]     = cr * shade;
            px[i + 1] = cg * shade;
            px[i + 2] = cb * shade;
            px[i + 3] = 255;
        }
    }
    g.updatePixels();
    return g;
}

function makeRockTex() {
    const S = 128;
    const g = createGraphics(S, S);
    g.loadPixels();
    const px = g.pixels;
    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            const i = (y * S + x) * 4;
            const n1 = tileNoise(S, S, 1 / 10, x, y);
            const n2 = tileNoise(S, S, 1 / 3, x, y);
            let cr = 112 + (n1 - 0.5) * 40 + (n2 - 0.5) * 18;
            let cg = 116 + (n1 - 0.5) * 38 + (n2 - 0.5) * 16;
            let cb = 124 + (n1 - 0.5) * 34 + (n2 - 0.5) * 14;
            const shade = 1.12 - 0.45 * (y / S);
            px[i]     = cr * shade;
            px[i + 1] = cg * shade;
            px[i + 2] = cb * shade;
            px[i + 3] = 255;
        }
    }
    g.updatePixels();
    return g;
}
