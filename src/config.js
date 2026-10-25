// --- Semillas ---
const NOISE_SEED       = 42;
const RANDOM_SEED      = 42;

// --- Color de fondo / niebla ---
let fogColor = [205, 214, 228];

// --- Cámara / animación ---
const PATH_RADIUS             = 200;
const CAMERA_HEIGHT           = 30;
const SECONDS_PER_LAP         = 48;
const WALK_BOUNCE_AMPLITUDE   = 2;
const WALK_STEPS_PER_LAP      = 96;
const LOOK_AHEAD_ANGLE        = 0.02;

// --- Niebla ---
let fogNear = 80;
let fogFar  = 500;
const FOG_NEAR_MIN = 0;
const FOG_NEAR_MAX = 300;
const FOG_FAR_MIN  = 100;
const FOG_FAR_MAX  = 1000;
const FOG_MIN_GAP  = 10;

// --- Planos de proyección ---
const LESSON_MODE_NEAR_PLANE  = 12;
const DISTANCE_MODE_NEAR_PLANE = 0.1;
const FAR_PLANE               = 2000;

// --- Suelo ---
const GRASS_SIZE = 1400;
const GROUND_DETAIL = 32;

// --- Camino circular (torus) ---
const PATH_SUNK          = 6;
const PATH_TUBE_RADIUS   = 10;
const PATH_RING_SEGMENTS = 128;
const PATH_TUBE_SEGMENTS = 6;

// --- Bosque ---
const FOREST_COUNT      = 100;
const FOREST_BAND_INNER = [130, 175];
const FOREST_BAND_OUTER = [240, 330];
const TREE_RATIO        = 0.8;
const TREE_H_MIN        = 45;
const TREE_H_MAX        = 90;
const TREE_W_MIN        = 14;
const TREE_W_MAX        = 24;

// --- Proporciones ---
const TREE_TRUNK_HEIGHT_RATIO  = 0.25;
const TREE_TRUNK_RADIUS_RATIO  = 0.22;
const TREE_CROWN_HEIGHT_RATIO  = 0.80;
const TREE_CROWN_OVERLAP_RATIO = 0.30;
const TREE_DETAIL              = 8;
const ROCK_SCALE_Y             = 0.7;
const ROCK_EMBED_RATIO         = 0.25;
const ROCK_DETAIL              = 8;
const ROCK_RADIUS_FACTOR       = 0.8;

// --- Colisión al inicializar la escena ---
const COLLISION_MARGIN         = 1;
const MAX_PLACEMENT_ATTEMPTS   = 60;
