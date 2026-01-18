# CLAUDE.md - Neon River

> A pixel art arcade fishing game inspired by Jak and Daxter.
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

- **Camera**: Fixed, behind and above a seated fisherman, angled ~45 degrees down
- **Foreground**: Stone bridge edge, seated fisherman with straw hat, cyber-hinged net, paper lantern
- **Midground**: Creek water (main play area), fish swimming, reeds, cattails
- **Background**: Rolling hills, Ghibli-style trees, distant cyberpunk city skyline
- **Sky**: Night sky with large moon, stars, fireflies
- **Mood**: Moonlit, peaceful yet mysterious. Edo Japan meets Studio Ghibli meets Blade Runner.

### Visual Style

- **Pixel art** (16-bit aesthetic)
- Dark, moody color palette with neon accents
- **Static background image** with dynamic fish/net overlay
- Smooth sprite animations with perspective scaling

### Reference

- Background image: `public/images/neon-river-bg.png`
- Screenshot: `public/images/neon-river.png`

---

## Game Rules

| Rule                  | Value                                            |
| --------------------- | ------------------------------------------------ |
| **Win condition**     | Catch 200 lbs of fish                            |
| **Lose condition 1**  | Let 20 lbs of fish escape                        |
| **Lose condition 2**  | Catch 1 Electric Eel (instant game over)         |
| **Bluegill weight**   | 1 lb (fixed)                                     |
| **Golden Koi weight** | 5 lbs (fixed)                                    |
| **Difficulty**        | Speed and spawn rate increase with caught weight |
| **Controls**          | Net moves left/right only (mouse X / touch X)    |

### Difficulty Tiers

| Caught Weight | Speed | Spawn Rate | Eel Boost |
| ------------- | ----- | ---------- | --------- |
| 0-74 lbs      | 1.0x  | 1.0x       | Normal    |
| 75-124 lbs    | 1.1x  | 1.15x      | +15%      |
| 125-149 lbs   | 1.2x  | 1.3x       | +15%      |
| 150-174 lbs   | 1.3x  | 1.45x      | +15%      |
| 175+ lbs      | 1.4x  | 1.6x       | +15%      |

---

## Tech Stack

| Tool          | Purpose                | Version |
| ------------- | ---------------------- | ------- |
| TypeScript    | Language (strict mode) | ^5.7    |
| Vite          | Build tool             | ^6.0    |
| Vitest        | Testing                | ^2.1    |
| ESLint        | Linting (flat config)  | ^9.0    |
| Prettier      | Formatting             | ^3.4    |
| Husky         | Git hooks              | ^9.1    |
| lint-staged   | Pre-commit checks      | ^15.2   |
| Canvas API    | 2D rendering           | Native  |
| Web Audio API | Low-latency audio      | Native  |

---

## Architecture

### Rendering Approach

The game uses a **static background image** with dynamic elements rendered on top:

1. **Background Image** (`public/images/neon-river-bg.png`)
   - Pre-rendered pixel art scene
   - Contains: sky, moon, city, hills, water, bridge
   - Loaded once, drawn every frame as base layer

2. **Dynamic Elements** (rendered on top in order)
   - Net pole (behind fisherman)
   - Fisherman sprite
   - Net head (player controlled)
   - Fish and Eel entities
   - HUD (weight display)
   - Shock effect
   - UI overlays
   - Pause/Mute buttons

3. **River Path System**
   - Fish swim along a cubic bezier curve
   - Path defined by control points in `constants.ts`
   - `pathT` parameter (0-1) tracks position along river
   - Fish spawn at top, exit at catch zone

### Audio System

Uses Web Audio API for low-latency playback on mobile:

- AudioContext created on first user interaction
- Sounds pre-decoded into AudioBuffer
- BufferSource for instant playback (~5-20ms latency)
- Mute state persisted to localStorage

---

## Project Structure

```
neon-river/
├── public/
│   ├── audio/
│   │   └── water_net.wav           # Catch sound effect
│   ├── images/
│   │   ├── neon-river-bg.png       # Background image
│   │   └── neon-river.png          # Screenshot
│   └── CNAME                       # Custom domain config
│
├── src/
│   ├── main.ts                     # Entry point, game loop, state machine
│   │
│   ├── assets/
│   │   ├── sprites/                # Sprite definitions
│   │   │   ├── index.ts            # Export all sprites
│   │   │   ├── bluegill.ts         # Bluegill fish sprite
│   │   │   ├── goldenKoi.ts        # Golden Koi sprite
│   │   │   ├── electricEel.ts      # Electric Eel sprite
│   │   │   ├── net.ts              # Net sprite
│   │   │   └── fisherman.ts        # Fisherman sprite
│   │   └── palettes/               # Color palettes
│   │       └── fish.ts             # Fish color palettes
│   │
│   ├── entities/                   # Game entities
│   │   ├── Bluegill.ts             # Bluegill fish (1 lb)
│   │   ├── GoldenKoi.ts            # Golden Koi (5 lbs)
│   │   ├── ElectricEel.ts          # Electric Eel hazard with sparks
│   │   └── Net.ts                  # Player-controlled net
│   │
│   ├── game/                       # Game logic
│   │   ├── Spawner.ts              # Wave-based spawning, difficulty
│   │   └── Collision.ts            # AABB collision detection
│   │
│   ├── scene/
│   │   ├── BackgroundImage.ts      # Static background loader
│   │   └── Fisherman.ts            # Fisherman sprite renderer
│   │
│   ├── effects/
│   │   ├── ShockEffect.ts          # Eel shock animation
│   │   └── CatchRipple.ts          # Water ripple on catch
│   │
│   ├── audio/
│   │   └── AudioManager.ts         # Web Audio API manager
│   │
│   ├── input/
│   │   └── InputManager.ts         # Mouse/touch unified input
│   │
│   ├── ui/
│   │   ├── HUD.ts                  # Weight display, pause button
│   │   ├── TitleScreen.ts          # Start screen
│   │   ├── PauseOverlay.ts         # Pause menu
│   │   ├── GameOverScreen.ts       # Death screen with animated eel
│   │   ├── WinScreen.ts            # Victory screen
│   │   └── MuteButton.ts           # Audio toggle button
│   │
│   ├── renderer/
│   │   └── SpriteRenderer.ts       # Sprite drawing utilities
│   │
│   └── utils/
│       ├── constants.ts            # Game balance values
│       ├── riverPath.ts            # Bezier curve utilities
│       └── types.ts                # TypeScript interfaces
│
├── tests/                          # Test files
│   ├── game/
│   │   ├── Spawner.test.ts
│   │   └── Collision.test.ts
│   ├── entities/
│   │   └── RiverPath.test.ts
│   └── utils/
│       └── constants.test.ts
│
├── .github/workflows/
│   ├── ci.yml                      # Lint, typecheck, test
│   └── deploy.yml                  # Deploy to GitHub Pages
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── VERSION
├── bump-version.sh
├── CLAUDE.md                       # This file
├── ARCHITECTURE.md                 # Technical architecture
├── README.md                       # Project readme
└── LICENSE                         # MIT License
```

---

## Constants Reference

```typescript
// src/utils/constants.ts

// Canvas dimensions
export const GAME_WIDTH = 768;
export const GAME_HEIGHT = 1376;

// Game rules
export const WIN_WEIGHT = 200;
export const MAX_MISSED_WEIGHT = 20;

// Entity weights
export const BLUEGILL_WEIGHT = 1;
export const GOLDEN_KOI_WEIGHT = 5;

// Spawn settings
export const INITIAL_SPAWN_INTERVAL = 2.0;
export const MIN_SPAWN_INTERVAL = 0.5;
export const SPAWN_ACCELERATION = 0.98;

// Spawn probabilities (sum to 1)
export const SPAWN_WEIGHTS = {
  BLUEGILL: 0.7,
  GOLDEN_KOI: 0.2,
  ELECTRIC_EEL: 0.1,
};

// Entity speeds (path units per second)
export const SPEEDS = {
  BLUEGILL: 0.12,
  GOLDEN_KOI: 0.18,
  ELECTRIC_EEL: 0.08,
};

// Fish base scale for perspective
export const FISH_BASE_SCALE = 1.8;
```

---

## Development Phases

### Phase 1: Foundation [x]

- [x] Project scaffolding (Vite + TypeScript + ESLint)
- [x] Canvas API rendering
- [x] Game loop with delta time
- [x] Input manager (mouse/touch -> normalized X)
- [x] Net moves with input

### Phase 2: Core Gameplay [x]

- [x] Spawner: create fish at river source
- [x] Fish movement: follow river bezier path
- [x] Collision detection: net catches fish
- [x] Score tracking: weight caught/missed
- [x] Win condition: 200 lbs
- [x] Lose condition: miss 20 lbs

### Phase 3: Entities and Difficulty [x]

- [x] Bluegill entity (1 lb, path speed 0.12)
- [x] Golden Koi entity (5 lbs, path speed 0.18)
- [x] Electric Eel entity (S-curve slither, instant death)
- [x] Difficulty curve: spawn rate increases
- [x] Spawn weights: 70% / 20% / 10%

### Phase 4: Scene and Layers [x]

- [x] Static background image
- [x] River path system (bezier curve)
- [x] Responsive canvas scaling
- [x] Proper render order
- [x] Fisherman sprite

### Phase 5: Polish Sprites [x]

- [x] Net sprite with pole
- [x] Bluegill sprite with animation
- [x] Golden Koi sprite with animation
- [x] Electric Eel sprite with electric sparks
- [x] Perspective scaling for fish

### Phase 6: Effects [x]

- [x] Shock effect on eel contact
- [x] Net wobble on catch
- [x] Electric spark animation on eels

### Phase 7: Audio [x]

- [x] Web Audio API for low-latency playback
- [x] Catch sound effect
- [x] Mute toggle with localStorage persistence
- [x] Mobile audio initialization on user interaction

### Phase 8: UI and Menus [x]

- [x] HUD: weight caught/missed display
- [x] Title screen with instructions
- [x] Pause functionality (button + keyboard)
- [x] Game over screen with stats and animated eel
- [x] Win screen with stats and rating
- [x] Mute button

### Phase 9: Mobile and Performance [x]

- [x] Touch input testing
- [x] Responsive canvas sizing
- [x] Mobile-friendly button placement
- [x] Low-latency audio on mobile

### Phase 10: Final Polish and Deploy [x]

- [x] Progressive difficulty (speed and spawn rate tiers)
- [x] Eel fairness system (cooldown between spawns)
- [x] Wave-based fish spawning
- [x] GitHub Actions CI/CD
- [x] GitHub Pages deployment
- [x] Custom domain setup
- [x] Documentation (README, ARCHITECTURE)

---

## Common Tasks

### Adjust Fish Speed

Edit `SPEEDS` in `src/utils/constants.ts`:

```typescript
export const SPEEDS = {
  BLUEGILL: 0.12, // Slower = easier
  GOLDEN_KOI: 0.18, // Faster = harder
  ELECTRIC_EEL: 0.08,
};
```

### Adjust Difficulty Tiers

Edit `DIFFICULTY_TIERS` in `src/game/Spawner.ts`:

```typescript
const DIFFICULTY_TIERS = [
  { threshold: 75, speedMult: 1.1, spawnMult: 1.15 },
  { threshold: 125, speedMult: 1.2, spawnMult: 1.3 },
  { threshold: 150, speedMult: 1.3, spawnMult: 1.45 },
  { threshold: 175, speedMult: 1.4, spawnMult: 1.6 },
];
```

### Add a New Sound

1. Add audio file to `public/audio/`
2. Register in `AudioManager.ts` loadSounds():
   ```typescript
   await this.loadSound('name', '/audio/filename.wav');
   ```
3. Play with `audioManager.play('name')`

### Replace Background Image

1. Create new image (768x1376 or any 9:16 ratio)
2. Replace `public/images/neon-river-bg.png`
3. Update `BackgroundImage.ts` if path changes
4. Adjust `RIVER_PATH` in constants to match river

---

## Troubleshooting

### Fish not following river

- Check `RIVER_PATH` control points align with background
- Verify fish `pathT` is incrementing (check speed)
- Add debug rendering to visualize bezier curve

### Audio not playing on mobile

- Ensure `audioManager.init()` is called after user tap
- Check that AudioContext is not in "suspended" state
- Verify audio file exists in public/audio/

### Canvas scaling issues

- Canvas internal resolution: 768x1376
- CSS scales to fit viewport
- Check `scaleCanvas()` in main.ts

### Build fails

```bash
npm run typecheck  # TypeScript errors
npm run lint       # ESLint errors
```

---

## Resources

- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Bezier Curves](https://javascript.info/bezier-curve)
- [Lospec](https://lospec.com/palette-list) - Pixel art palettes

---

_Last updated: v1.0.0 (Complete)_
_Current version: 1.0.0_
