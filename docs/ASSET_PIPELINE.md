# Neon River - Asset Pipeline

> Step-by-step workflows for creating all game assets.
> Reference: Concept image v4, Asset Inventory

---

## 1. Overview

### 1.1 File Formats

| Asset Type | Format                     | Why                                    |
| ---------- | -------------------------- | -------------------------------------- |
| 3D Models  | `.glb`                     | Binary GLTF, compact, Three.js native  |
| Textures   | `.png`                     | Lossless, supports transparency        |
| Skybox     | `.png` (6 faces) or `.hdr` | Cubemap or equirectangular             |
| Audio      | `.mp3` + `.ogg`            | MP3 for compatibility, OGG for quality |
| Fonts      | `.woff2`                   | Web-optimized                          |

### 1.2 Naming Conventions

```
Models:     {name}.glb              → fisherman.glb, bluegill.glb
Textures:   {name}_{type}.png       → stone_diffuse.png, stone_normal.png
Audio:      {category}_{name}.mp3   → sfx_catch.mp3, amb_night.mp3
```

### 1.3 Target Specifications

| Spec               | Target               | Notes                  |
| ------------------ | -------------------- | ---------------------- |
| Model polycount    | <5,000 tris each     | Low-poly stylized look |
| Texture resolution | 512x512 to 1024x1024 | Power of 2             |
| Audio bitrate      | 128-192 kbps         | Balance quality/size   |
| Total asset size   | <50 MB               | Fast web loading       |

---

## 2. Creation Order (Dependencies)

Build assets in this order to avoid rework:

```
Phase 1: Foundations
├── Skybox (sets lighting reference)
├── Water plane (gameplay surface)
└── Stone bridge (camera framing reference)

Phase 2: Environment Shell
├── Riverbanks (left + right)
├── Hills/terrain (midground)
└── City skyline texture (background)

Phase 3: Vegetation
├── Trees (3-4 variants)
├── Reeds/cattails
├── Shrubs (2-3 variants)
└── Flowers (2-3 colors)

Phase 4: Character & Props
├── Fisherman (seated pose)
├── Fishing net (with cyber hinge)
└── Lantern

Phase 5: Game Entities
├── Bluegill (model + rig + animation)
├── Golden Koi (model + rig + animation)
└── Electric Eel (model + rig + animation)

Phase 6: Effects & Polish
├── Water shader
├── Firefly particles
├── Fish glow effect
└── Eel spark effect

Phase 7: Audio
├── Ambient layers
└── Sound effects

Phase 8: UI
├── HUD elements
├── Menus
└── Fonts
```

---

## 3. Tool Workflows

### 3.1 AI-Generated 3D Models (Meshy.ai)

**Best for**: Fisherman, fish, trees, shrubs, rocks, lantern

**Workflow**:

1. **Generate**
   - Go to [meshy.ai](https://www.meshy.ai/)
   - Select "Text to 3D"
   - Write detailed prompt (see prompts below)
   - Choose "Stylized" art style
   - Generate and wait ~2-4 minutes

2. **Review & Refine**
   - Check topology (no major holes/artifacts)
   - Refine if needed using Meshy's tools
   - Generate a few variants, pick best

3. **Export**
   - Download as `.glb` format
   - Note the polycount

4. **Clean Up (Blender)**
   - Import GLB into Blender
   - Check scale (normalize to ~1 unit)
   - Remove unnecessary geometry
   - Fix any mesh issues
   - Re-export as `.glb`

**Example Prompts**:

```
Fisherman:
"Seated Japanese fisherman wearing dark simple robes and large straw kasa hat,
seen from behind, peaceful pose, stylized low-poly game character,
Studio Ghibli inspired, no fishing rod"

Bluegill Fish:
"Bluegill sunfish, dark blue-green scales, stylized low-poly game asset,
simple geometry, cute proportions, side view, ready for animation"

Golden Koi:
"Japanese koi fish, bright orange and gold scales, stylized low-poly,
elegant flowing fins, game asset, metallic sheen"

Electric Eel:
"Electric eel, long dark body, stylized low-poly game asset,
subtle glowing blue patterns along body, menacing but simple design"

Tree (rounded):
"Rounded canopy tree, stylized Ghibli style, lush green foliage,
thick trunk, low-poly game asset, cozy fairytale aesthetic"

Paper Lantern:
"Traditional Japanese paper lantern, warm orange glow, wooden frame,
simple low-poly game prop, Edo period style"
```

---

### 3.2 Bone Rigging & Animation (Blender)

**For**: Bluegill, Golden Koi, Electric Eel

**Workflow**:

1. **Import Model**
   - Open Blender, import `.glb` from Meshy
   - Check mesh is clean (no overlapping verts)

2. **Create Armature**
   - Fish need simple spine rig: 4-6 bones
   - Head → Spine1 → Spine2 → Spine3 → Tail
   - Add optional fin bones if fins are separate mesh

3. **Weight Paint**
   - Parent mesh to armature (automatic weights)
   - Refine weight painting for smooth deformation
   - Test by rotating bones

4. **Create Swim Cycle**
   - 30-60 frames loop
   - Subtle S-curve wave through spine
   - Tail has most movement
   - Head stays relatively stable
   - Fins gently oscillate

5. **Export**
   - Select mesh + armature
   - Export as `.glb` with animations included
   - Name animation "swim" for code reference

**Eel Special Case**:

- More bones (8-10) for longer S-curve
- More exaggerated wave motion
- Slightly slower, more menacing

---

### 3.3 Texture Creation (Stable Diffusion / AI)

**Best for**: Stone, grass, bark, city skyline

**Workflow**:

1. **Generate Base Texture**
   - Use Stable Diffusion or Leonardo.ai
   - Prompt for seamless/tiling textures
   - Generate at 1024x1024

2. **Make Seamless (if needed)**
   - Use GIMP/Photoshop offset filter
   - Or Materialize tool (free)
   - Blend seams

3. **Generate Normal Map**
   - Use free tool: NormalMap-Online or Materialize
   - Adjust strength for desired depth

4. **Export**
   - Save as `.png`
   - Name: `{asset}_diffuse.png`, `{asset}_normal.png`

**Example Prompts**:

```
Stone Bridge:
"Mossy ancient stone texture, weathered grey stone blocks,
green moss in cracks, seamless tiling texture, top-down view,
game asset texture, 1024x1024"

City Skyline:
"Cyberpunk city skyline at night, panoramic view,
purple and teal neon lights, tall skyscrapers with glowing windows,
holographic billboards, dark sky, stylized digital painting,
wide aspect ratio for background panorama"
```

---

### 3.4 Skybox Creation

**Workflow**:

1. **Option A: AI-Generated Equirectangular**
   - Generate night sky panorama with AI
   - Prompt: "Night sky equirectangular panorama, stars, large moon, dark blue gradient, seamless 360"
   - Convert to cubemap using [360toolkit.co](https://360toolkit.co/convert-spherical-equirectangular-to-cubemap)

2. **Option B: Assemble from Parts**
   - Generate moon texture separately
   - Generate star field
   - Composite in image editor
   - Export 6 faces: `px.png, nx.png, py.png, ny.png, pz.png, nz.png`

3. **Three.js Loading**
   - Use `CubeTextureLoader` for 6-face cubemap
   - Or `RGBELoader` for HDR equirectangular

---

### 3.5 Audio Creation

**Ambient Layers** (combine these):

| Layer    | Source        | Notes                           |
| -------- | ------------- | ------------------------------- |
| Crickets | Freesound.org | Night cricket loop              |
| Water    | Freesound.org | Gentle stream/brook             |
| City Hum | Freesound.org | Distant city ambience, very low |
| Wind     | Freesound.org | Optional, very subtle           |

**Workflow**:

1. **Find Sources**
   - Search Freesound.org for Creative Commons audio
   - Download high quality versions
   - Note attribution requirements

2. **Edit & Layer (Audacity)**
   - Import all layers
   - Adjust volumes (crickets loudest, city quietest)
   - Normalize levels
   - Create seamless loop (2-3 minutes)
   - Export as `amb_night.mp3` and `amb_night.ogg`

3. **Sound Effects**
   - Find or create short SFX
   - Trim to exact length needed
   - Export individually

**SFX Sources**:

| SFX        | Search Terms                                   |
| ---------- | ---------------------------------------------- |
| Fish catch | "splash small", "net swoosh", "positive chime" |
| Fish miss  | "water plop", "splash tiny"                    |
| Eel shock  | "electric zap", "electricity arc"              |
| Win jingle | "success fanfare short", "victory chime"       |
| Lose sting | "game over dramatic", "failure sound"          |

---

### 3.6 Procedural/Code-Based Assets

**Water Shader** (Three.js):

- Start with Three.js `Water` example
- Customize colors for night scene
- Add ripple effect on fish catch

**Firefly Particles** (Three.js):

- Use `Points` or `Sprite` system
- Random positions in defined volume
- Slow drift movement
- Fade in/out glow

**Fish Glow**:

- Emissive material property
- Or point light attached to fish
- Subtle, not overwhelming

---

## 4. Quality Checkpoints

### 4.1 Before Exporting Any Model

- [ ] Polycount under 5,000 tris
- [ ] No holes or inverted normals
- [ ] Clean UV unwrap (no overlapping)
- [ ] Correct scale (1 unit ≈ 1 meter)
- [ ] Origin point makes sense (center/base)

### 4.2 Before Exporting Rigged Model

- [ ] All bones named clearly
- [ ] Weight painting smooth, no stray verts
- [ ] Animation loops seamlessly
- [ ] No mesh clipping during animation

### 4.3 Before Exporting Texture

- [ ] Power of 2 dimensions (512, 1024, 2048)
- [ ] Seamless/tileable if needed
- [ ] File size reasonable (<1MB per texture)
- [ ] Correct color space (sRGB for diffuse, Linear for normal)

### 4.4 Before Exporting Audio

- [ ] Loops seamlessly (for ambient)
- [ ] No clipping/distortion
- [ ] Appropriate length
- [ ] Both .mp3 and .ogg versions

---

## 5. Asset Folder Structure

```
public/
├── models/
│   ├── characters/
│   │   └── fisherman.glb
│   ├── props/
│   │   ├── net.glb
│   │   └── lantern.glb
│   ├── environment/
│   │   ├── bridge.glb
│   │   ├── tree_round_01.glb
│   │   ├── tree_round_02.glb
│   │   ├── shrub_01.glb
│   │   ├── reeds.glb
│   │   ├── rocks_01.glb
│   │   └── flowers.glb
│   └── entities/
│       ├── bluegill.glb
│       ├── golden_koi.glb
│       └── electric_eel.glb
├── textures/
│   ├── environment/
│   │   ├── stone_diffuse.png
│   │   ├── stone_normal.png
│   │   ├── grass_diffuse.png
│   │   └── city_skyline.png
│   └── skybox/
│       ├── px.png
│       ├── nx.png
│       ├── py.png
│       ├── ny.png
│       ├── pz.png
│       └── nz.png
└── audio/
    ├── ambient/
    │   └── amb_night.mp3
    └── sfx/
        ├── sfx_catch.mp3
        ├── sfx_miss.mp3
        ├── sfx_shock.mp3
        ├── sfx_win.mp3
        └── sfx_lose.mp3
```

---

## 6. Estimated Time Per Asset

| Asset Type             | Time Estimate  | Notes                     |
| ---------------------- | -------------- | ------------------------- |
| AI model + cleanup     | 30-60 min each | Including Blender cleanup |
| Rigged + animated fish | 2-3 hours each | Rigging takes practice    |
| Texture generation     | 15-30 min each | Including seamless fix    |
| Skybox                 | 1-2 hours      | Depends on approach       |
| Ambient audio          | 1-2 hours      | Finding + mixing layers   |
| SFX                    | 30 min total   | Quick edits               |
| Water shader           | 2-4 hours      | Iteration required        |
| Firefly particles      | 1-2 hours      | Tuning look/feel          |

**Total Estimated Asset Time**: 25-40 hours

---

## 7. Tools Checklist

Install/access these before starting:

- [ ] [Meshy.ai](https://www.meshy.ai/) account (free tier)
- [ ] [Blender](https://www.blender.org/) 4.0+ installed
- [ ] Image editor (GIMP, Photoshop, or Photopea.com)
- [ ] [Audacity](https://www.audacityteam.org/) for audio editing
- [ ] [Freesound.org](https://freesound.org/) account
- [ ] Optional: Stable Diffusion (local or via Leonardo.ai)

---

_Document created for Neon River planning phase._
_Follow Phase order for best results._
