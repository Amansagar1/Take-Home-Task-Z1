// ------- Metropolitan Skyline Engine -------

(function () {
    'use strict';

    // ------- DOM Elements -------
    const root = document.documentElement;
    const birdsLayer = document.getElementById('birdsLayer');
    const timeWidget = document.getElementById('timeWidget');
    const timeTrigger = document.getElementById('timeTrigger');
    const soundToggle = document.getElementById('soundToggle');
    const liveDot = document.getElementById('liveDot');
    const clockReadout = document.getElementById('clockReadout');
    const phaseReadout = document.getElementById('phaseReadout');
    const liveToggleBtn = document.getElementById('liveToggleBtn');
    const timeSlider = document.getElementById('timeSlider');
    const presetButtons = document.querySelectorAll('.preset-btn:not(.live-btn)');

    // ------- State Variables -------
    let isLiveMode = true;
    let simulatedMinutes = 720;

    // ------- Camera Gimbal & Parallax State -------
    let targetCamRx = 0; // ------- Target Pitch (deg) -------
    let targetCamRy = 0; // ------- Target Yaw (deg) -------
    let currentCamRx = 0;
    let currentCamRy = 0;
    const CAM_EASE = 0.055; // ------- Camera Inertia Damping -------

    // ------- 24-Hour Environmental Timeline -------
    const timeline = [
        {
            timeMin: 0, // ------- 00:00 Midnight -------
            phase: "Night",
            skyZenith: [7, 11, 24],
            skyMid: [15, 23, 42],
            skyHorizon: [23, 32, 51],
            hazeColor: [37, 36, 56],
            hazeOpacity: 0.6,
            bldgDistant: [8, 13, 30],
            bldgMid: [13, 21, 45],
            bldgFore: [19, 28, 56],
            waterBase: [6, 11, 23],
            facadeLight: 0.03,
            windowWarm: [255, 217, 135],
            windowCool: [226, 238, 255],
            windowOp: 0.85,
            crownOp: 0.8,
            starOp: 1.0,
            cloudOp: 0.35,
            cloudHighlight: [65, 80, 115],
            cloudShadow: [18, 24, 45],
            waterShimmer: 0.75
        },
        {
            timeMin: 300, // ------- 05:00 Early Dawn -------
            phase: "Early Dawn",
            skyZenith: [24, 30, 58],
            skyMid: [67, 50, 82],
            skyHorizon: [191, 95, 88],
            hazeColor: [191, 95, 88],
            hazeOpacity: 0.7,
            bldgDistant: [15, 18, 38],
            bldgMid: [22, 28, 52],
            bldgFore: [30, 36, 64],
            waterBase: [18, 20, 42],
            facadeLight: 0.06,
            windowWarm: [255, 220, 150],
            windowCool: [230, 240, 255],
            windowOp: 0.65,
            crownOp: 0.6,
            starOp: 0.45,
            cloudOp: 0.55,
            cloudHighlight: [235, 145, 130],
            cloudShadow: [65, 45, 75],
            waterShimmer: 0.65
        },
        {
            timeMin: 390, // ------- 06:30 Sunrise -------
            phase: "Sunrise",
            skyZenith: [59, 107, 176],
            skyMid: [146, 168, 209],
            skyHorizon: [247, 178, 103],
            hazeColor: [247, 178, 103],
            hazeOpacity: 0.75,
            bldgDistant: [40, 52, 85],
            bldgMid: [52, 65, 100],
            bldgFore: [65, 80, 120],
            waterBase: [45, 65, 100],
            facadeLight: 0.15,
            windowWarm: [255, 225, 175],
            windowCool: [235, 240, 255],
            windowOp: 0.10, // ------- Sunrise Lights Off -------
            crownOp: 0.0,
            starOp: 0.0,
            cloudOp: 0.7,
            cloudHighlight: [255, 215, 160],
            cloudShadow: [165, 115, 125],
            waterShimmer: 0.55
        },
        {
            timeMin: 540, // ------- 09:00 Morning -------
            phase: "Morning",
            skyZenith: [35, 115, 215],
            skyMid: [110, 170, 235],
            skyHorizon: [185, 220, 250],
            hazeColor: [185, 220, 250],
            hazeOpacity: 0.5,
            bldgDistant: [75, 105, 145],
            bldgMid: [90, 120, 160],
            bldgFore: [105, 135, 180],
            waterBase: [40, 85, 140],
            facadeLight: 0.2,
            windowWarm: [185, 215, 242],
            windowCool: [215, 235, 255],
            windowOp: 0.0, // ------- Daytime Lights Off -------
            crownOp: 0.0,
            starOp: 0.0,
            cloudOp: 0.8,
            cloudHighlight: [255, 255, 255],
            cloudShadow: [180, 205, 235],
            waterShimmer: 0.4
        },
        {
            timeMin: 720, // ------- 12:00 Midday -------
            phase: "Midday",
            skyZenith: [29, 100, 194],
            skyMid: [104, 163, 232],
            skyHorizon: [185, 217, 247],
            hazeColor: [185, 217, 247],
            hazeOpacity: 0.45,
            bldgDistant: [90, 120, 160],
            bldgMid: [105, 135, 175],
            bldgFore: [120, 150, 195],
            waterBase: [35, 80, 140],
            facadeLight: 0.25,
            windowWarm: [175, 208, 238],
            windowCool: [208, 232, 255],
            windowOp: 0.0,
            crownOp: 0.0,
            starOp: 0.0,
            cloudOp: 0.85,
            cloudHighlight: [255, 255, 255],
            cloudShadow: [175, 200, 230],
            waterShimmer: 0.35
        },
        {
            timeMin: 870, // ------- 14:30 Afternoon -------
            phase: "Afternoon",
            skyZenith: [24, 92, 185],
            skyMid: [95, 155, 225],
            skyHorizon: [180, 212, 245],
            hazeColor: [180, 212, 245],
            hazeOpacity: 0.45,
            bldgDistant: [85, 115, 155],
            bldgMid: [100, 130, 170],
            bldgFore: [115, 145, 190],
            waterBase: [35, 78, 135],
            facadeLight: 0.28,
            windowWarm: [180, 212, 242],
            windowCool: [215, 238, 255],
            windowOp: 0.0,
            crownOp: 0.0,
            starOp: 0.0,
            cloudOp: 0.85,
            cloudHighlight: [255, 255, 255],
            cloudShadow: [175, 198, 228],
            waterShimmer: 0.45
        },
        {
            timeMin: 1050, // ------- 17:30 Golden Hour -------
            phase: "Golden Hour",
            skyZenith: [56, 67, 125],
            skyMid: [150, 91, 121],
            skyHorizon: [242, 142, 43],
            hazeColor: [242, 142, 43],
            hazeOpacity: 0.8,
            bldgDistant: [55, 52, 85],
            bldgMid: [70, 65, 100],
            bldgFore: [85, 80, 120],
            waterBase: [50, 45, 80],
            facadeLight: 0.18,
            windowWarm: [255, 210, 125],
            windowCool: [240, 215, 255],
            windowOp: 0.15,
            crownOp: 0.1,
            starOp: 0.0,
            cloudOp: 0.8,
            cloudHighlight: [255, 195, 120],
            cloudShadow: [145, 80, 105],
            waterShimmer: 0.65
        },
        {
            timeMin: 1140, // ------- 19:00 Sunset -------
            phase: "Sunset",
            skyZenith: [36, 34, 71],
            skyMid: [131, 62, 92],
            skyHorizon: [230, 92, 64],
            hazeColor: [230, 92, 64],
            hazeOpacity: 0.85,
            bldgDistant: [26, 22, 50],
            bldgMid: [35, 30, 62],
            bldgFore: [45, 40, 78],
            waterBase: [25, 20, 45],
            facadeLight: 0.12,
            windowWarm: [255, 210, 120],
            windowCool: [230, 220, 255],
            windowOp: 0.68,
            crownOp: 0.7,
            starOp: 0.1,
            cloudOp: 0.75,
            cloudHighlight: [255, 140, 95],
            cloudShadow: [110, 48, 80],
            waterShimmer: 0.8
        },
        {
            timeMin: 1260, // ------- 21:00 Dusk -------
            phase: "Dusk",
            skyZenith: [15, 20, 44],
            skyMid: [42, 32, 70],
            skyHorizon: [110, 53, 87],
            hazeColor: [110, 53, 87],
            hazeOpacity: 0.7,
            bldgDistant: [12, 16, 35],
            bldgMid: [18, 24, 48],
            bldgFore: [25, 32, 60],
            waterBase: [12, 15, 30],
            facadeLight: 0.05,
            windowWarm: [255, 214, 133],
            windowCool: [226, 238, 255],
            windowOp: 0.92,
            crownOp: 0.9,
            starOp: 0.75,
            cloudOp: 0.5,
            cloudHighlight: [135, 80, 115],
            cloudShadow: [35, 25, 52],
            waterShimmer: 0.85
        },
        {
            timeMin: 1440, // ------- 24:00 Midnight Wrap -------
            phase: "Night",
            skyZenith: [7, 11, 24],
            skyMid: [15, 23, 42],
            skyHorizon: [23, 32, 51],
            hazeColor: [37, 36, 56],
            hazeOpacity: 0.6,
            bldgDistant: [8, 13, 30],
            bldgMid: [13, 21, 45],
            bldgFore: [19, 28, 56],
            waterBase: [6, 11, 23],
            facadeLight: 0.03,
            windowWarm: [255, 214, 133],
            windowCool: [226, 238, 255],
            windowOp: 0.90,
            crownOp: 0.85,
            starOp: 1.0,
            cloudOp: 0.35,
            cloudHighlight: [65, 80, 115],
            cloudShadow: [18, 24, 45],
        }
    ];

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function lerpColor(c1, c2, t) {
        return [
            Math.round(lerp(c1[0], c2[0], t)),
            Math.round(lerp(c1[1], c2[1], t)),
            Math.round(lerp(c1[2], c2[2], t))
        ];
    }

    function formatClock(totalMinutes) {
        let hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = Math.floor(totalMinutes % 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const padM = String(minutes).padStart(2, '0');
        return `${hours}:${padM} ${ampm}`;
    }

    function renderEnvironment(minuteOfDay) {
        const clampedMin = ((minuteOfDay % 1440) + 1440) % 1440;

        let idx = 0;
        while (idx < timeline.length - 1 && timeline[idx + 1].timeMin <= clampedMin) {
            idx++;
        }

        const k1 = timeline[idx];
        const k2 = timeline[idx + 1] || timeline[0];
        const span = k2.timeMin - k1.timeMin;
        const t = span === 0 ? 0 : (clampedMin - k1.timeMin) / span;

        // ------- Timeline Interpolations -------
        const skyZenith = lerpColor(k1.skyZenith, k2.skyZenith, t);
        const skyMid = lerpColor(k1.skyMid, k2.skyMid, t);
        const skyHorizon = lerpColor(k1.skyHorizon, k2.skyHorizon, t);
        const hazeColor = lerpColor(k1.hazeColor, k2.hazeColor, t);
        const bldgDist = lerpColor(k1.bldgDistant, k2.bldgDistant, t);
        const bldgMid = lerpColor(k1.bldgMid, k2.bldgMid, t);
        const bldgFore = lerpColor(k1.bldgFore, k2.bldgFore, t);
        const waterBase = lerpColor(k1.waterBase, k2.waterBase, t);
        const windowWarm = lerpColor(k1.windowWarm, k2.windowWarm, t);
        const windowCool = lerpColor(k1.windowCool, k2.windowCool, t);
        const cloudHighlight = lerpColor(k1.cloudHighlight, k2.cloudHighlight, t);
        const cloudShadow = lerpColor(k1.cloudShadow, k2.cloudShadow, t);

        const hazeOp = lerp(k1.hazeOpacity, k2.hazeOpacity, t);
        const facadeLight = lerp(k1.facadeLight, k2.facadeLight, t);
        const windowOp = lerp(k1.windowOp, k2.windowOp, t);
        const crownOp = lerp(k1.crownOp, k2.crownOp, t);
        const starOp = lerp(k1.starOp, k2.starOp, t);
        const cloudOp = lerp(k1.cloudOp, k2.cloudOp, t);
        const waterShimmer = lerp(k1.waterShimmer, k2.waterShimmer, t);

        const currentPhase = t < 0.5 ? k1.phase : k2.phase;

        // ------- Apply CSS Variables -------
        root.style.setProperty('--sky-zenith', `rgb(${skyZenith.join(',')})`);
        root.style.setProperty('--sky-mid', `rgb(${skyMid.join(',')})`);
        root.style.setProperty('--sky-horizon', `rgb(${skyHorizon.join(',')})`);
        root.style.setProperty('--horizon-haze-color', `rgb(${hazeColor.join(',')})`);
        root.style.setProperty('--haze-opacity', hazeOp.toFixed(3));
        root.style.setProperty('--bldg-back', `rgb(${bldgDist.join(',')})`);
        root.style.setProperty('--bldg-mid', `rgb(${bldgMid.join(',')})`);
        root.style.setProperty('--bldg-front', `rgb(${bldgFore.join(',')})`);
        root.style.setProperty('--water-base', `rgb(${waterBase.join(',')})`);
        root.style.setProperty('--facade-light', `rgba(255, 255, 255, ${facadeLight.toFixed(3)})`);
        root.style.setProperty('--window-warm-glow', `rgb(${windowWarm.join(',')})`);
        root.style.setProperty('--window-cool-glow', `rgb(${windowCool.join(',')})`);
        root.style.setProperty('--window-opacity', windowOp.toFixed(3));
        root.style.setProperty('--crown-light-opacity', crownOp.toFixed(3));
        root.style.setProperty('--star-opacity', starOp.toFixed(3));
        root.style.setProperty('--cloud-opacity', cloudOp.toFixed(3));
        root.style.setProperty('--cloud-highlight', `rgb(${cloudHighlight.join(',')})`);
        root.style.setProperty('--cloud-shadow', `rgba(${cloudShadow.join(',')}, 0.7)`);
        root.style.setProperty('--water-shimmer-opacity', waterShimmer.toFixed(3));

        // ------- Window Glass & Lighting System -------
        const lightPwr = windowOp;

        // ------- Daytime Reflective Architectural Glass -------
        const dayGlassCool = [135, 175, 215]; // ------- Clear Sky Reflection -------
        const dayGlassWarm = [110, 145, 185]; // ------- Low-Angle Sky Reflection -------
        const dayGlassBronze = [140, 135, 130]; // ------- Bronze Architectural Glass -------
        const dayGlassTeal = [115, 165, 160];   // ------- Seafoam Architectural Glass -------
        const dayGlassNeutral = [130, 145, 160]; // ------- Platinum Architectural Glass -------

        // ------- Nighttime Thematic Interior Lighting -------
        // ------- AWS Cloud Tower Lighting -------
        const nightAws1 = [255, 180, 50]; 
        const nightAws2 = [255, 140, 20];

        // ------- React.js Flagship Tower Lighting -------
        const nightReact1 = [97, 218, 251]; 
        const nightReact2 = [0, 216, 255];

        // ------- Next.js High-Rise Lighting -------
        const nightNext1 = [255, 255, 255]; 
        const nightNext2 = [210, 225, 240];

        // ------- Midground Tower Lighting -------
        // ------- JavaScript Tower Lighting -------
        const nightJs1 = [255, 235, 60]; 
        const nightJs2 = [247, 215, 20];

        // ------- CSS3 Tower Lighting -------
        const nightCss1 = [125, 195, 255]; 
        const nightCss2 = [41, 101, 241];

        // ------- CI/CD Tower Lighting -------
        const nightCicd1 = [110, 245, 190]; 
        const nightCicd2 = [16, 185, 129];

        // ------- TypeScript Tower Lighting -------
        const nightTs1 = [147, 197, 253]; 
        const nightTs2 = [49, 120, 198];

        // ------- Node.js Tower Lighting -------
        const nightNode1 = [167, 243, 208]; 
        const nightNode2 = [34, 197, 94];

        function getPaneColor(dayColor, nightColor, pwr) {
            const rgb = lerpColor(dayColor, nightColor, pwr);
            // ------- Daytime Glass Reflection Alpha -------
            // ------- Nighttime Glowing Luminous Alpha -------
            const alpha = 0.80 + pwr * 0.16;
            return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(2)})`;
        }

        // ------- Foreground Window Colors -------
        root.style.setProperty('--win-aws-1', getPaneColor(dayGlassBronze, nightAws1, lightPwr));
        root.style.setProperty('--win-aws-2', getPaneColor(dayGlassWarm, nightAws2, lightPwr));

        root.style.setProperty('--win-react-1', getPaneColor(dayGlassCool, nightReact1, lightPwr));
        root.style.setProperty('--win-react-2', getPaneColor(dayGlassWarm, nightReact2, lightPwr));

        root.style.setProperty('--win-next-1', getPaneColor(dayGlassNeutral, nightNext1, lightPwr));
        root.style.setProperty('--win-next-2', getPaneColor(dayGlassCool, nightNext2, lightPwr));

        // ------- Midground Window Colors -------
        root.style.setProperty('--win-js-1', getPaneColor(dayGlassCool, nightJs1, lightPwr));
        root.style.setProperty('--win-js-2', getPaneColor(dayGlassWarm, nightJs2, lightPwr));

        root.style.setProperty('--win-css-1', getPaneColor(dayGlassCool, nightCss1, lightPwr));
        root.style.setProperty('--win-css-2', getPaneColor(dayGlassWarm, nightCss2, lightPwr));

        root.style.setProperty('--win-cicd-1', getPaneColor(dayGlassTeal, nightCicd1, lightPwr));
        root.style.setProperty('--win-cicd-2', getPaneColor(dayGlassWarm, nightCicd2, lightPwr));

        root.style.setProperty('--win-ts-1', getPaneColor(dayGlassCool, nightTs1, lightPwr));
        root.style.setProperty('--win-ts-2', getPaneColor(dayGlassWarm, nightTs2, lightPwr));

        root.style.setProperty('--win-node-1', getPaneColor(dayGlassTeal, nightNode1, lightPwr));
        root.style.setProperty('--win-node-2', getPaneColor(dayGlassWarm, nightNode2, lightPwr));

        // ------- Sun Trajectory & Atmospheric Optics -------
        const sunRise = 345;  // ------- 05:45 Sunrise -------
        const sunSet = 1125;  // ------- 18:45 Sunset -------
        const sunDuration = sunSet - sunRise;

        if (clampedMin >= sunRise && clampedMin <= sunSet) {
            const sunProgress = (clampedMin - sunRise) / sunDuration;
            const sunX = 14 + sunProgress * 72; // ------- East to West Trajectory -------
            const sunArc = Math.sin(sunProgress * Math.PI);
            const sunY = 38 - sunArc * 28; // ------- High Sky Orbit -------
            const sunOpacity = Math.min(1, sunArc * 3.5);

            // ------- Horizon Solar Extinction -------
            let coreColor = "#ffffff";
            let coronaColor = "rgba(255, 200, 100, 0.4)";
            let sunSize = 76;

            if (sunProgress < 0.15 || sunProgress > 0.85) {
                // ------- Horizon Proximity Calculation -------
                coreColor = "#ffb37e";
                coronaColor = "rgba(255, 80, 50, 0.55)";
                sunSize = 86;
            } else if (sunProgress < 0.28 || sunProgress > 0.72) {
                coreColor = "#fff2b2";
                coronaColor = "rgba(255, 170, 70, 0.45)";
                sunSize = 80;
            }

            root.style.setProperty('--sun-x', `${sunX.toFixed(2)}%`);
            root.style.setProperty('--sun-y', `${sunY.toFixed(2)}%`);
            root.style.setProperty('--sun-opacity', sunOpacity.toFixed(2));
            root.style.setProperty('--sun-core-color', coreColor);
            root.style.setProperty('--sun-corona-color', coronaColor);
            root.style.setProperty('--sun-size', `${sunSize}px`);
        } else {
            root.style.setProperty('--sun-y', '115%');
            root.style.setProperty('--sun-opacity', '0');
        }

        // ------- Moon Trajectory & Night Elevation -------
        const moonRise = 1095; // ------- 18:15 Moonrise -------
        const moonSet = 375;   // ------- 06:15 Moonset -------
        let isMoonUp = false;
        let moonProgress = 0;

        if (clampedMin >= moonRise) {
            isMoonUp = true;
            moonProgress = (clampedMin - moonRise) / 720;
        } else if (clampedMin <= moonSet) {
            isMoonUp = true;
            moonProgress = (clampedMin + (1440 - moonRise)) / 720;
        }

        if (isMoonUp) {
            const moonX = 14 + moonProgress * 72;
            const moonArc = Math.sin(moonProgress * Math.PI);
            const moonY = 36 - moonArc * 26; // ------- High Sky Orbit -------
            const moonOpacity = Math.min(1, moonArc * 3.0);

            root.style.setProperty('--moon-x', `${moonX.toFixed(2)}%`);
            root.style.setProperty('--moon-y', `${moonY.toFixed(2)}%`);
            root.style.setProperty('--moon-opacity', moonOpacity.toFixed(2));
        } else {
            root.style.setProperty('--moon-y', '115%');
            root.style.setProperty('--moon-opacity', '0');
        }

        // ------- Water Reflection Tracking -------
        let reflX = "50%";
        let reflColor = "rgba(255, 200, 120, 0.4)";
        let reflOp = 0;

        if (clampedMin >= sunRise && clampedMin <= sunSet) {
            const sunProgress = (clampedMin - sunRise) / sunDuration;
            const sunX = 14 + sunProgress * 72;
            const sunArc = Math.sin(sunProgress * Math.PI);
            reflX = `${sunX.toFixed(2)}%`;

            if (sunProgress < 0.2 || sunProgress > 0.8) {
                // ------- Golden Sun Reflection Trail -------
                reflColor = "rgba(255, 140, 60, 0.55)";
                reflOp = Math.min(0.85, sunArc * 4.5);
            } else {
                reflColor = "rgba(255, 240, 190, 0.25)";
                reflOp = Math.min(0.5, sunArc * 2.5);
            }
        } else if (isMoonUp) {
            // ------- Silvery Moon Reflection Trail -------
            const moonX = 14 + moonProgress * 72;
            const moonArc = Math.sin(moonProgress * Math.PI);
            reflX = `${moonX.toFixed(2)}%`;
            reflColor = "rgba(200, 230, 255, 0.35)";
            reflOp = Math.min(0.65, moonArc * 3.0);
        }

        root.style.setProperty('--water-reflection-x', reflX);
        root.style.setProperty('--water-reflection-color', reflColor);
        root.style.setProperty('--water-reflection-opacity', reflOp.toFixed(3));

        // ------- Street & Bridge Lighting -------
        const isNightOrDusk = clampedMin < sunRise || clampedMin > sunSet;
        const streetLightOp = isNightOrDusk ? 0.95 : 0.05;
        const interiorLampOp = isNightOrDusk ? 0.35 : 0.0;
        root.style.setProperty('--esplanade-light-opacity', streetLightOp.toFixed(2));
        root.style.setProperty('--bridge-light-opacity', streetLightOp.toFixed(2));
        root.style.setProperty('--lamp-opacity', interiorLampOp.toFixed(2));

        // ------- Sunset Bird Flight -------
        const isMigrationTime = clampedMin >= 1125 && clampedMin <= 1170;

        if (isMigrationTime) {
            if (birdsLayer && !birdsLayer.classList.contains('active')) {
                birdsLayer.classList.add('active');
            }
        } else {
            if (birdsLayer && birdsLayer.classList.contains('active')) {
                birdsLayer.classList.remove('active');
            }
        }

        // ------- UI Display Updates -------
        if (clockReadout) {
            clockReadout.textContent = formatClock(clampedMin);
        }
        if (phaseReadout) {
            phaseReadout.textContent = isMigrationTime ? "Sunset • Migration" : currentPhase;
        }
    }

    // ------- Main 60fps Animation Loop -------
    function frameLoop(timestamp) {
        const timeMs = timestamp || performance.now();

        // ------- Idle Camera Drift -------
        const idleRx = Math.sin(timeMs * 0.0006) * 0.75;
        const idleRy = Math.cos(timeMs * 0.0004) * 1.35;

        // ------- Camera Easing Interpolation -------
        currentCamRx += (targetCamRx - currentCamRx) * CAM_EASE;
        currentCamRy += (targetCamRy - currentCamRy) * CAM_EASE;

        root.style.setProperty('--cam-rx', `${currentCamRx.toFixed(3)}deg`);
        root.style.setProperty('--cam-ry', `${currentCamRy.toFixed(3)}deg`);
        root.style.setProperty('--idle-rx', `${idleRx.toFixed(3)}deg`);
        root.style.setProperty('--idle-ry', `${idleRy.toFixed(3)}deg`);

        // ------- Environment Render Call -------
        if (isLiveMode) {
            const now = new Date();
            const minuteOfDay = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
            
            if (timeSlider) {
                timeSlider.value = Math.floor(minuteOfDay);
            }
            renderEnvironment(minuteOfDay);
        } else {
            renderEnvironment(simulatedMinutes);
        }

        requestAnimationFrame(frameLoop);
    }

    // ------- Cursor Parallax Event Listeners -------
    window.addEventListener('mousemove', (e) => {
        // ------- Normalized Screen Offset -------
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;

        // ------- Camera Rotation Bounds -------
        targetCamRy = normX * 4.5;
        targetCamRx = -normY * 2.5;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        targetCamRx = 0;
        targetCamRy = 0;
    });

    // ------- Mobile Touch Parallax Listeners -------
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const deltaX = (e.touches[0].clientX - touchStartX) / window.innerWidth;
            const deltaY = (e.touches[0].clientY - touchStartY) / window.innerHeight;
            targetCamRy = Math.max(-5, Math.min(5, deltaX * 8));
            targetCamRx = Math.max(-3, Math.min(3, -deltaY * 5));
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        targetCamRx = 0;
        targetCamRy = 0;
    });

    // ------- Device Orientation Gyroscope Listeners -------
    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
            const gyroYaw = Math.max(-5, Math.min(5, (e.gamma / 25) * 4.5));
            const gyroPitch = Math.max(-3, Math.min(3, ((e.beta - 45) / 30) * 2.5));
            targetCamRy = gyroYaw;
            targetCamRx = -gyroPitch;
        }
    }, { passive: true });

    // ------- Time Widget Controls & Events -------
    if (timeTrigger && timeWidget) {
        timeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            timeWidget.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!timeWidget.contains(e.target)) {
                timeWidget.classList.remove('open');
            }
        });
    }

    if (timeSlider) {
        timeSlider.addEventListener('input', (e) => {
            isLiveMode = false;
            simulatedMinutes = parseFloat(e.target.value);
            updateLiveToggleUI();
        });
    }

    if (liveToggleBtn) {
        liveToggleBtn.addEventListener('click', () => {
            isLiveMode = true;
            updateLiveToggleUI();
        });
    }

    function updateLiveToggleUI() {
        if (isLiveMode) {
            if (liveDot) liveDot.classList.remove('simulated');
            if (phaseReadout) phaseReadout.textContent = "Live";
            if (liveToggleBtn) liveToggleBtn.classList.add('active');
            presetButtons.forEach(b => b.classList.remove('active'));
        } else {
            if (liveDot) liveDot.classList.add('simulated');
            if (phaseReadout) phaseReadout.textContent = "Simulated";
            if (liveToggleBtn) liveToggleBtn.classList.remove('active');
        }
    }

    presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetMin = parseFloat(btn.dataset.minutes);
            isLiveMode = false;
            simulatedMinutes = targetMin;
            if (timeSlider) {
                timeSlider.value = targetMin;
            }
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLiveToggleUI();
        });
    });

    // ------- Procedural Ambient Traffic Audio Engine (Web Audio API) -------
    class AmbientTrafficAudio {
        constructor() {
            this.ctx = null;
            this.isPlaying = false;
            this.masterGain = null;
            this.carTimer = null;
            this.hornTimer = null;
        }

        init() {
            if (this.ctx) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            // ------- Master Gain Node with Smooth Ramp -------
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // ------- Low-Frequency Distant City Rumble -------
            this.startCityRumble();

            // ------- High-Altitude Open Window Breeze -------
            this.startBreeze();
        }

        // ------- Generate Pink/Brown Noise Buffer -------
        createNoiseBuffer(seconds) {
            const sampleRate = this.ctx.sampleRate;
            const length = sampleRate * seconds;
            const buffer = this.ctx.createBuffer(1, length, sampleRate);
            const data = buffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < length; i++) {
                const white = Math.random() * 2 - 1;
                lastOut = (lastOut + 0.02 * white) / 1.02;
                data[i] = lastOut * 3.5;
            }
            return buffer;
        }

        startCityRumble() {
            const buffer = this.createNoiseBuffer(6);
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            src.loop = true;

            // ------- Lowpass Filter to Simulate Window Glass Acoustic Profile -------
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.ctx.currentTime);
            filter.Q.setValueAtTime(1.4, this.ctx.currentTime);

            const rumbleGain = this.ctx.createGain();
            rumbleGain.gain.setValueAtTime(0.32, this.ctx.currentTime);

            src.connect(filter);
            filter.connect(rumbleGain);
            rumbleGain.connect(this.masterGain);
            src.start();
        }

        startBreeze() {
            const buffer = this.createNoiseBuffer(5);
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;
            src.loop = true;

            const bandpass = this.ctx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime(850, this.ctx.currentTime);
            bandpass.Q.setValueAtTime(0.7, this.ctx.currentTime);

            const breezeGain = this.ctx.createGain();
            breezeGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

            src.connect(bandpass);
            bandpass.connect(breezeGain);
            breezeGain.connect(this.masterGain);
            src.start();
        }

        // ------- Schedule Distant Passing Vehicle Whooshes -------
        schedulePassingCars() {
            if (!this.isPlaying) return;
            const nextDelay = 3500 + Math.random() * 4500;
            this.carTimer = setTimeout(() => {
                if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
                    this.playPassingCarWhoosh();
                }
                this.schedulePassingCars();
            }, nextDelay);
        }

        playPassingCarWhoosh() {
            const duration = 2.6 + Math.random() * 1.6;
            const now = this.ctx.currentTime;
            const isEastbound = Math.random() > 0.5;

            const buffer = this.createNoiseBuffer(Math.ceil(duration) + 1);
            const src = this.ctx.createBufferSource();
            src.buffer = buffer;

            // ------- Bandpass Filter for Tire on Asphalt Acoustic Friction -------
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.Q.setValueAtTime(1.6, now);

            // ------- Doppler Shift Frequency Modulation -------
            const startF = isEastbound ? 280 : 520;
            const midF = isEastbound ? 560 : 340;
            const endF = isEastbound ? 240 : 190;
            filter.frequency.setValueAtTime(startF, now);
            filter.frequency.exponentialRampToValueAtTime(midF, now + duration * 0.42);
            filter.frequency.exponentialRampToValueAtTime(endF, now + duration);

            // ------- Smooth Gain Envelope -------
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(0.16, now + duration * 0.4);
            gain.gain.linearRampToValueAtTime(0.0001, now + duration);

            // ------- Stereo Panning Across Multi-Lane Boulevard -------
            let panner = null;
            if (this.ctx.createStereoPanner) {
                panner = this.ctx.createStereoPanner();
                const panStart = isEastbound ? -0.85 : 0.85;
                const panEnd = isEastbound ? 0.85 : -0.85;
                panner.pan.setValueAtTime(panStart, now);
                panner.pan.linearRampToValueAtTime(panEnd, now + duration);
            }

            src.connect(filter);
            filter.connect(gain);

            if (panner) {
                gain.connect(panner);
                panner.connect(this.masterGain);
            } else {
                gain.connect(this.masterGain);
            }

            src.start(now);
            src.stop(now + duration + 0.1);
        }

        // ------- Schedule Periodic Metropolitan Car Horns -------
        scheduleCarHorns() {
            if (!this.isPlaying) return;
            const nextDelay = 3200 + Math.random() * 4200;
            this.hornTimer = setTimeout(() => {
                if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
                    this.playCarHorn();
                }
                this.scheduleCarHorns();
            }, nextDelay);
        }

        // ------- Play Dual-Tone Automotive Car Horn with Patterns -------
        playCarHorn(options = {}) {
            if (!this.ctx) return;
            if (this.ctx.state !== 'running') {
                this.ctx.resume().catch(() => {});
                return;
            }

            const now = this.ctx.currentTime;
            const hornPairs = [
                { f1: 420, f2: 505 },
                { f1: 375, f2: 450 },
                { f1: 440, f2: 530 },
                { f1: 315, f2: 380 },
                { f1: 520, f2: 650 }
            ];

            const pair = options.pair || hornPairs[Math.floor(Math.random() * hornPairs.length)];
            const pan = options.pan !== undefined ? options.pan : (Math.random() * 1.6 - 0.8);
            const volume = options.volume !== undefined ? options.volume : (0.16 + Math.random() * 0.12);
            const pattern = options.pattern !== undefined ? options.pattern : Math.floor(Math.random() * 3);

            if (pattern === 0) {
                // ------- Single Crisp Tap Beep -------
                const dur = 0.14 + Math.random() * 0.05;
                this.triggerHornPulse(pair.f1, pair.f2, now, dur, pan, volume);
            } else if (pattern === 1) {
                // ------- Double Friendly Honk Beep-Beep -------
                const dur1 = 0.085;
                const gap = 0.075;
                const dur2 = 0.11;
                this.triggerHornPulse(pair.f1, pair.f2, now, dur1, pan, volume);
                this.triggerHornPulse(pair.f1, pair.f2, now + dur1 + gap, dur2, pan, volume * 1.05);
            } else {
                // ------- Longer Metropolitan Traffic Honk -------
                const dur = 0.38 + Math.random() * 0.16;
                this.triggerHornPulse(pair.f1, pair.f2, now, dur, pan, volume * 0.95);
            }
        }

        // ------- Synthesize Dual-Frequency Car Horn Pulse with Filter Envelopes -------
        triggerHornPulse(f1, f2, startTime, duration, panVal, peakGain) {
            if (!this.ctx) return;

            // ------- Dual Sawtooth Oscillators for Metallic Diaphragm Overtones -------
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';

            osc1.frequency.setValueAtTime(f1, startTime);
            osc2.frequency.setValueAtTime(f2, startTime);

            // ------- Natural Voltage Sag Pitch Drop on Release -------
            const releaseStart = startTime + Math.max(0.02, duration - 0.035);
            osc1.frequency.setValueAtTime(f1, releaseStart);
            osc1.frequency.linearRampToValueAtTime(f1 - 22, startTime + duration);
            osc2.frequency.setValueAtTime(f2, releaseStart);
            osc2.frequency.linearRampToValueAtTime(f2 - 26, startTime + duration);

            // ------- Pulse Gain Envelope with Sharp Attack & Smooth Release -------
            const pulseGain = this.ctx.createGain();
            pulseGain.gain.setValueAtTime(0.0001, startTime);
            pulseGain.gain.linearRampToValueAtTime(peakGain, startTime + 0.005);
            pulseGain.gain.setValueAtTime(peakGain, releaseStart);
            pulseGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

            // ------- Resonant Bandpass Filter Simulating Metallic Horn Bell -------
            const bandpass = this.ctx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime((f1 + f2) * 0.95, startTime);
            bandpass.Q.setValueAtTime(2.2, startTime);

            // ------- Lowpass Filter Simulating Window Elevation Isolation -------
            const lowpass = this.ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.frequency.setValueAtTime(2100, startTime);
            lowpass.Q.setValueAtTime(0.8, startTime);

            // ------- Directional Stereo Panning Across Street Lanes -------
            let panner = null;
            if (this.ctx.createStereoPanner) {
                panner = this.ctx.createStereoPanner();
                const clampedPan = Math.max(-0.9, Math.min(0.9, panVal));
                panner.pan.setValueAtTime(clampedPan, startTime);
            }

            osc1.connect(pulseGain);
            osc2.connect(pulseGain);
            pulseGain.connect(bandpass);
            bandpass.connect(lowpass);

            if (panner) {
                lowpass.connect(panner);
                panner.connect(this.masterGain);
            } else {
                lowpass.connect(this.masterGain);
            }

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + duration + 0.06);
            osc2.stop(startTime + duration + 0.06);
        }

        start() {
            this.init();
            this.isPlaying = true;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(0.36, now + 1.2);
            this.schedulePassingCars();
            this.scheduleCarHorns();

            // ------- Quick Friendly Horn Tap Shortly After Activation -------
            setTimeout(() => {
                if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
                    this.playCarHorn({ pattern: 1 });
                }
            }, 850);
        }

        stop() {
            this.isPlaying = false;
            if (this.carTimer) clearTimeout(this.carTimer);
            if (this.hornTimer) clearTimeout(this.hornTimer);
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        }
    }

    // ------- Ambient Sound Controls & Event Listeners -------
    const ambientAudio = new AmbientTrafficAudio();

    // ------- Start Ambient Audio by Default -------
    ambientAudio.start();

    // ------- Global User Gesture Fallback for Browser Autoplay Policies -------
    const unlockAudio = () => {
        if (ambientAudio.isPlaying && ambientAudio.ctx && ambientAudio.ctx.state === 'suspended') {
            ambientAudio.ctx.resume().then(() => {
                ambientAudio.playCarHorn({ pattern: 1 });
            }).catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    // ------- Interactive Roadway Click Triggers Directional Car Horn -------
    const roadway = document.querySelector('.roadway');
    if (roadway) {
        roadway.addEventListener('click', (e) => {
            if (ambientAudio.isPlaying) {
                const rect = roadway.getBoundingClientRect();
                const clickX = (e.clientX - rect.left) / (rect.width || 1);
                const pan = (clickX * 1.6) - 0.8;
                ambientAudio.playCarHorn({ pan, pattern: Math.random() > 0.4 ? 1 : 0 });
            }
        });
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const mutedIcon = soundToggle.querySelector('.sound-muted');
            const activeIcon = soundToggle.querySelector('.sound-active');

            if (ambientAudio.isPlaying) {
                ambientAudio.stop();
                soundToggle.classList.remove('active');
                if (mutedIcon) mutedIcon.style.display = 'block';
                if (activeIcon) activeIcon.style.display = 'none';
                soundToggle.setAttribute('title', 'Play ambient city traffic sound');
            } else {
                ambientAudio.start();
                soundToggle.classList.add('active');
                if (mutedIcon) mutedIcon.style.display = 'none';
                if (activeIcon) activeIcon.style.display = 'block';
                soundToggle.setAttribute('title', 'Mute ambient city sound');
            }
        });
    }

    // ------- Synchronous Initial Render -------
    const initialDate = new Date();
    const initialMin = initialDate.getHours() * 60 + initialDate.getMinutes() + initialDate.getSeconds() / 60;
    if (timeSlider) timeSlider.value = Math.floor(initialMin);
    renderEnvironment(initialMin);

    requestAnimationFrame(frameLoop);

})();
