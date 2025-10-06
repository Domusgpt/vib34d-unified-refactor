/**
 * Gallery Manager - Preset Management System
 * Handles preset storage, loading, and gallery UI
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class GalleryManager {
    constructor(registry) {
        this.registry = registry;
        this.presets = this.getDefaultPresets();
        this.loadCustomPresets();
    }

    /**
     * Get default presets
     */
    getDefaultPresets() {
        return {
            'Cosmic Dance': {
                name: 'Cosmic Dance',
                description: '4D polytope rotation with reactive colors',
                system: 'polychora',
                parameters: {
                    rot4dXW: 0.5,
                    rot4dYW: 0.3,
                    rot4dZW: 0.2,
                    gridDensity: 50,
                    speed: 1.2,
                    hue: 280,
                    morph: 0.5,
                    chaos: 0.3
                },
                colorSystem: {
                    mode: 7, // REACTIVE
                    palette: null,
                    gradientType: 0
                },
                audioReactivity: 0.8,
                thumbnail: null
            },

            'Quantum Lattice': {
                name: 'Quantum Lattice',
                description: '3D volumetric effects with cyberpunk palette',
                system: 'quantum',
                parameters: {
                    gridDensity: 80,
                    speed: 0.8,
                    hue: 200,
                    morph: 0.6,
                    chaos: 0.6
                },
                colorSystem: {
                    mode: 5, // PALETTE
                    palette: 'cyberpunk',
                    gradientType: 0
                },
                audioReactivity: 0.9,
                thumbnail: null
            },

            'Holographic Dreams': {
                name: 'Holographic Dreams',
                description: 'Multi-layer shimmer with radial gradients',
                system: 'holographic',
                parameters: {
                    gridDensity: 60,
                    speed: 1.5,
                    hue: 180,
                    morph: 0.8,
                    chaos: 0.4
                },
                colorSystem: {
                    mode: 6, // GRADIENT
                    palette: null,
                    gradientType: 2 // RADIAL
                },
                audioReactivity: 0.7,
                thumbnail: null
            },

            'Vaporwave Aesthetic': {
                name: 'Vaporwave Aesthetic',
                description: 'Faceted patterns with vaporwave palette',
                system: 'faceted',
                parameters: {
                    gridDensity: 30,
                    speed: 1.0,
                    hue: 300,
                    morph: 0.5,
                    chaos: 0.2
                },
                colorSystem: {
                    mode: 5, // PALETTE
                    palette: 'vaporwave',
                    gradientType: 0
                },
                audioReactivity: 0.6,
                thumbnail: null
            },

            'Neon Pulse': {
                name: 'Neon Pulse',
                description: 'High reactivity with neon palette',
                system: 'holographic',
                parameters: {
                    gridDensity: 70,
                    speed: 2.0,
                    hue: 120,
                    morph: 0.7,
                    chaos: 0.5
                },
                colorSystem: {
                    mode: 5, // PALETTE
                    palette: 'neon',
                    gradientType: 0
                },
                audioReactivity: 1.0,
                thumbnail: null
            },

            'Minimal Geometry': {
                name: 'Minimal Geometry',
                description: 'Clean faceted patterns with single color',
                system: 'faceted',
                parameters: {
                    gridDensity: 15,
                    speed: 0.5,
                    hue: 200,
                    morph: 0.0,
                    chaos: 0.0
                },
                colorSystem: {
                    mode: 0, // SINGLE
                    palette: null,
                    gradientType: 0
                },
                audioReactivity: 0.3,
                thumbnail: null
            },

            'Fire Storm': {
                name: 'Fire Storm',
                description: 'Chaotic quantum with fire palette',
                system: 'quantum',
                parameters: {
                    gridDensity: 90,
                    speed: 2.5,
                    hue: 30,
                    morph: 0.9,
                    chaos: 0.8
                },
                colorSystem: {
                    mode: 5, // PALETTE
                    palette: 'fire',
                    gradientType: 0
                },
                audioReactivity: 0.95,
                thumbnail: null
            },

            'Ocean Waves': {
                name: 'Ocean Waves',
                description: 'Smooth 4D motion with ocean palette',
                system: 'polychora',
                parameters: {
                    rot4dXW: 0.2,
                    rot4dYW: 0.4,
                    rot4dZW: 0.1,
                    gridDensity: 40,
                    speed: 0.6,
                    hue: 200,
                    morph: 0.3,
                    chaos: 0.1
                },
                colorSystem: {
                    mode: 5, // PALETTE
                    palette: 'ocean',
                    gradientType: 0
                },
                audioReactivity: 0.5,
                thumbnail: null
            }
        };
    }

    /**
     * Load custom presets from localStorage
     */
    loadCustomPresets() {
        try {
            const stored = localStorage.getItem('vib34d-custom-presets');
            if (stored) {
                const custom = JSON.parse(stored);
                this.presets = { ...this.presets, ...custom };
                console.log(`✅ Loaded ${Object.keys(custom).length} custom presets`);
            }
        } catch (err) {
            console.error('Failed to load custom presets:', err);
        }
    }

    /**
     * Save custom preset
     */
    saveCustomPreset(name, description = '') {
        try {
            const system = this.registry.getCurrentSystem();
            const params = this.registry.getParameters();

            const preset = {
                name,
                description,
                system: system?.type || 'unknown',
                parameters: params,
                colorSystem: {
                    mode: system?.colorSystem?.getCurrentMode() || 0,
                    palette: system?.colorSystem?.getCurrentPalette() || null,
                    gradientType: system?.colorSystem?.gradientType || 0
                },
                audioReactivity: this.registry.getAudioReactivity(),
                timestamp: Date.now(),
                custom: true
            };

            // Add to presets
            this.presets[name] = preset;

            // Save to localStorage (only custom presets)
            this.saveCustomPresetsToStorage();

            console.log(`✅ Custom preset saved: ${name}`);
            return preset;

        } catch (err) {
            console.error('Failed to save preset:', err);
            throw err;
        }
    }

    /**
     * Save custom presets to localStorage
     */
    saveCustomPresetsToStorage() {
        const customPresets = {};
        Object.entries(this.presets).forEach(([key, preset]) => {
            if (preset.custom) {
                customPresets[key] = preset;
            }
        });

        localStorage.setItem('vib34d-custom-presets', JSON.stringify(customPresets));
    }

    /**
     * Load preset
     */
    async loadPreset(name) {
        try {
            const preset = this.presets[name];
            if (!preset) {
                throw new Error(`Preset not found: ${name}`);
            }

            // Switch to system
            if (preset.system) {
                await this.registry.switchTo(preset.system);
            }

            // Apply parameters
            if (preset.parameters) {
                Object.entries(preset.parameters).forEach(([key, value]) => {
                    this.registry.updateParameter(key, value);
                });
            }

            // Apply color system
            const system = this.registry.getCurrentSystem();
            if (system && preset.colorSystem) {
                if (preset.colorSystem.mode !== undefined) {
                    system.colorSystem.setMode(preset.colorSystem.mode);
                }
                if (preset.colorSystem.palette) {
                    system.colorSystem.setPalette(preset.colorSystem.palette);
                }
                if (preset.colorSystem.gradientType !== undefined) {
                    system.colorSystem.setGradientType(preset.colorSystem.gradientType);
                }
            }

            // Apply audio reactivity
            if (preset.audioReactivity !== undefined) {
                this.registry.setAudioReactivity(preset.audioReactivity);
            }

            console.log(`✅ Preset loaded: ${name}`);
            return preset;

        } catch (err) {
            console.error('Failed to load preset:', err);
            throw err;
        }
    }

    /**
     * Delete custom preset
     */
    deletePreset(name) {
        const preset = this.presets[name];
        if (!preset) {
            throw new Error(`Preset not found: ${name}`);
        }

        if (!preset.custom) {
            throw new Error('Cannot delete default preset');
        }

        delete this.presets[name];
        this.saveCustomPresetsToStorage();

        console.log(`✅ Preset deleted: ${name}`);
    }

    /**
     * Get all presets
     */
    getAllPresets() {
        return this.presets;
    }

    /**
     * Get preset by name
     */
    getPreset(name) {
        return this.presets[name] || null;
    }

    /**
     * Get default preset names
     */
    getDefaultPresetNames() {
        return Object.keys(this.presets).filter(name => !this.presets[name].custom);
    }

    /**
     * Get custom preset names
     */
    getCustomPresetNames() {
        return Object.keys(this.presets).filter(name => this.presets[name].custom);
    }

    /**
     * Export preset as JSON
     */
    exportPreset(name) {
        const preset = this.presets[name];
        if (!preset) {
            throw new Error(`Preset not found: ${name}`);
        }

        const json = JSON.stringify(preset, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `vib34d-preset-${name.replace(/\s+/g, '-').toLowerCase()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Import preset from JSON
     */
    async importPreset(file) {
        try {
            const text = await file.text();
            const preset = JSON.parse(text);

            // Add to custom presets
            preset.custom = true;
            preset.timestamp = Date.now();

            this.presets[preset.name] = preset;
            this.saveCustomPresetsToStorage();

            console.log(`✅ Preset imported: ${preset.name}`);
            return preset;

        } catch (err) {
            console.error('Failed to import preset:', err);
            throw err;
        }
    }

    /**
     * Generate thumbnail for preset (captures current frame)
     */
    async generateThumbnail(name, canvas) {
        try {
            const preset = this.presets[name];
            if (!preset) {
                throw new Error(`Preset not found: ${name}`);
            }

            // Capture frame as data URL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            preset.thumbnail = dataUrl;

            // Save if custom preset
            if (preset.custom) {
                this.saveCustomPresetsToStorage();
            }

            console.log(`✅ Thumbnail generated for: ${name}`);
            return dataUrl;

        } catch (err) {
            console.error('Failed to generate thumbnail:', err);
            throw err;
        }
    }
}
