# Neon River - Asset Inventory

> Reference: Concept image v4 (seated fisherman, stone bridge, cyber-net, city skyline)

---

## 1. 3D Models

### 1.1 Character & Equipment

| Asset            | Description                              | Complexity | Source Options                           | Priority | Notes                                                 |
| ---------------- | ---------------------------------------- | ---------- | ---------------------------------------- | -------- | ----------------------------------------------------- |
| Fisherman (body) | Seated figure in dark robes, static pose | Medium     | AI (Meshy/Tripo), Mixamo base + modify   | Critical | No animation needed, silhouette matters most          |
| Straw Hat (kasa) | Large traditional Japanese hat           | Low        | AI-generated, or part of fisherman model | Critical | Iconic visual element                                 |
| Fishing Net      | Cyber-hinged net with bamboo/metal frame | Medium     | Hand-model or AI + modify                | Critical | Gameplay element - needs clean geometry for animation |
| Net Handle       | Long pole with glowing cyan hinge joint  | Medium     | Hand-model                               | Critical | Must look good up close, emissive material            |

### 1.2 Environment - Bridge

| Asset         | Description                                 | Complexity | Source Options            | Priority | Notes                       |
| ------------- | ------------------------------------------- | ---------- | ------------------------- | -------- | --------------------------- |
| Stone Bridge  | Flat moss-covered stone slabs, simple shape | Low        | AI-generated, Sketchfab   | Critical | Only bottom portion visible |
| Bridge Stones | Individual stone pieces for detail          | Low        | Procedural or hand-placed | Medium   | Adds realism to bridge edge |

### 1.3 Environment - Water & Banks

| Asset             | Description                   | Complexity | Source Options                        | Priority | Notes                         |
| ----------------- | ----------------------------- | ---------- | ------------------------------------- | -------- | ----------------------------- |
| Water Plane       | Flat plane for water shader   | Low        | Procedural (Three.js)                 | Critical | Shader does the heavy lifting |
| Riverbank (left)  | Sloped terrain with grass     | Low        | Simple geometry + texture             | High     | Frames play area              |
| Riverbank (right) | Sloped terrain with grass     | Low        | Simple geometry + texture             | High     | Frames play area              |
| Reeds/Cattails    | Tall water plants, clustered  | Low        | AI-generated or hand-model, instanced | High     | Multiple clusters needed      |
| Shrubs            | Rounded bushes                | Low        | AI-generated, Sketchfab               | High     | 2-3 variants                  |
| Rocks             | Small/medium rocks along bank | Low        | AI-generated, Sketchfab               | Medium   | 3-4 variants, instanced       |
| Grass Patches     | Clumps of grass               | Low        | Texture planes or simple geo          | Medium   | Optional detail               |

### 1.4 Environment - Midground

| Asset           | Description                         | Complexity | Source Options          | Priority | Notes                           |
| --------------- | ----------------------------------- | ---------- | ----------------------- | -------- | ------------------------------- |
| Hills/Terrain   | Rolling hills, stylized Ghibli look | Medium     | Procedural or sculpted  | High     | Can be simple silhouette shapes |
| Trees (rounded) | Cozy rounded canopy trees           | Medium     | AI-generated, Sketchfab | High     | 3-4 variants needed             |
| Trees (tall)    | Taller background trees             | Low        | AI-generated, Sketchfab | Medium   | Silhouette mostly               |

### 1.5 Environment - Background

| Asset          | Description                   | Complexity | Source Options                        | Priority | Notes                     |
| -------------- | ----------------------------- | ---------- | ------------------------------------- | -------- | ------------------------- |
| City Skyline   | Cyberpunk buildings with neon | Medium     | 2D texture/sprite OR simple 3D blocks | High     | Could be flat billboard   |
| Moon           | Large moon in sky             | Low        | Textured sphere or sprite             | High     | Key lighting/mood element |
| Skybox/Skydome | Night sky with stars          | Low        | Texture (HDRI or painted)             | High     | Sets overall mood         |

### 1.6 Game Entities (Animated)

| Asset         | Description                         | Complexity | Source Options                       | Priority | Notes                        |
| ------------- | ----------------------------------- | ---------- | ------------------------------------ | -------- | ---------------------------- |
| Bluegill Fish | Common river fish, dark blue scales | Medium     | AI-generated + simple swim animation | Critical | Needs swim cycle             |
| Golden Koi    | Large orange/gold koi fish          | Medium     | AI-generated + swim animation        | Critical | Must stand out visually      |
| Electric Eel  | Long dark eel with electric sparks  | Medium     | AI-generated + S-curve animation     | Critical | Emissive material for sparks |

---

## 2. Textures & Materials

### 2.1 Environment Textures

| Asset        | Description            | Resolution | Source Options                   | Priority | Notes                   |
| ------------ | ---------------------- | ---------- | -------------------------------- | -------- | ----------------------- |
| Stone Bridge | Mossy stone surface    | 1024x1024  | AI (Stable Diffusion), Polyhaven | Critical | Needs normal map        |
| Grass/Ground | Dark grass texture     | 1024x1024  | Polyhaven, AI-generated          | High     | Tiling texture          |
| Dirt/Path    | Dirt texture for banks | 512x512    | Polyhaven                        | Medium   | Subtle detail           |
| Tree Bark    | Stylized bark texture  | 512x512    | AI-generated, Polyhaven          | Medium   | If trees are textured   |
| Tree Foliage | Leaf/canopy texture    | 512x512    | AI-generated                     | Medium   | Stylized, not realistic |

### 2.2 Sky & Background Textures

| Asset          | Description                | Resolution | Source Options            | Priority | Notes                   |
| -------------- | -------------------------- | ---------- | ------------------------- | -------- | ----------------------- |
| Skybox/Skydome | Night sky with stars, moon | 2048x2048  | AI-generated, HDRI Haven  | High     | Could be 6-face cubemap |
| City Skyline   | Neon city panorama         | 2048x512   | AI-generated from concept | High     | If using 2D approach    |
| Moon           | Moon surface texture       | 512x512    | NASA free textures, AI    | Medium   | Or simple gradient      |

### 2.3 Character & Prop Textures

| Asset           | Description         | Resolution | Source Options                   | Priority | Notes                 |
| --------------- | ------------------- | ---------- | -------------------------------- | -------- | --------------------- |
| Fisherman Robes | Dark fabric texture | 512x512    | Simple dark material may suffice | Medium   | Silhouette focus      |
| Straw Hat       | Woven straw texture | 512x512    | AI-generated                     | Medium   | Visible detail        |
| Net Material    | Rope/mesh texture   | 256x256    | Simple procedural                | High     | Needs alpha for holes |

### 2.4 Entity Textures

| Asset         | Description                 | Resolution | Source Options | Priority | Notes                        |
| ------------- | --------------------------- | ---------- | -------------- | -------- | ---------------------------- |
| Bluegill Skin | Blue-green fish scales      | 512x512    | AI-generated   | Critical | Needs subtle glow capability |
| Koi Skin      | Orange/gold scales          | 512x512    | AI-generated   | Critical | Metallic/shiny look          |
| Eel Skin      | Dark with electric patterns | 512x512    | AI-generated   | Critical | Emissive map for sparks      |

---

## 3. Shaders & Visual Effects

| Effect              | Description                                    | Complexity | Priority | Notes                   |
| ------------------- | ---------------------------------------------- | ---------- | -------- | ----------------------- |
| Water Shader        | Reflections, ripples, transparency, distortion | High       | Critical | Core gameplay surface   |
| Fish Glow           | Subtle bioluminescent glow on fish             | Medium     | High     | Helps visibility        |
| Eel Electric Sparks | Animated electrical effect                     | Medium     | High     | Visual danger indicator |
| City Neon Glow      | Bloom/glow on city lights                      | Low        | High     | Atmosphere              |
| Moonlight           | Directional light with color                   | Low        | High     | Primary light source    |
| Net Catch Ripple    | Ripple effect when fish caught                 | Medium     | Medium   | Juice/feedback          |
| Ambient Particles   | Fireflies, dust motes, light specks            | Low        | Low      | Polish                  |

---

## 4. Audio

### 4.1 Ambient / Music

| Asset            | Description                              | Duration    | Source Options          | Priority | Notes                                |
| ---------------- | ---------------------------------------- | ----------- | ----------------------- | -------- | ------------------------------------ |
| Night Ambience   | Crickets, gentle water, distant city hum | Loop 2-3min | Freesound, AI (Suno)    | High     | Layered tracks                       |
| Background Music | Lo-fi/chill atmospheric track            | Loop 2-3min | AI (Suno), royalty-free | Medium   | Optional, may conflict with ambience |

### 4.2 Sound Effects

| Asset        | Description                          | Duration | Source Options    | Priority | Notes                                   |
| ------------ | ------------------------------------ | -------- | ----------------- | -------- | --------------------------------------- |
| Fish Catch   | Splash + net swoosh + positive chime | <1 sec   | Freesound, create | Critical | Satisfying feedback                     |
| Fish Miss    | Subtle splash as fish passes         | <1 sec   | Freesound         | High     | Needs to be noticeable but not annoying |
| Eel Shock    | Electric zap + dramatic sting        | 1-2 sec  | Freesound, create | Critical | Game over impact                        |
| Net Move     | Subtle water swoosh                  | <0.5 sec | Freesound         | Medium   | Movement feedback                       |
| Water Ripple | Gentle plop/ripple                   | <0.5 sec | Freesound         | Medium   | Ambient detail                          |
| Game Win     | Triumphant jingle/chime              | 2-3 sec  | Create, AI        | High     | Victory feedback                        |
| Game Over    | Somber/dramatic sting                | 2-3 sec  | Create, AI        | High     | Loss feedback                           |
| UI Click     | Menu interaction sound               | <0.2 sec | Freesound         | Medium   | Polish                                  |

---

## 5. UI Elements

| Asset               | Description                   | Format             | Source Options                        | Priority | Notes                          |
| ------------------- | ----------------------------- | ------------------ | ------------------------------------- | -------- | ------------------------------ |
| HUD - Weight Caught | "CAUGHT: XX lbs" display      | HTML/CSS or Canvas | Hand-made                             | Critical | Terminal/monospace font        |
| HUD - Weight Missed | "MISSED: XX lbs" display      | HTML/CSS or Canvas | Hand-made                             | Critical | Should show urgency near limit |
| Main Menu           | Title, Start button, Settings | HTML/CSS           | Hand-made                             | High     | Minimal, fits aesthetic        |
| Game Over Screen    | "GAME OVER" + retry option    | HTML/CSS           | Hand-made                             | High     | Dramatic but simple            |
| Win Screen          | Victory message + stats       | HTML/CSS           | Hand-made                             | High     | Satisfying conclusion          |
| Font                | Monospace/terminal style      | TTF/WOFF           | Google Fonts (Share Tech Mono, VT323) | High     | Consistent branding            |
| Net Icon            | Small net graphic for UI      | PNG/SVG            | Hand-made or extracted                | Low      | Optional                       |
| Fish Icons          | Small fish graphics for UI    | PNG/SVG            | Hand-made                             | Low      | Optional, could show types     |

---

## 6. Summary by Priority

### Critical (Game won't function)

- Fisherman model (static)
- Fishing net model
- Stone bridge
- Water plane + shader
- Bluegill, Koi, Eel models
- Fish catch / eel shock SFX
- HUD displays

### High (Needed for release)

- Riverbanks + vegetation (reeds, shrubs)
- Hills + trees (midground)
- City skyline
- Skybox + moon
- Fish glow effect
- Night ambience audio
- Main menu, game over, win screens

### Medium (Polish)

- Detailed textures (stone, bark, etc.)
- Net catch ripple effect
- Background music
- Additional SFX (net move, UI clicks)
- Bridge stone detail

### Low (Nice-to-have)

- Ambient particles (fireflies)
- Fish/net icons in UI
- Additional tree/shrub variants
- Grass detail

---

## 7. Open Questions

1. **City Skyline**: 2D billboard/texture or simple 3D geometry? (2D is easier, 3D allows parallax)

2. **Fish Animation**: Bone-rigged swim cycle or vertex shader animation? (Shader is lighter, bones more natural)

3. **Water Shader Complexity**: Simple reflections + ripples, or full refraction/caustics? (Start simple)

4. **Audio Approach**: Pure ambience, or include subtle music? (Test both)

5. **Tree Style**: Fully 3D models or billboards/sprites? (Billboards may look fine at distance)

---

## 8. Recommended Asset Creation Tools

| Tool             | Use For                                 | Cost                    |
| ---------------- | --------------------------------------- | ----------------------- |
| Meshy.ai         | 3D model generation (characters, props) | Free tier available     |
| Tripo AI         | High-quality 3D models                  | Free tier available     |
| Sketchfab        | Pre-made models (trees, rocks, plants)  | Many free CC0 assets    |
| Blender          | Model cleanup, rigging, animation       | Free                    |
| Stable Diffusion | Texture generation                      | Free (local)            |
| Polyhaven        | Free PBR textures and HDRIs             | Free                    |
| Freesound        | Sound effects                           | Free (with attribution) |
| Suno AI          | Music/ambience generation               | Free tier available     |
| Google Fonts     | UI fonts                                | Free                    |

---

_Document created for Neon River planning phase._
_Reference concept: v4 seated fisherman with cyber-net_
