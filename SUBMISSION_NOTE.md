# Metropolitan Skyline (Living Day & Night Scene)

### How I Approached It
I built a self-contained, real-time 3D cityscape observed through an interior window frame, using pure vanilla HTML5, CSS3, and JavaScript without any external libraries or image assets.

1. **3D Depth & Spatial Parallax**:
   The scene is structured into distinct Z-planes wrapped in a 3D perspective stage (`perspective: 1100px`, `transform-style: preserve-3d`):
   - Sky dome & stars: `translateZ(-950px)`
   - Cloud system: `translateZ(-550px)`
   - Distant skyline: `translateZ(-360px)`
   - Midground architecture: `translateZ(-180px)`
   - Suspension bridge: `translateZ(-90px)`
   - Harbor water channel: `translateZ(-40px)`
   - Foreground towers: `translateZ(0px)`
   - Multi-lane roadway & active traffic: `translateZ(+25px)`
   - Foreground window frame: `translateZ(+90px)`
   Cursor movement, touch dragging, and mobile gyroscope orientation smoothly shift camera yaw and pitch via inertia damping (`lerp = 0.055`), complemented by a gentle sinusoidal idle drift.

2. **24-Hour Environmental Timeline**:
   A 10-keyframe timeline interpolates colors across all 1,440 minutes of the day. Transitions between dawn, midday, golden hour, sunset, dusk, and night feel continuous rather than stepped.

3. **Architectural Glass Optics & Tech Stack Themes**:
   - **Daytime (09:00 – 15:00)**: Interior room lighting is off (`windowOp = 0.0`). Windows render as reflective tinted glass mirroring ambient daylight and sky against dark structural mullions and spandrels.
   - **Nighttime (Sunset – Dawn)**: Windows illuminate with warm and cool glowing room lights in thematic tech brand hues.
   - **Tech Stack Skylines**: Towers reflect developer skill themes (React.js with spinning atom rooftop sign, Next.js, AWS Cloud, JavaScript, CSS3, CI/CD, TypeScript, and Node.js).

4. **Extra Moment**:
   During sunset twilight (**18:45 – 19:30**), a formation of migrating birds crosses the skyline just as building crown accent lights and streetlamps switch on for the evening.

5. **Procedural Ambient Traffic Audio (Web Audio API)**:
   A native acoustic soundscape synthesized entirely in code without any external audio files, featuring lowpass-filtered brown noise for distant city rumble, Doppler bandpass sweeps for passing vehicles, and multi-pattern automotive car horns (dual-tone metallic chords, single taps, double beeps, and traffic honks with directional stereo panning and interactive street click triggers).

---

### How I Made Sure It's Always Correct, However Someone Opens It
- **Synchronous Initial Render**: On load, `getInitialMinutes()` reads `new Date()` from the visitor's device clock. The environment, celestial trigonometry (sun/moon elevation and trajectory), and lighting parameters are calculated and applied synchronously to CSS custom properties before first paint, eliminating any startup flash or warm-up delay.
- **Continuous 60 FPS Loop**: An active `requestAnimationFrame` loop keeps the clock and environmental variables synchronized in real time.
- **Preview Drawer & Sound Controls**: An interactive, responsive control widget in the bottom corner provides a 24-hour time scrubber, 6 phase presets (*Dawn*, *Noon*, *Afternoon*, *Sunset*, *Dusk*, *Night*), a `● Live` button, and an ambient traffic sound toggle.

---

### Anything I Assumed
- **System Time**: Assumed the visitor's device clock accurately reflects local daylight hours.
- **Pure Code Constraint**: Everything is rendered procedurally through CSS gradients, box shadows, transforms, SVG, and the native Web Audio API. No raster image files or external dependencies are needed.
- **Cross-Platform Responsive**: Designed with responsive units (`vh`/`vw`), media queries, and touch listeners to render cleanly on both mobile phones and wide desktop monitors.

---

### What I'd Improve with More Time
1. **Weather Variations**: Add atmospheric weather layers such as light rain running down the window glass or morning fog along the bay.
2. **Astronomical Moon Phases**: Calculate real lunar phases (crescent, gibbous, full) matching the current calendar date.
3. **Harbor Boat Traffic**: Add subtle slow-moving cargo barges or ferries with animated water wakes across the bay.
