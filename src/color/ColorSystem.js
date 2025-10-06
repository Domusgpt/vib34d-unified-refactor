/**
 * Advanced Color System
 * Palettes, gradients, and audio-reactive colors
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class ColorSystem {
    constructor() {
        // Color modes
        this.modes = {
            SINGLE: 0,
            DUAL: 1,
            TRIAD: 2,
            COMPLEMENTARY: 3,
            ANALOGOUS: 4,
            PALETTE: 5,
            GRADIENT: 6,
            REACTIVE: 7
        };

        this.currentMode = this.modes.SINGLE;

        // Predefined color palettes (RGB values)
        this.palettes = {
            vaporwave: [
                { r: 255, g: 113, b: 206 },  // #ff71ce
                { r: 1, g: 205, b: 254 },    // #01cdfe
                { r: 5, g: 255, b: 161 },    // #05ffa1
                { r: 185, g: 103, b: 255 }   // #b967ff
            ],
            cyberpunk: [
                { r: 255, g: 0, b: 110 },    // #ff006e
                { r: 251, g: 86, b: 7 },     // #fb5607
                { r: 255, g: 190, b: 11 },   // #ffbe0b
                { r: 131, g: 56, b: 236 }    // #8338ec
            ],
            synthwave: [
                { r: 247, g: 37, b: 133 },   // #f72585
                { r: 114, g: 9, b: 183 },    // #7209b7
                { r: 58, g: 12, b: 163 },    // #3a0ca3
                { r: 67, g: 97, b: 238 }     // #4361ee
            ],
            holographic: [
                { r: 255, g: 0, b: 255 },    // #ff00ff
                { r: 0, g: 255, b: 255 },    // #00ffff
                { r: 255, g: 0, b: 170 },    // #ff00aa
                { r: 0, g: 170, b: 255 }     // #00aaff
            ],
            neon: [
                { r: 254, g: 0, b: 254 },    // #fe00fe
                { r: 0, g: 254, b: 254 },    // #00fefe
                { r: 254, g: 254, b: 0 },    // #fefe00
                { r: 0, g: 254, b: 0 }       // #00fe00
            ],
            fire: [
                { r: 255, g: 0, b: 0 },      // #ff0000
                { r: 255, g: 68, b: 0 },     // #ff4400
                { r: 255, g: 136, b: 0 },    // #ff8800
                { r: 255, g: 204, b: 0 }     // #ffcc00
            ],
            ocean: [
                { r: 0, g: 30, b: 255 },     // #001eff
                { r: 0, g: 136, b: 255 },    // #0088ff
                { r: 0, g: 204, b: 255 },    // #00ccff
                { r: 0, g: 255, b: 238 }     // #00ffee
            ],
            forest: [
                { r: 0, g: 77, b: 0 },       // #004d00
                { r: 0, g: 136, b: 0 },      // #008800
                { r: 0, g: 204, b: 0 },      // #00cc00
                { r: 136, g: 255, b: 0 }     // #88ff00
            ]
        };

        this.currentPalette = 'vaporwave';

        // Gradient types
        this.gradientTypes = {
            HORIZONTAL: 0,
            VERTICAL: 1,
            RADIAL: 2,
            SPIRAL: 3,
            WAVE: 4
        };

        this.currentGradientType = this.gradientTypes.HORIZONTAL;
        this.gradientPhase = 0;
        this.gradientSpeed = 0.5;
    }

    /**
     * Get color for a given position and time
     * @param {number} x - X coordinate (0-1)
     * @param {number} y - Y coordinate (0-1)
     * @param {number} time - Time value
     * @param {number} baseHue - Base hue (0-360)
     * @param {Object} audioData - Optional audio data for reactive mode
     */
    getColor(x, y, time, baseHue, audioData = null) {
        switch(this.currentMode) {
            case this.modes.SINGLE:
                return this.singleHueColor(baseHue);

            case this.modes.DUAL:
                return this.dualHueColor(baseHue, x);

            case this.modes.TRIAD:
                return this.triadColor(baseHue, x, y);

            case this.modes.COMPLEMENTARY:
                return this.complementaryColor(baseHue, x);

            case this.modes.ANALOGOUS:
                return this.analogousColor(baseHue, x);

            case this.modes.PALETTE:
                return this.paletteColor(x, y, time);

            case this.modes.GRADIENT:
                return this.gradientColor(x, y, time);

            case this.modes.REACTIVE:
                return this.audioReactiveColor(baseHue, audioData);

            default:
                return this.singleHueColor(baseHue);
        }
    }

    /**
     * Single hue mode (current behavior)
     */
    singleHueColor(hue) {
        return this.hsvToRgb(hue, 0.8, 0.9);
    }

    /**
     * Dual hue - two colors alternating
     */
    dualHueColor(baseHue, x) {
        const hue2 = (baseHue + 180) % 360;
        const hue = x > 0.5 ? hue2 : baseHue;
        return this.hsvToRgb(hue, 0.8, 0.9);
    }

    /**
     * Triad - three colors 120° apart
     */
    triadColor(baseHue, x, y) {
        const hues = [
            baseHue,
            (baseHue + 120) % 360,
            (baseHue + 240) % 360
        ];
        const index = Math.floor((x + y) * 1.5) % 3;
        return this.hsvToRgb(hues[index], 0.8, 0.9);
    }

    /**
     * Complementary - opposite colors
     */
    complementaryColor(baseHue, x) {
        const hue = x > 0.5 ? (baseHue + 180) % 360 : baseHue;
        return this.hsvToRgb(hue, 0.8, 0.9);
    }

    /**
     * Analogous - adjacent colors
     */
    analogousColor(baseHue, x) {
        const offset = (x - 0.5) * 60; // ±30°
        const hue = (baseHue + offset + 360) % 360;
        return this.hsvToRgb(hue, 0.8, 0.9);
    }

    /**
     * Palette mode - cycle through predefined colors
     */
    paletteColor(x, y, time) {
        const palette = this.palettes[this.currentPalette];
        const index = Math.floor((x + y + time * 0.1) * palette.length) % palette.length;
        return palette[index];
    }

    /**
     * Gradient mode - smooth color transitions
     */
    gradientColor(x, y, time) {
        const palette = this.palettes[this.currentPalette];

        let t = 0;
        switch(this.currentGradientType) {
            case this.gradientTypes.HORIZONTAL:
                t = x + this.gradientPhase;
                break;
            case this.gradientTypes.VERTICAL:
                t = y + this.gradientPhase;
                break;
            case this.gradientTypes.RADIAL:
                t = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2)) * 2 + this.gradientPhase;
                break;
            case this.gradientTypes.SPIRAL:
                const angle = Math.atan2(y - 0.5, x - 0.5);
                const radius = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
                t = (angle / (Math.PI * 2) + radius) + this.gradientPhase;
                break;
            case this.gradientTypes.WAVE:
                t = (Math.sin(x * Math.PI * 4 + time) + Math.cos(y * Math.PI * 4 + time)) * 0.5 + 0.5 + this.gradientPhase;
                break;
        }

        t = (t % 1 + 1) % 1; // Normalize to 0-1

        // Interpolate between palette colors
        const colorIndex = t * (palette.length - 1);
        const index1 = Math.floor(colorIndex);
        const index2 = (index1 + 1) % palette.length;
        const mix = colorIndex - index1;

        const color1 = palette[index1];
        const color2 = palette[index2];

        return {
            r: Math.round(color1.r + (color2.r - color1.r) * mix),
            g: Math.round(color1.g + (color2.g - color1.g) * mix),
            b: Math.round(color1.b + (color2.b - color1.b) * mix)
        };
    }

    /**
     * Audio-reactive color
     */
    audioReactiveColor(baseHue, audioData) {
        if (!audioData) {
            return this.singleHueColor(baseHue);
        }

        // Hue from spectral centroid (brightness of sound)
        const hue = audioData.spectralCentroid * 360;

        // Saturation from spectral flux (energy change)
        const saturation = 0.5 + (audioData.spectralFlux * 0.5);

        // Value from RMS (loudness)
        const value = 0.5 + (audioData.rms * 0.5);

        return this.hsvToRgb(hue, saturation, value);
    }

    /**
     * Update gradient phase for animation
     */
    update(deltaTime) {
        this.gradientPhase += this.gradientSpeed * deltaTime * 0.001;
        this.gradientPhase = this.gradientPhase % 1;
    }

    /**
     * Set color mode
     */
    setMode(mode) {
        this.currentMode = mode;
    }

    /**
     * Set palette
     */
    setPalette(paletteName) {
        if (this.palettes[paletteName]) {
            this.currentPalette = paletteName;
        }
    }

    /**
     * Set gradient type
     */
    setGradientType(type) {
        this.currentGradientType = type;
    }

    /**
     * Set gradient speed
     */
    setGradientSpeed(speed) {
        this.gradientSpeed = speed;
    }

    /**
     * HSV to RGB conversion
     */
    hsvToRgb(h, s, v) {
        h = h / 60;
        const c = v * s;
        const x = c * (1 - Math.abs((h % 2) - 1));
        const m = v - c;

        let r, g, b;
        if (h < 1) {
            [r, g, b] = [c, x, 0];
        } else if (h < 2) {
            [r, g, b] = [x, c, 0];
        } else if (h < 3) {
            [r, g, b] = [0, c, x];
        } else if (h < 4) {
            [r, g, b] = [0, x, c];
        } else if (h < 5) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    /**
     * Get palette as vec3 array for GLSL
     */
    getPaletteForShader() {
        const palette = this.palettes[this.currentPalette];
        return palette.map(color => [
            color.r / 255,
            color.g / 255,
            color.b / 255
        ]);
    }

    /**
     * Get available palettes
     */
    getPaletteNames() {
        return Object.keys(this.palettes);
    }
}
