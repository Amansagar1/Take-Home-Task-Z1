# Metropolitan Skyline — Living Day & Night Web Creative
**Candidate / Author:** Aman Sagar  
**Task:** Round 1 Take-Home Assignment (Self-Contained Real-Time Web Creative)  
**Technology Stack:** Pure Vanilla HTML5, CSS3 (3D Transforms & Custom Properties), Modern ES6 JavaScript (Web Audio API)

---

### How I Approached It

When reading the brief, my goal was to transcend a typical flat 2D background and build a truly tactile, living metropolitan world that feels alive outside the viewer's window. Rather than swapping out static artwork or cycling through discrete picture steps, I approached this as an interactive spatial diorama viewed through an interior window frame.

1. **3D Spatial Staging & Parallax Architecture**:
   To create genuine depth, I structured the entire scene into nine distinct physical Z-planes contained inside a 3D stage (`perspective: 1100px`, `transform-style: preserve-3d`):
   - **Deep Sky Dome & Twinkling Stars**: `translateZ(-950px)`
   - **Dual-Speed Atmospheric Cloud Decks**: `translateZ(-550px)`
   - **Distant Background Skyline**: `translateZ(-360px)`
   - **Midground Commercial Towers**: `translateZ(-180px)`
   - **Suspension Bridge with Flashing Warning Beacon**: `translateZ(-90px)`
   - **Harbor Bay Channel with Animated Water Shimmer**: `translateZ(-40px)`
   - **Foreground Tower Architecture**: `translateZ(0px)`
   - **Multi-Lane Roadway with Autonomous Vehicle Traffic**: `translateZ(+25px)`
   - **Foreground High-Rise Window Mullions & Sill**: `translateZ(+90px)`

   Instead of abrupt camera snaps, pointer movements, touch drags, and device gyroscope orientation drive camera yaw and pitch via inertia damping (`lerp = 0.055`), complemented by an organic sinusoidal idle drift that keeps the scene breathing even when hands are off the controls.

2. **Continuous 24-Hour Solar & Atmospheric Mechanics**:
   I created a 10-keyframe mathematical environmental timeline spanning all 1,440 minutes of a full day (*Night, Deep Dawn, Sunrise, Morning, Midday, Afternoon, Golden Hour, Sunset, Dusk, Late Night*). Every minute smoothly interpolates RGB sky gradients, horizon haze opacity, cloud highlights, building shadow tones, and water reflection caustics without any perceptible color banding or step jumps. Celestial trajectories for the sun and moon follow continuous trigonometric arcs (`sin`/`cos`), realistically rising, peaking, and dipping below the horizon.

3. **Architectural Glass Optics & Developer Tech Stack Themes**:
   - **Daylight Hours (09:00 – 16:00)**: Interior room fixtures are unlit (`windowOp = 0.0`). The tower facades feature tinted reflective architectural glass that mirrors the sky and sunlight against dark mullions.
   - **Nighttime Hours (Sunset to Dawn)**: Tower windows smoothly illuminate with warm tungsten and cool LED interior lights.
   - **Thematic Tower Crowns**: The cityscape proudly celebrates core developer technologies—featuring a React.js tower with a revolving atomic rooftop beacon, Next.js, AWS Cloud, JavaScript, TypeScript, CSS3, CI/CD, and Node.js.

4. **The "Extra Moment" — Sunset Twilight Migration**:
   Between **18:45 and 19:30 (1,125 to 1,170 minutes)**, during the golden dusk transition, a flock of migrating birds in aerodynamic V-formation flies across the skyline. Each bird features animated flapping wings with staggered phase delays. This coincides precisely with the evening switch-on of architectural crown lights and streetlamps, giving the viewer an unmistakable sense of a living city winding down its workday.

5. **Procedural Native Audio Engineering (Web Audio API)**:
   Complying strictly with the zero-asset constraint, I synthesized an authentic urban soundscape entirely in code using the browser's Web Audio API. It mixes lowpass-filtered brown noise for distant city rumble, soft bandpass air currents for the high-altitude window breeze, Doppler-shifted whooshes for passing boulevard cars, and dual-tone automotive car horns ($420\text{ Hz} + 505\text{ Hz}$) with directional stereo panning and interactive street click triggers.

---

### How I Made Sure It's Always Correct, However Someone Opens It

- **Synchronous Initial Render (Zero Warm-Up Delay)**:
  When a visitor opens the webpage—whether at 6:15 AM dawn, 1:30 PM bright noon, or 11:45 PM deep night—`getInitialMinutes()` synchronously samples `new Date()` from their device clock. All celestial angles, gradient matrices, and lighting opacities are calculated and injected into `:root` CSS custom properties *before the first browser paint*. There is never a white flash, default-state glitch, or awkward warm-up transition.
- **Continuous Real-Time Synchronization**:
  A lightweight 60 FPS `requestAnimationFrame` loop keeps the environmental timeline perfectly synchronized with the ticking system clock.
- **Zero-Dependency Universal Portability**:
  The creative runs completely client-side without any node_modules, build steps, or external CDN dependencies. Opening `index.html` straight from the desktop (`file:///`) works identically to serving it over HTTPS.
- **Interactive Scrubber & Preset Drawer**:
  To empower evaluators to audit any time of day in seconds without waiting 24 hours, the bottom control bar features an interactive time slider, six one-click phase presets (*Dawn*, *Noon*, *Afternoon*, *Sunset*, *Dusk*, *Night*), and an active `● Live` button that snaps right back to real-world device time.

---

### Anything I Assumed

- **System Clock Integrity**: I assumed the user's operating system clock accurately reflects their local solar day.
- **Pure-Code Visuals & Sound Constraint**: I treated the "no images or other files required" guideline as a strict technical constraint. Every single graphic (skyscrapers, suspension cables, vehicles, water waves, stars, sun corona, moon, birds) is constructed from pure CSS gradients, box-shadows, transforms, and SVG. Audio is generated via Web Audio API oscillators and noise buffers without any external `.mp3` or `.wav` media.
- **Responsive Cross-Platform Context**: I assumed reviewers would view the project on everything from ultrawide 4K desktop monitors down to mobile smartphones. I employed fluid viewport units (`vh`/`vw`), touch drag listeners, mobile gyroscope orientation, and responsive breakpoints at `800px` and `500px`.

---

### What I'd Improve with More Time

1. **Atmospheric Weather Systems**: Add dynamic weather overlays—such as soft rain droplets running down the exterior window pane with refractive distortion, or morning fog rolling across the harbor bay.
2. **Astronomical Lunar Ephemeris**: Calculate real-world lunar moon phases (waxing crescent, gibbous, full) matching the actual Gregorian calendar date.
3. **Harbor Channel Maritime Navigation**: Add slow-moving cargo barges and passenger ferries with glowing navigation lights and water wakes crossing beneath the suspension bridge.
4. **Seasonal Sun Position Offsets**: Adjust solar zenith elevation and sunrise/sunset times based on geographic latitude and the time of year.

---

### Complete Project Feature Catalog

Below is an exhaustive inventory of all architectural systems and interactive features built into this project:

#### 1. 3D Spatial Architecture & Parallax Camera
- **Perspective Camera Rig**: True CSS 3D stage (`perspective: 1100px`, `transform-style: preserve-3d`) projecting nine distinct physical Z-depth layers.
- **Cursor & Touch Motion Damping**: Smooth exponential smoothing (`lerp = 0.055`) translating mouse movement and touch dragging into cinematic camera pitch (up to $\pm 3.5^\circ$) and yaw (up to $\pm 6.5^\circ$).
- **Idle Sinusoidal Breathing**: Natural camera drift (`idleRx`, `idleRy`) that subtly bobs the vantage point when untouched.
- **Mobile Gyroscope Support**: Leverages the DeviceOrientation API (`gamma` and `beta`) on mobile phones for intuitive motion-controlled tilt viewing.
- **Interior Architectural Window Frame**: Foreground mullions, transoms, windowsill, and ambient glass reflections that establish a cozy elevated viewing perspective.

#### 2. 24-Hour Environmental Timeline & Celestial Physics
- **10-Keyframe Mathematical Interpolation**: Smooth RGB and alpha color transitions across 1,440 discrete minutes of the day.
- **Trigonometric Solar Mechanics**: Realistic sun trajectory with expanding corona and glare, dynamically setting shadows and lighting angles.
- **Lunar Tracking & Starfield Twinkle**: Moon arc with procedural craters, accompanied by high-altitude twinkling stars that fade during daylight and shine at night.
- **Multi-Altitude Cloud Decks**: Semi-transparent cirrus streaks and layered cumulus puffs drifting independently across the upper troposphere.
- **Horizon Fog & Haze Shading**: Dynamic atmospheric perspective blending distant building bases into the sky gradient.

#### 3. Architectural Glass Optics & Tech Stack Tower Crowns
- **Daylight Glass Reflections**: Facade glass displays high-contrast daylight sky reflections against dark architectural frames when interior lights are unlit.
- **Nighttime Volumetric Window Glow**: Multi-toned incandescent and cool fluorescent illuminated window panes that light up automatically at dusk.
- **Thematic Developer Landmarks**:
  - **React.js Tower**: Features a revolving rooftop atomic emblem with glowing particle orbits.
  - **Next.js Skyscraper**: Sleek black-and-white minimalist crown with high-intensity aviation beacon.
  - **AWS Cloud Tower**: Warm amber crown illumination inspired by cloud infrastructure.
  - **JavaScript, TypeScript, CSS3, CI/CD, and Node.js Towers**: Thematic neon rooftop signage and brand-inspired architectural crown palettes.

#### 4. The Sunset Twilight Migration ("Extra Moment")
- **Time-Locked Natural Event**: Automatically triggers only between **18:45 and 19:30**.
- **Flock Flight Dynamics**: A seven-bird flock cruising across the sky in authentic V-formation.
- **Articulated Wing Physics**: Procedural wing flapping cycles (`@keyframes bird-flap`) with staggered aerodynamic delays between lead and trailing birds.
- **Synchronized Evening Lighting**: Building accent crowns, bridge tower beacons, and street lamp fixtures switch on concurrently with the migration.
- **Contextual UI Readout**: The status pill dynamically updates to display `"Sunset • Migration"`.

#### 5. Living Infrastructure & Maritime Elements
- **Multi-Lane Boulevard Traffic**: Dual-direction highway lanes featuring active sports sedans, yellow city taxis, SUVs, buses, and delivery vans.
- **Dynamic Vehicle Illumination**: Headlights casting beams onto the asphalt and red taillights trailing behind vehicles at dusk and night.
- **Suspension Bay Bridge**: Iconic red-orange towers with main suspension cables, vertical suspenders, and an alternating aeronautical warning beacon.
- **Harbor Water Channel**: Low-altitude bay water featuring continuous animated wave shimmer and specular reflections mirroring the sun and moon.

#### 6. Native Procedural Ambient Audio Engine (Web Audio API)
- **Zero-Asset Synthesis**: 100% generated in real-time through Web Audio API math (no MP3 or WAV files).
- **Sub-Bass City Rumble**: Brown noise buffer routed through a 200 Hz lowpass filter ($Q = 1.4$) simulating low-frequency traffic rumble through thick glass.
- **High-Altitude Window Breeze**: 850 Hz bandpass noise simulating subtle aerodynamic air currents.
- **Doppler Vehicle Sweeps**: Dynamic frequency sweeps (rising to 560 Hz, falling to 220 Hz) with synchronized stereo panning across left and right channels.
- **Default-On with Autoplay Resilience**: Initiates playback immediately, paired with a global user gesture fallback that transparently unlocks browser audio policies.

#### 7. Dual-Tone Automotive Car Horn Engine
- **Authentic Dual-Frequency Chords**: Real dual-tone automotive horn pitches synthesized via twin sawtooth oscillators:
  - *Classic Dual Horn*: 420 Hz + 505 Hz (F#4 + B4)
  - *American Full-Size Sedan*: 375 Hz + 450 Hz
  - *European Compact*: 440 Hz + 530 Hz
  - *Commercial Van / SUV*: 315 Hz + 380 Hz
  - *Metropolitan Yellow Taxi*: 520 Hz + 650 Hz
- **Metallic Diaphragm Overtones**: Shaped through a resonant bandpass filter ($Q = 2.2$) to replicate stamped steel horn bell acoustics.
- **Voltage Drop Frequency Sag**: Pitch drops by $\sim 25\text{ Hz}$ on release, accurately mimicking mechanical spring recoil and electrical voltage cutoff.
- **Pattern Variety**: Randomly alternates between single crisp taps ($140\text{ms}$), friendly double honks ("beep-beep!"), and longer traffic honks ($450\text{ms}$).
- **Interactive Street Honking**: Clicking anywhere on the roadway or animated cars triggers an immediate horn honk with stereo panning matching the horizontal click position.

#### 8. Interactive Click Animation & 3D Dolly Zoom
- **Small Circle Touch Pulse**: Clicking anywhere on the viewport spawns a sleek, compact $22\text{px}$ cyan circle (`.small-click-circle`) that snappily pops outward and fades over $0.4\text{s}$.
- **Cinematic 3D Camera Dolly Zoom**:
  - The camera focuses toward the clicked sector (`targetCamRy`, `targetCamRx`).
  - Translates forward along the 3D Z-axis by $160\text{px}$ (`targetCamTz = 160`), bringing building facades, car traffic, and window reflections into close inspection.
  - Pauses for $750\text{ms}$ and smoothly eases back out to the default wide perspective.
- **Double-Pane Glass Tap Acoustic Resonance**: Tapping on the window pane synthesizes a multi-frequency acoustic glass tap ping ($1760\text{ Hz}$ primary bell, $2640\text{ Hz}$ overtone, $480\text{ Hz}$ body thud).
- **Control Element Protection**: Clicks on interactive widgets (drawer, slider, buttons) are excluded to prevent unwanted camera motion.

#### 9. Interactive Time Scrubber & Evaluation Drawer
- **Live Clock Readout**: Digital 24-hour clock display (`HH:MM`) with active phase indicators.
- **24-Hour Continuous Slider**: Interactive range scrubber ($0$ to $1,439$ minutes) enabling instant exploration of any second of the day.
- **Quick Preset Buttons**: Instant jump buttons for *Dawn* (05:30), *Noon* (12:00), *Afternoon* (14:30), *Sunset* (19:00), *Dusk* (21:00), and *Night* (23:30).
- **One-Click Live Sync**: A dedicated `● Live` button that immediately re-anchors the scene to the visitor's local system time.
- **Sound Toggle Widget**: Glassmorphic audio button with active glowing wave icon and muted state.

#### 10. Code Craftsmanship & Personalization
- **100% Pure Vanilla Code**: Zero libraries, frameworks, bundlers, or compilers.
- **Personalized Text-Only Favicon**: Adaptive SVG favicon displaying the text **Aman** ([favicon.svg](file:///d:/assignment/favicon.svg)) with light/dark theme fill.
- **Author Attribution**: Semantic `<meta name="author" content="Aman Sagar">` included in `<head>`.
- **Strict Comment Conventions**: Every comment across the codebase adheres strictly to uniform formatting (`// ------- [comment] -------` in JS, `/* ------- [comment] ------- */` in CSS, and `<!-- ------- [comment] ------- -->` in HTML).
