# CLAUDE.md - Neon River

> A pixel art arcade fishing game inspired by Jak & Daxter.
> Catch fish to reach 200 lbs while avoiding electric eels.

---

## Quick Reference

```bash
npm install            # Install dependencies
npm run dev            # Start dev server (http://localhost:5173)
npm run build          # Production build
npm run preview        # Preview production build
npm run test           # Run tests (watch mode)
npm run test:run       # Run tests once
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run typecheck      # TypeScript check
npm run check          # Run all checks (pre-commit)
./bump-version.sh      # Interactive version bump
```

---

## Project Vision

### The Scene

- **Camera**: Fixed, behind and above a seated fisherman, angled ~45° down
- **Foreground**: Stone bridge edge, seated fisherman with straw hat, cyber-hinged net, paper lantern
- **Midground**: Creek water (main play area), fish swimming, reeds, cattails
- **Background**: Rolling hills, Ghibli-style trees, distant cyberpunk city skyline
- **Sky**: Night sky with large moon, stars, fireflies
- **Mood**: Moonlit, peaceful yet mysterious. Edo Japan meets Studio Ghibli meets Blade Runner.

### Visual Style

- **Pixel art** (16-bit aesthetic)
- Dark, moody color palette with neon accents
- **Static background image** with dynamic fish/net overlay
- Smooth sprite animations

### Reference

- Background image: `public/images/background.png` (768x1376)
- Concept art: `src/assets/concept.png`

---

## Game Rules

| Rule                  | Value                                         |
| --------------------- | --------------------------------------------- |
| **Win condition**     | Catch 200 lbs of fish                         |
| **Lose condition 1**  | Let 20 lbs of fish escape                     |
| **Lose condition 2**  | Catch 1 Electric Eel (instant game over)      |
| **Bluegill weight**   | 1 lb (fixed)                                  |
| **Golden Koi weight** | 5 lbs (fixed)                                 |
| **Difficulty**        | Spawn rate increases over time                |
| **Controls**          | Net moves left/right only (mouse X / touch X) |

---

## Tech Stack

| Tool        | Purpose                | Version |
| ----------- | ---------------------- | ------- |
| TypeScript  | Language (strict mode) | ^5.7    |
| Vite        | Build tool             | ^6.0    |
| Vitest      | Testing                | ^2.1    |
| ESLint      | Linting (flat config)  | ^9.0    |
| Prettier    | Formatting             | ^3.4    |
| Husky       | Git hooks              | ^9.1    |
| lint-staged | Pre-commit checks      | ^15.2   |
| Canvas API  | 2D rendering           | Native  |

---

## Architecture

### Rendering Approach

The game uses a **static background image** with dynamic elements rendered on top:

1. **Background Image** (`public/images/background.png`)
   - Pre-rendered 768x1376 pixel art scene
   - Contains: sky, moon, city, hills, water, bridge, fisherman
   - Loaded once, drawn every frame as base layer

2. **Dynamic Elements** (rendered on top)
   - Fish entities (follow river bezier path)
   - Electric eels (follow river with S-curve slither)
   - Player-controlled net
   - HUD text

3. **River Path System**
   - Fish swim along a cubic bezier curve that follows the river in the background
   - Path defined by control points in `constants.ts`
   - `pathT` parameter (0-1) tracks position along river
   - Fish spawn at t=0 (between hills), exit at t=1 (catch zone)

### Render Order

```
1. BackgroundImage (static scene)
2. Fish/Eels (swimming in river)
3. Net (player controlled)
4. HUD (score display)
```

---

## Project Structure

```
neon-river/
├── public/
│   ├── images/
│   │   └── background.png         # Static background (768x1376)
│   └── audio/                     # Audio files (future)
│
├── src/
│   ├── main.ts                    # Entry point, game loop
│   │
│   ├── assets/
│   │   ├── sprites/               # Sprite definitions
│   │   │   ├── index.ts           # Export all sprites
│   │   │   ├── bluegill.ts        # Bluegill fish sprite
│   │   │   ├── goldenKoi.ts       # Golden Koi sprite
│   │   │   ├── electricEel.ts     # Electric Eel sprite
│   │   │   └── net.ts             # Net sprite
│   │   └── concept.png            # Concept art reference
│   │
│   ├── entities/                  # Game entities
│   │   ├── Bluegill.ts            # Bluegill fish (1 lb)
│   │   ├── GoldenKoi.ts           # Golden Koi (5 lbs)
│   │   ├── ElectricEel.ts         # Electric Eel hazard
│   │   └── Net.ts                 # Player-controlled net
│   │
│   ├── game/                      # Game logic
│   │   ├── Spawner.ts             # Fish/eel spawning
│   │   └── Collision.ts           # AABB collision detection
│   │
│   ├── scene/
│   │   └── BackgroundImage.ts     # Static background loader
│   │
│   ├── input/
│   │   └── InputManager.ts        # Mouse/touch input
│   │
│   ├── renderer/
│   │   └── SpriteRenderer.ts      # Sprite drawing utilities
│   │
│   └── utils/
│       ├── constants.ts           # Game balance + river path
│       ├── riverPath.ts           # Bezier curve utilities
│       └── types.ts               # TypeScript interfaces
│
├── tests/                         # Test files
│   ├── game/
│   │   ├── Spawner.test.ts
│   │   └── Collision.test.ts
│   └── utils/
│       └── helpers.test.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── CLAUDE.md                      # This file
```

---

## Constants Reference

```typescript
// src/utils/constants.ts

// Canvas dimensions (match background image)
export const GAME_WIDTH = 768;
export const GAME_HEIGHT = 1376;

// Game rules
export const WIN_WEIGHT = 200;
export const MAX_MISSED_WEIGHT = 20;

// Entity weights
export const BLUEGILL_WEIGHT = 1;
export const GOLDEN_KOI_WEIGHT = 5;

// Spawn settings
export const INITIAL_SPAWN_INTERVAL = 2.0; // seconds
export const MIN_SPAWN_INTERVAL = 0.5;
export const SPAWN_ACCELERATION = 0.98;

// Spawn probabilities (must sum to 1)
export const SPAWN_WEIGHTS = {
  BLUEGILL: 0.7,
  GOLDEN_KOI: 0.2,
  ELECTRIC_EEL: 0.1,
};

// Entity speeds (path units per second, where 1.0 = full river path)
export const SPEEDS = {
  BLUEGILL: 0.12, // ~8 seconds to traverse river
  GOLDEN_KOI: 0.18, // ~5.5 seconds
  ELECTRIC_EEL: 0.08, // ~12 seconds
};

// River path (cubic bezier control points)
export const RIVER_PATH = {
  start: { x: GAME_WIDTH * 0.52, y: GAME_HEIGHT * 0.18 }, // Spawn
  cp1: { x: GAME_WIDTH * 0.6, y: GAME_HEIGHT * 0.32 }, // Curves right
  cp2: { x: GAME_WIDTH * 0.4, y: GAME_HEIGHT * 0.55 }, // Curves left
  end: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.78 }, // Catch zone
};

// River width (perspective widening)
export const RIVER_WIDTH_START = GAME_WIDTH * 0.1; // ~77px at spawn
export const RIVER_WIDTH_END = GAME_WIDTH * 0.45; // ~346px at catch zone

// Net settings
export const NET_Y = GAME_HEIGHT * 0.75;
export const NET_MIN_X = GAME_WIDTH * 0.18;
export const NET_MAX_X = GAME_WIDTH * 0.82;
```

---

## River Path System

Fish follow a bezier curve that maps to the river in the background image.

### How It Works

```typescript
// src/utils/riverPath.ts

// Get position on river at t (0 = spawn, 1 = exit)
getRiverPoint(t: number): { x: number; y: number }

// Get river width at t (narrow at top, wide at bottom)
getRiverWidth(t: number): number

// Get random spawn position
getSpawnPosition(): { x, y, pathT, pathOffset }
```

### Fish Movement

Each fish tracks:

- `pathT`: Position along river (0-1), incremented by `speed * delta`
- `pathOffset`: Lateral position within river (-1 to 1)
- `wobblePhase`: Sinusoidal offset for natural swimming

```typescript
update(delta: number): void {
  this.pathT += this.speed * delta;  // Move downstream

  const point = getRiverPoint(this.pathT);
  const width = getRiverWidth(this.pathT);

  // Position = river center + offset + wobble
  this.x = point.x + this.pathOffset * width * 0.4;
  this.y = point.y;
}
```

### Adjusting the River Path

If fish don't align with the river in your background image:

1. Open `src/utils/constants.ts`
2. Adjust `RIVER_PATH` control points (percentages of canvas)
3. Hot reload to see changes
4. Repeat until fish follow the visible river

---

## Development Phases

### Phase 1: Foundation ✅

- [x] Project scaffolding (Vite + TypeScript + ESLint)
- [x] Canvas API rendering
- [x] Game loop with delta time
- [x] Input manager (mouse/touch → normalized X)
- [x] Net moves with input

### Phase 2: Core Gameplay ✅

- [x] Spawner: create fish at river source
- [x] Fish movement: follow river bezier path
- [x] Collision detection: net catches fish
- [x] Score tracking: weight caught/missed
- [x] Win condition: 200 lbs
- [x] Lose condition: miss 20 lbs

### Phase 3: Entities & Difficulty ✅

- [x] Bluegill entity (1 lb, path speed 0.12)
- [x] Golden Koi entity (5 lbs, path speed 0.18)
- [x] Electric Eel entity (S-curve slither, instant death)
- [x] Difficulty curve: spawn rate increases
- [x] Spawn weights: 70% / 20% / 10%

### Phase 4: Scene & Layers ✅

- [x] Static background image (768x1376)
- [x] River path system (bezier curve)
- [x] Responsive canvas scaling
- [x] Proper render order

### Phase 5+: Future Work

- [ ] Polish fish sprites (swim animations)
- [ ] Visual effects (catch ripple, eel spark)
- [ ] Audio (ambient, SFX)
- [ ] UI improvements (menus, pause)
- [ ] Mobile optimization

---

## Common Tasks

### Adjust Fish Speed

Edit `SPEEDS` in `src/utils/constants.ts`:

```typescript
export const SPEEDS = {
  BLUEGILL: 0.12, // Slower = easier to catch
  GOLDEN_KOI: 0.18, // Faster = harder to catch
  ELECTRIC_EEL: 0.08,
};
```

### Adjust River Path

Edit `RIVER_PATH` in `src/utils/constants.ts`:

```typescript
export const RIVER_PATH = {
  start: { x: GAME_WIDTH * 0.52, y: GAME_HEIGHT * 0.18 },
  cp1: { x: GAME_WIDTH * 0.6, y: GAME_HEIGHT * 0.32 },
  cp2: { x: GAME_WIDTH * 0.4, y: GAME_HEIGHT * 0.55 },
  end: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.78 },
};
```

### Replace Background Image

1. Create new image at 768x1376 pixels (or any 9:16 ratio)
2. Replace `public/images/background.png`
3. Update `GAME_WIDTH` and `GAME_HEIGHT` in constants if dimensions changed
4. Adjust `RIVER_PATH` to match the river in your new image

### Add a New Fish Type

1. Create sprite: `src/assets/sprites/newFish.ts`
2. Create entity: `src/entities/NewFish.ts` (copy from Bluegill.ts)
3. Add to spawner: `src/game/Spawner.ts`
4. Add constants: weight, speed, spawn probability

---

## Troubleshooting

### Fish not following river

- Check `RIVER_PATH` control points align with background image
- Verify fish `pathT` is incrementing (check `speed` value)
- Add debug rendering to visualize bezier curve

### Background not loading

- Verify `public/images/background.png` exists
- Check browser console for 404 errors
- Ensure path starts with `/images/` (Vite serves from `public/`)

### Canvas scaling issues

- Canvas internal resolution: 768x1376
- CSS scales to fit viewport while maintaining aspect ratio
- Check `scaleCanvas()` function in `main.ts`

### Build fails

```bash
npm run typecheck  # Check for TypeScript errors
npm run lint       # Check for ESLint errors
```

---

## Resources

- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Bezier Curves](https://javascript.info/bezier-curve)
- [Lospec](https://lospec.com/palette-list) - Pixel art palettes

---

_Last updated: Phase 4 (Scene & Layers)_
_Current version: 0.1.0_
