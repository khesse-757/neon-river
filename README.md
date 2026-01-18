# Neon River 🎣

A pixel art arcade fishing game inspired by Jak & Daxter. Catch fish to reach 200 lbs while avoiding electric eels!

```
    ╭──────────────────────────────────────╮
    │  🌙                    🏙️ ░░░░       │
    │       ·  ·    ·                      │
    │    🌳      🌳       🌳    🌳        │
    │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
    │  ░░░░░░ 🐟 ░░░░░░░░░ 🐠 ░░░░░░░░░   │
    │  ░░░░░░░░░░░░░░ ⚡ ░░░░░░░░░░░░░░   │
    │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
    │        🏮  👤  🥅                    │
    ╰──────────────────────────────────────╯
```

## Play

**[Play Online](#)** _(coming soon)_

## Game Rules

| Condition             | Outcome       |
| --------------------- | ------------- |
| Catch 200 lbs of fish | **WIN**       |
| Let 20 lbs escape     | **LOSE**      |
| Catch 1 Electric Eel  | **GAME OVER** |

### Entities

| Entity          | Weight | Behavior     |
| --------------- | ------ | ------------ |
| 🐟 Bluegill     | 1 lb   | Medium speed |
| 🐠 Golden Koi   | 5 lbs  | Fast, rare   |
| ⚡ Electric Eel | —      | Deadly!      |

## Development

### Quick Start

```bash
git clone https://github.com/khesse-757/neon-river.git
cd neon-river
npm install
npm run dev
```

Open http://localhost:5173

### Scripts

| Script              | Description             |
| ------------------- | ----------------------- |
| `npm run dev`       | Start dev server        |
| `npm run build`     | Production build        |
| `npm run test`      | Run tests (watch)       |
| `npm run check`     | Lint + typecheck + test |
| `./bump-version.sh` | Bump version            |

### Project Structure

```
src/
├── assets/           # 🎨 All visual assets
│   ├── sprites/      # Sprite definitions (easy to edit!)
│   ├── backgrounds/  # Background layers
│   └── palettes/     # Color palettes
├── game/             # Game logic
├── entities/         # Fish, eel, net
├── scene/            # Layer management
└── utils/            # Constants, helpers
```

See **CLAUDE.md** for full documentation.

## Tech Stack

- TypeScript
- Vite
- Canvas API
- Vitest

## License

MIT

---

Made with 🎣 by khesse-757
