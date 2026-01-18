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
- Parallax layers for depth
- Smooth sprite animations

### Reference

See `/docs/concept-art/` for reference images.

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

| Tool        | Purpose                 | Version |
| ----------- | ----------------------- | ------- |
| TypeScript  | Language (strict mode)  | ^5.7    |
| Vite        | Build tool              | ^6.0    |
| Vitest      | Testing                 | ^2.1    |
| ESLint      | Linting (flat config)   | ^9.0    |
| Prettier    | Formatting              | ^3.4    |
| Husky       | Git hooks               | ^9.1    |
| lint-staged | Pre-commit checks       | ^15.2   |
| PixiJS      | 2D rendering (optional) | ^8.0    |
| Canvas API  | Alternative to PixiJS   | Native  |

**Note**: We may use PixiJS for rendering or pure Canvas. Decide during Phase 1.

---

## Project Structure

```
neon-river/
├── public/
│   └── audio/                    # Audio files
│       ├── amb_night_crickets.mp3
│       ├── amb_night_water.mp3
│       ├── sfx_catch.mp3
│       ├── sfx_miss.mp3
│       ├── sfx_shock.mp3
│       ├── sfx_win.mp3
│       └── sfx_lose.mp3
│
├── src/
│   ├── main.ts                   # Entry point
│   │
│   ├── assets/                   # 🎨 ALL VISUAL ASSETS HERE
│   │   ├── sprites/              # Sprite definitions
│   │   │   ├── index.ts          # Export all sprites
│   │   │   ├── fisherman.ts      # Fisherman sprite data
│   │   │   ├── net.ts            # Net sprite data
│   │   │   ├── lantern.ts        # Lantern sprite data
│   │   │   ├── bluegill.ts       # Bluegill sprite + animation
│   │   │   ├── goldenKoi.ts      # Golden Koi sprite + animation
│   │   │   ├── electricEel.ts    # Electric Eel sprite + animation
│   │   │   ├── bridge.ts         # Bridge tiles
│   │   │   ├── reeds.ts          # Reeds/cattails
│   │   │   ├── flowers.ts        # Flower sprites
│   │   │   └── trees.ts          # Tree sprites
│   │   │
│   │   ├── backgrounds/          # Background layers
│   │   │   ├── index.ts          # Export all backgrounds
│   │   │   ├── skybox.ts         # Night sky with moon/stars
│   │   │   ├── city.ts           # Cyberpunk city skyline
│   │   │   ├── hills.ts          # Rolling hills layer
│   │   │   └── water.ts          # Water surface pattern
│   │   │
│   │   ├── palettes/             # Color palettes
│   │   │   ├── index.ts          # Export all palettes
│   │   │   ├── night.ts          # Main night palette
│   │   │   ├── fish.ts           # Fish color palettes
│   │   │   └── neon.ts           # Cyberpunk neon colors
│   │   │
│   │   └── fonts/                # Pixel fonts (if needed)
│   │       └── terminal.ts       # Monospace pixel font
│   │
│   ├── game/                     # Game logic
│   │   ├── Game.ts               # Main game loop & state
│   │   ├── Spawner.ts            # Fish/eel spawning logic
│   │   ├── Collision.ts          # Collision detection
│   │   └── Difficulty.ts         # Difficulty curve
│   │
│   ├── entities/                 # Game entities
│   │   ├── Entity.ts             # Base entity interface
│   │   ├── Net.ts                # Player-controlled net
│   │   ├── Bluegill.ts           # Bluegill fish
│   │   ├── GoldenKoi.ts          # Golden Koi fish
│   │   └── ElectricEel.ts        # Electric Eel hazard
│   │
│   ├── scene/                    # Scene layers
│   │   ├── Scene.ts              # Scene manager
│   │   ├── BackgroundLayer.ts    # Parallax background
│   │   ├── WaterLayer.ts         # Water surface + effects
│   │   ├── EntityLayer.ts        # Fish, eel, net
│   │   └── ForegroundLayer.ts    # Bridge, fisherman, lantern
│   │
│   ├── effects/                  # Visual effects
│   │   ├── Fireflies.ts          # Firefly particles
│   │   ├── Ripple.ts             # Water ripple on catch
│   │   └── Spark.ts              # Eel electric spark
│   │
│   ├── audio/                    # Audio management
│   │   └── AudioManager.ts       # Load & play sounds
│   │
│   ├── input/                    # Input handling
│   │   └── InputManager.ts       # Mouse/touch unified input
│   │
│   ├── ui/                       # User interface
│   │   ├── HUD.ts                # Weight caught/missed display
│   │   ├── Menu.ts               # Main menu
│   │   ├── GameOver.ts           # Game over screen
│   │   └── WinScreen.ts          # Victory screen
│   │
│   ├── renderer/                 # Rendering
│   │   ├── Renderer.ts           # Main renderer (Canvas or PixiJS)
│   │   ├── SpriteRenderer.ts     # Sprite drawing utilities
│   │   └── AnimationPlayer.ts    # Sprite animation handler
│   │
│   └── utils/                    # Utilities
│       ├── constants.ts          # Game balance values
│       ├── helpers.ts            # Utility functions
│       └── types.ts              # Shared TypeScript types
│
├── tests/                        # Test files (mirrors src/)
│   ├── game/
│   │   ├── Spawner.test.ts
│   │   ├── Collision.test.ts
│   │   └── Difficulty.test.ts
│   └── utils/
│       └── helpers.test.ts
│
├── docs/                         # Documentation
│   ├── concept-art/              # Reference images
│   ├── ASSET_INVENTORY.md        # Full asset list
│   └── ASSET_PIPELINE.md         # How to create assets
│
├── .github/workflows/            # CI/CD
│   ├── ci.yml                    # Lint, typecheck, test
│   └── deploy.yml                # Deploy to GitHub Pages
│
├── .husky/
│   └── pre-commit                # Pre-commit hook
│
├── index.html                    # Entry HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .prettierrc
├── .gitignore
├── VERSION
├── bump-version.sh
├── README.md
└── CLAUDE.md                     # This file
```

---

## Asset System

### Sprite Data Format

All sprites are defined as TypeScript files for easy editing:

```typescript
// src/assets/sprites/bluegill.ts
import type { SpriteDefinition } from '../types';
import { PALETTES } from '../palettes';

// 0 = transparent, 1+ = palette index
const frames = [
  // Frame 1
  [
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
    // ... more rows
  ],
  // Frame 2
  [
    // ... animation frame
  ],
];

export const BLUEGILL: SpriteDefinition = {
  name: 'bluegill',
  width: 16,
  height: 12,
  frames,
  palette: PALETTES.FISH_BLUE,
  animation: {
    frameRate: 4, // frames per second
    loop: true,
  },
};
```

### Palette Format

```typescript
// src/assets/palettes/fish.ts
export const FISH_BLUE = {
  0: 'transparent',
  1: '#1a1a2e', // outline
  2: '#1e3a5f', // dark blue
  3: '#3366aa', // mid blue
  4: '#5588cc', // light blue
  5: '#8faabe', // belly
  6: '#ffffff', // eye
  7: '#4a90a0', // fin accent
};
```

### Why This Format?

1. **Easy to edit**: Change a number, change a pixel
2. **Version controlled**: Diffs show exactly what changed
3. **No external tools needed**: Edit in any text editor
4. **Type safe**: TypeScript catches errors
5. **Fast iteration**: Hot reload sees changes instantly

### Updating Assets

To modify a sprite:

1. Open the sprite file in `src/assets/sprites/`
2. Edit the pixel array (0 = transparent, 1+ = palette colors)
3. Save - hot reload shows changes immediately

To add a new sprite:

1. Create new file in `src/assets/sprites/`
2. Define the sprite data following the format above
3. Export from `src/assets/sprites/index.ts`
4. Import where needed

---

## Development Phases

### Phase 1: Foundation (Week 1)

**Goal**: Rendering works, something moves on screen

- [ ] Project scaffolding (Vite + TypeScript + ESLint)
- [ ] Decide: PixiJS vs Canvas API (prototype both)
- [ ] Basic renderer that draws a sprite
- [ ] Game loop with delta time
- [ ] Input manager (mouse/touch → normalized X position)
- [ ] Draw placeholder net, make it move with input

**Test**: Net follows mouse/touch smoothly

---

### Phase 2: Core Gameplay (Week 2)

**Goal**: Playable prototype with programmer art

- [ ] Spawner: create fish at top of screen
- [ ] Fish movement: swim downward
- [ ] Collision detection: net catches fish
- [ ] Score tracking: weight caught, weight missed
- [ ] Win condition: reach 200 lbs
- [ ] Lose condition: miss 20 lbs

**Test**: Can play full game loop with placeholder sprites

---

### Phase 3: Entities & Difficulty (Week 3)

**Goal**: All fish types, increasing challenge

- [ ] Bluegill entity (1 lb, medium speed)
- [ ] Golden Koi entity (5 lbs, fast, rare)
- [ ] Electric Eel entity (S-curve, instant death)
- [ ] Difficulty curve: spawn rate increases
- [ ] Spawn weights: probability distribution

**Test**: Game feels challenging but fair

---

### Phase 4: Scene & Layers (Week 4)

**Goal**: Full visual scene with parallax

- [ ] Background layer: sky, moon, stars
- [ ] City skyline layer (subtle parallax)
- [ ] Hills layer (slight parallax)
- [ ] Water layer (main play area)
- [ ] Foreground layer: bridge, fisherman, lantern
- [ ] Layer ordering and rendering

**Test**: Scene looks like concept art

---

### Phase 5: Polish Sprites (Week 5)

**Goal**: Final pixel art for all elements

- [ ] Fisherman sprite (seated, detailed)
- [ ] Net sprite (cyber hinge detail)
- [ ] Lantern sprite (warm glow)
- [ ] Bluegill sprite (swim animation)
- [ ] Golden Koi sprite (swim animation)
- [ ] Electric Eel sprite (slither animation, sparks)
- [ ] Bridge tiles
- [ ] Reeds, flowers, trees
- [ ] City skyline

**Test**: Visuals are cohesive and polished

---

### Phase 6: Effects (Week 6)

**Goal**: Juice and feedback

- [ ] Firefly particles (floating, glowing)
- [ ] Water ripple on fish catch
- [ ] Eel electric spark effect
- [ ] Screen flash on eel catch
- [ ] Net "bounce" animation on catch
- [ ] Fish glow (subtle bioluminescence)
- [ ] Lantern flicker

**Test**: Catching fish feels satisfying

---

### Phase 7: Audio (Week 7)

**Goal**: Immersive soundscape

- [ ] Ambient: crickets (loop)
- [ ] Ambient: water (loop)
- [ ] Ambient: distant city hum (loop)
- [ ] SFX: fish catch (splash + chime)
- [ ] SFX: fish miss (subtle splash)
- [ ] SFX: eel shock (electric zap)
- [ ] SFX: win jingle
- [ ] SFX: lose sting
- [ ] Audio manager with volume control

**Test**: Close eyes, game sounds peaceful/immersive

---

### Phase 8: UI & Menus (Week 8)

**Goal**: Complete user experience

- [ ] HUD: weight caught display
- [ ] HUD: weight missed display (with warning state)
- [ ] Main menu: title, start button
- [ ] Pause functionality
- [ ] Game over screen: stats, retry button
- [ ] Win screen: celebration, play again
- [ ] Settings: volume controls

**Test**: Full user flow from menu to game to end

---

### Phase 9: Mobile & Performance (Week 9)

**Goal**: Smooth on all devices

- [ ] Touch input testing
- [ ] Responsive canvas sizing
- [ ] Performance profiling
- [ ] Optimize sprite batching
- [ ] Test on actual mobile devices
- [ ] PWA setup (optional)

**Test**: 60fps on desktop, 30fps+ on mobile

---

### Phase 10: Final Polish & Deploy (Week 10)

**Goal**: Ship it!

- [ ] Bug fixes from playtesting
- [ ] Final balance tweaks
- [ ] README documentation
- [ ] GitHub Pages deployment
- [ ] Custom domain (optional)
- [ ] Social preview image

**Test**: Friends can play via link, no issues

---

## Development Workflow

### Starting a Session

```bash
cd neon-river
npm run dev
# Open http://localhost:5173
```

### Making Changes

1. Edit code
2. Save - hot reload updates browser
3. Test manually
4. Write/update tests if needed

### Before Committing

Pre-commit hook runs automatically:

```bash
npm run lint      # ESLint
npm run typecheck # TypeScript
npm run test:run  # Vitest
```

If any fail, commit is blocked. Fix issues first.

### Committing

```bash
git add .
git commit -m "feat: add bluegill swim animation"
```

**Commit message prefixes**:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructure
- `style:` - Formatting only
- `test:` - Add/update tests
- `docs:` - Documentation
- `chore:` - Maintenance

### Version Bumping

Before releases or milestones:

```bash
./bump-version.sh
# Select: 1) Patch  2) Minor  3) Major
```

Then commit the version change:

```bash
git add VERSION package.json
git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
git push origin main --tags
```

---

## Code Guidelines

### File Size

- **Target**: <150 lines per file
- **Max**: 200 lines
- Split if larger

### Naming

| Type             | Convention      | Example            |
| ---------------- | --------------- | ------------------ |
| Files (classes)  | PascalCase      | `GoldenKoi.ts`     |
| Files (utils)    | camelCase       | `helpers.ts`       |
| Classes          | PascalCase      | `class Spawner`    |
| Functions        | camelCase       | `spawnFish()`      |
| Constants        | SCREAMING_SNAKE | `MAX_WEIGHT`       |
| Types/Interfaces | PascalCase      | `interface Entity` |

### Sprite Data

- Use descriptive comments for complex sprites
- Group related frames together
- Keep palette references at top of file

### Game Logic

```typescript
// Good: Pure function, testable
function checkCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Good: Clear state management
class Game {
  private state: 'menu' | 'playing' | 'paused' | 'gameover' | 'win' = 'menu';

  setState(newState: GameState): void {
    this.state = newState;
    this.onStateChange(newState);
  }
}
```

---

## Testing Strategy

### What to Test

| Category            | Test?  | Why                      |
| ------------------- | ------ | ------------------------ |
| Collision detection | ✅ Yes | Core mechanic, pure math |
| Spawner logic       | ✅ Yes | Timing, probabilities    |
| Difficulty curve    | ✅ Yes | Balance verification     |
| Score calculations  | ✅ Yes | Win/lose conditions      |
| Input normalization | ✅ Yes | Edge cases               |
| Rendering           | ❌ No  | Visual verification      |
| Animations          | ❌ No  | Visual verification      |

### Test Location

Tests mirror source structure:

```
src/game/Spawner.ts      → tests/game/Spawner.test.ts
src/utils/helpers.ts     → tests/utils/helpers.test.ts
```

### Running Tests

```bash
npm run test        # Watch mode (during development)
npm run test:run    # Single run (CI/pre-commit)
```

---

## Constants Reference

```typescript
// src/utils/constants.ts

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

// Entity speeds (pixels per second at base)
export const SPEEDS = {
  BLUEGILL: 60,
  GOLDEN_KOI: 100,
  ELECTRIC_EEL: 40,
};

// Canvas
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;
export const PIXEL_SCALE = 2; // Render at 2x for crisp pixels
```

---

## Asset Checklist

### Sprites (src/assets/sprites/)

**Characters & Props**

- [ ] `fisherman.ts` - Seated fisherman, straw hat (static)
- [ ] `net.ts` - Cyber-hinged net (idle + catch animation)
- [ ] `lantern.ts` - Paper lantern (flicker animation)

**Entities**

- [ ] `bluegill.ts` - Bluegill fish (2-4 frame swim)
- [ ] `goldenKoi.ts` - Golden Koi (2-4 frame swim)
- [ ] `electricEel.ts` - Electric Eel (slither + spark)

**Environment**

- [ ] `bridge.ts` - Stone bridge tiles
- [ ] `reeds.ts` - Cattails/reeds (sway animation optional)
- [ ] `flowers.ts` - 2-3 color variants
- [ ] `trees.ts` - 2-3 tree variants

### Backgrounds (src/assets/backgrounds/)

- [ ] `skybox.ts` - Night sky, moon, stars
- [ ] `city.ts` - Cyberpunk skyline silhouette
- [ ] `hills.ts` - Rolling hills layer
- [ ] `water.ts` - Water surface pattern/tiles

### Palettes (src/assets/palettes/)

- [ ] `night.ts` - Main scene colors
- [ ] `fish.ts` - Bluegill, Koi palettes
- [ ] `neon.ts` - City glow, eel spark colors

### Audio (public/audio/)

**Ambient**

- [ ] `amb_night_crickets.mp3`
- [ ] `amb_night_water.mp3`
- [ ] `amb_city_hum.mp3` (very subtle)

**SFX**

- [ ] `sfx_catch.mp3`
- [ ] `sfx_miss.mp3`
- [ ] `sfx_shock.mp3`
- [ ] `sfx_win.mp3`
- [ ] `sfx_lose.mp3`

---

## Common Tasks

### Add a New Fish Type

1. Create sprite: `src/assets/sprites/newFish.ts`
2. Add palette if needed: `src/assets/palettes/fish.ts`
3. Export from: `src/assets/sprites/index.ts`
4. Create entity: `src/entities/NewFish.ts`
5. Add to spawner: `src/game/Spawner.ts`
6. Add constants: `src/utils/constants.ts`
7. Test spawn probability

### Adjust Game Balance

1. Open `src/utils/constants.ts`
2. Modify values (weights, speeds, spawn rates)
3. Run tests: `npm run test`
4. Playtest

### Change a Sprite

1. Open sprite file in `src/assets/sprites/`
2. Edit pixel array
3. Save - hot reload shows changes
4. Adjust palette if needed

### Add a Sound Effect

1. Add `.mp3` file to `public/audio/`
2. Register in `src/audio/AudioManager.ts`
3. Call `audioManager.play('sfx_name')` where needed

---

## Troubleshooting

### Sprite not showing

- Check export from `src/assets/sprites/index.ts`
- Verify palette colors aren't all transparent
- Check render layer order

### Animation not playing

- Verify `animation.loop` is true for looping
- Check `frameRate` isn't 0
- Ensure multiple frames exist in `frames` array

### Input feels laggy

- Use `requestAnimationFrame` not `setInterval`
- Check delta time calculation
- Profile with browser dev tools

### Build fails

- Run `npm run typecheck` for TypeScript errors
- Run `npm run lint` for ESLint errors
- Check console for specific error messages

---

## Resources

- [PixiJS Docs](https://pixijs.com/guides)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Freesound.org](https://freesound.org/) - Audio sources
- [Lospec](https://lospec.com/palette-list) - Pixel art palettes

---

_Last updated: Phase 0 (Planning)_
_Current version: 0.1.0_
