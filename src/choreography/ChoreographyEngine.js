/**
 * VIB34D Advanced Choreography Engine
 *
 * Evolved from alternative branch with:
 * - Timeline-based sequence system
 * - Beat-synced pattern modulation
 * - Live parameter mapping controls
 * - Preset choreography library
 * - AI choreography generation support
 * - Real-time audio reactivity overlay
 *
 * ARCHITECTURE:
 * Choreography Sets BASE VALUES → Audio MODULATES on top → Final Parameters
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class ChoreographyEngine {
    constructor(audioAnalyzer, systemRegistry) {
        this.audioAnalyzer = audioAnalyzer;
        this.systemRegistry = systemRegistry;

        // Timeline & Sequences
        this.sequences = [];
        this.currentSequence = null;
        this.currentSequenceIndex = -1;
        this.playbackTime = 0;
        this.duration = 0;

        // Beat tracking
        this.beatCount = 0;
        this.lastBeatTime = 0;
        this.bpm = 120;
        this.beatsPerMeasure = 4;

        // Base parameters (from choreography)
        this.baseParams = {
            geometry: 0,
            gridDensity: 15,
            morphFactor: 1.0,
            chaos: 0.2,
            speed: 1.0,
            hue: 200,
            intensity: 0.8,
            saturation: 0.8,
            rot4dXW: 0,
            rot4dYW: 0,
            rot4dZW: 0
        };

        // Audio reactivity mapping (user customizable)
        this.audioMapping = {
            gridDensity: { source: 'bass', amount: 40, mode: 'add' },
            morphFactor: { source: 'mid', amount: 0.6, mode: 'add' },
            chaos: { source: 'high', amount: 0.4, mode: 'add' },
            speed: { source: 'energy', amount: 0.8, mode: 'multiply' },
            intensity: { source: 'energy', amount: 0.5, mode: 'add' },
            saturation: { source: 'bass', amount: 0.4, mode: 'add' },
            rot4dXW: { source: 'bass', amount: 0.8, mode: 'oscillate' },
            rot4dYW: { source: 'mid', amount: 0.8, mode: 'oscillate' },
            rot4dZW: { source: 'high', amount: 0.8, mode: 'oscillate' },
            hue: { source: 'bass', amount: 30, mode: 'add' }
        };

        // Pattern library
        this.patterns = {
            density_pulse: this.createDensityPulse.bind(this),
            rotation_spin: this.createRotationSpin.bind(this),
            color_shift: this.createColorShift.bind(this),
            chaos_build: this.createChaosBuild.bind(this),
            morph_wave: this.createMorphWave.bind(this),
            geometry_cycle: this.createGeometryCycle.bind(this),
            intensity_flash: this.createIntensityFlash.bind(this),
            saturation_drop: this.createSaturationDrop.bind(this),
            rainbow_sweep: this.createRainbowSweep.bind(this),
            hyperchaos: this.createHyperChaos.bind(this)
        };

        // Callbacks
        this.onParameterChange = null;
        this.onSequenceChange = null;
        this.onBeat = null;
    }

    /**
     * Load choreography sequences
     */
    loadSequences(sequences) {
        this.sequences = sequences.map(seq => this.validateSequence(seq));
        console.log(`🎬 Loaded ${this.sequences.length} choreography sequences`);

        if (this.sequences.length > 0) {
            this.duration = Math.max(...this.sequences.map(s => s.time + s.duration));
        }
    }

    /**
     * Validate and normalize sequence
     */
    validateSequence(seq) {
        return {
            time: seq.time || 0,
            duration: seq.duration || 10,
            system: seq.system || 'faceted',
            parameters: seq.parameters || {},
            patterns: seq.patterns || [],
            beatSync: seq.beatSync || {},
            transitions: seq.transitions || [],
            ...seq
        };
    }

    /**
     * Update choreography (call every frame)
     */
    update(currentTime, audioData) {
        this.playbackTime = currentTime;

        // Find active sequence
        const sequence = this.findActiveSequence(currentTime);

        if (sequence !== this.currentSequence) {
            this.onSequenceChanged(sequence);
            this.currentSequence = sequence;
        }

        // Update base parameters from sequence
        if (sequence) {
            this.updateBaseParameters(sequence, currentTime, audioData);
        }

        // Detect beats
        if (audioData && audioData.onset && audioData.onset.detected) {
            this.onBeatDetected(audioData);
        }

        // Apply audio reactivity modulation
        const finalParams = this.applyAudioModulation(this.baseParams, audioData, currentTime);

        // Emit parameter changes
        if (this.onParameterChange) {
            this.onParameterChange(finalParams);
        }

        return finalParams;
    }

    /**
     * Find sequence active at given time
     */
    findActiveSequence(time) {
        for (const seq of this.sequences) {
            if (time >= seq.time && time < seq.time + seq.duration) {
                return seq;
            }
        }
        return null;
    }

    /**
     * Update base parameters from sequence choreography
     */
    updateBaseParameters(sequence, currentTime, audioData) {
        const progress = (currentTime - sequence.time) / sequence.duration;

        // Set base parameters from sequence
        Object.assign(this.baseParams, sequence.parameters);

        // Apply patterns
        if (sequence.patterns) {
            sequence.patterns.forEach(pattern => {
                this.applyPattern(pattern, progress, currentTime);
            });
        }

        // Apply beat-synced modulation
        if (sequence.beatSync) {
            this.applyBeatSync(sequence.beatSync, audioData);
        }

        // Apply transitions
        if (sequence.transitions) {
            sequence.transitions.forEach(transition => {
                this.applyTransition(transition, currentTime, sequence);
            });
        }
    }

    /**
     * Apply pattern to base parameters
     */
    applyPattern(pattern, progress, currentTime) {
        const patternFunc = this.patterns[pattern.type];
        if (patternFunc) {
            const modulation = patternFunc(progress, currentTime, pattern.config || {});
            Object.assign(this.baseParams, modulation);
        }
    }

    /**
     * Apply beat-synced modulation
     */
    applyBeatSync(beatSync, audioData) {
        if (!audioData) return;

        const beat = audioData.onset?.detected || false;

        // Hue snap - change hue on beat
        if (beatSync.hueSnap && beat) {
            const hues = beatSync.hueSnap;
            const idx = this.beatCount % hues.length;
            this.baseParams.hue = hues[idx];
        }

        // Saturation snap - rhythmic saturation
        if (beatSync.saturationSnap && beat) {
            const saturations = beatSync.saturationSnap;
            const idx = this.beatCount % saturations.length;
            this.baseParams.saturation = saturations[idx];
        }

        // Geometry measures - change on measure boundaries
        if (beatSync.geometryMeasures && beat && this.beatCount % this.beatsPerMeasure === 0) {
            const geometries = beatSync.geometryMeasures;
            const measureIdx = Math.floor(this.beatCount / this.beatsPerMeasure) % geometries.length;
            this.baseParams.geometry = geometries[measureIdx];
        }

        // Density pulse - add density on beat
        if (beatSync.densityPulse && beat) {
            this.baseParams.gridDensity += beatSync.densityPulse;
        }

        // Chaos bump - add chaos on beat
        if (beatSync.chaosBump && beat) {
            this.baseParams.chaos = Math.min(1, this.baseParams.chaos + beatSync.chaosBump);
        }

        // Intensity flash - flash on beat
        if (beatSync.intensityFlash && beat) {
            this.baseParams.intensity = Math.min(1, this.baseParams.intensity + beatSync.intensityFlash);
        }
    }

    /**
     * Apply transition (mid-sequence system switch, parameter interpolation)
     */
    applyTransition(transition, currentTime, sequence) {
        const transitionTime = sequence.time + transition.at;
        const transitionDuration = transition.duration || 0.5;

        if (currentTime >= transitionTime && currentTime < transitionTime + transitionDuration) {
            const progress = (currentTime - transitionTime) / transitionDuration;

            // System switch
            if (transition.to && transition.to !== this.systemRegistry.activeSystem) {
                this.systemRegistry.switchTo(transition.to);
            }

            // Parameter interpolation
            if (transition.parameters) {
                Object.entries(transition.parameters).forEach(([param, targetValue]) => {
                    const currentValue = this.baseParams[param];
                    this.baseParams[param] = currentValue + (targetValue - currentValue) * progress;
                });
            }
        }
    }

    /**
     * Apply audio reactivity modulation on top of base parameters
     */
    applyAudioModulation(baseParams, audioData, currentTime) {
        if (!audioData) return { ...baseParams };

        const final = { ...baseParams };

        // Get audio features
        const bass = audioData.bands?.bass?.value || 0;
        const mid = audioData.bands?.mid?.value || 0;
        const high = audioData.bands?.high?.value || 0;
        const energy = audioData.rms || 0;
        const centroid = audioData.spectralCentroid || 0;

        const audioSources = { bass, mid, high, energy, centroid };

        // Apply each mapping
        Object.entries(this.audioMapping).forEach(([param, mapping]) => {
            if (!mapping.enabled && mapping.enabled !== undefined) return;

            const sourceValue = audioSources[mapping.source] || 0;
            const baseValue = baseParams[param];

            switch (mapping.mode) {
                case 'add':
                    // Add centered around 0.5
                    final[param] = baseValue + (sourceValue - 0.5) * mapping.amount;
                    break;

                case 'multiply':
                    // Multiply by (1 + variation)
                    final[param] = baseValue * (1 + (sourceValue - 0.5) * mapping.amount);
                    break;

                case 'oscillate':
                    // Oscillate with audio + time
                    final[param] = baseValue + Math.sin(currentTime * 0.5 + sourceValue * Math.PI * 2) * mapping.amount;
                    break;

                case 'replace':
                    // Direct replacement
                    final[param] = sourceValue * mapping.amount;
                    break;
            }

            // Clamp to valid ranges
            final[param] = this.clampParameter(param, final[param]);
        });

        return final;
    }

    /**
     * Clamp parameter to valid range
     */
    clampParameter(param, value) {
        const ranges = {
            geometry: { min: 0, max: 7 },
            gridDensity: { min: 5, max: 100 },
            morphFactor: { min: 0, max: 2 },
            chaos: { min: 0, max: 1 },
            speed: { min: 0.1, max: 3 },
            hue: { min: 0, max: 360 },
            intensity: { min: 0, max: 1 },
            saturation: { min: 0, max: 1 },
            rot4dXW: { min: -6.28, max: 6.28 },
            rot4dYW: { min: -6.28, max: 6.28 },
            rot4dZW: { min: -6.28, max: 6.28 }
        };

        if (ranges[param]) {
            value = Math.max(ranges[param].min, Math.min(ranges[param].max, value));
        }

        // Handle wrapping for hue
        if (param === 'hue') {
            value = ((value % 360) + 360) % 360;
        }

        return value;
    }

    /**
     * Beat detection callback
     */
    onBeatDetected(audioData) {
        this.beatCount++;
        this.lastBeatTime = this.playbackTime;

        // Estimate BPM
        if (audioData.bpm) {
            this.bpm = audioData.bpm;
        }

        if (this.onBeat) {
            this.onBeat(this.beatCount, this.bpm);
        }
    }

    /**
     * Sequence change callback
     */
    onSequenceChanged(newSequence) {
        if (this.onSequenceChange) {
            this.onSequenceChange(newSequence);
        }

        // System switch if needed
        if (newSequence && newSequence.system) {
            this.systemRegistry.switchTo(newSequence.system);
        }
    }

    /**
     * Set audio reactivity mapping for a parameter
     */
    setAudioMapping(parameter, source, amount, mode = 'add', enabled = true) {
        this.audioMapping[parameter] = { source, amount, mode, enabled };
        console.log(`🎛️ Audio mapping: ${parameter} ← ${source} (${mode}, ${amount})`);
    }

    /**
     * Enable/disable audio reactivity for a parameter
     */
    toggleAudioReactivity(parameter, enabled) {
        if (this.audioMapping[parameter]) {
            this.audioMapping[parameter].enabled = enabled;
        }
    }

    // ============================================
    // PATTERN LIBRARY
    // ============================================

    createDensityPulse(progress, time, config = {}) {
        const frequency = config.frequency || 4;
        const amplitude = config.amplitude || 40;
        return {
            gridDensity: this.baseParams.gridDensity + Math.sin(progress * Math.PI * frequency) * amplitude
        };
    }

    createRotationSpin(progress, time, config = {}) {
        const speed = config.speed || 1;
        return {
            rot4dXW: progress * Math.PI * 4 * speed,
            rot4dYW: progress * Math.PI * 3 * speed,
            rot4dZW: progress * Math.PI * 5 * speed
        };
    }

    createColorShift(progress, time, config = {}) {
        const amount = config.amount || 180;
        return {
            hue: (this.baseParams.hue + progress * amount) % 360
        };
    }

    createChaosBuild(progress, time, config = {}) {
        const amount = config.amount || 0.8;
        return {
            chaos: Math.min(1, this.baseParams.chaos + progress * amount)
        };
    }

    createMorphWave(progress, time, config = {}) {
        const frequency = config.frequency || 2;
        const amplitude = config.amplitude || 0.9;
        return {
            morphFactor: this.baseParams.morphFactor + Math.sin(progress * Math.PI * frequency) * amplitude
        };
    }

    createGeometryCycle(progress, time, config = {}) {
        const count = config.count || 8;
        const interval = config.interval || 2; // seconds
        const idx = Math.floor((time % (count * interval)) / interval);
        return {
            geometry: idx % count
        };
    }

    createIntensityFlash(progress, time, config = {}) {
        const frequency = config.frequency || 8;
        return {
            intensity: Math.min(1, this.baseParams.intensity + Math.abs(Math.sin(progress * Math.PI * frequency)) * 0.3)
        };
    }

    createSaturationDrop(progress, time, config = {}) {
        const dropPoint = config.dropPoint || 0.5;
        const recovery = config.recovery || 0.3;

        if (progress < dropPoint) {
            return {};
        } else if (progress < dropPoint + recovery) {
            const dropProgress = (progress - dropPoint) / recovery;
            return {
                saturation: dropProgress * this.baseParams.saturation
            };
        }
        return {};
    }

    createRainbowSweep(progress, time, config = {}) {
        const speed = config.speed || 360; // degrees per full duration
        return {
            hue: (progress * speed) % 360
        };
    }

    createHyperChaos(progress, time, config = {}) {
        const baseIntensity = config.intensity || 0.5;
        return {
            chaos: baseIntensity + Math.random() * (1 - baseIntensity),
            rot4dXW: Math.sin(time * 5 + Math.random()) * Math.PI,
            rot4dYW: Math.cos(time * 7 + Math.random()) * Math.PI,
            rot4dZW: Math.sin(time * 11 + Math.random()) * Math.PI
        };
    }

    /**
     * Get preset choreographies
     */
    static getPresets() {
        return {
            intro: {
                name: 'Gentle Intro',
                sequences: [
                    {
                        time: 0,
                        duration: 15,
                        system: 'faceted',
                        parameters: { chaos: 0.1, speed: 0.5, hue: 200 },
                        patterns: [
                            { type: 'geometry_cycle', config: { count: 8, interval: 2 } },
                            { type: 'color_shift', config: { amount: 60 } }
                        ]
                    }
                ]
            },

            build: {
                name: 'Energy Build',
                sequences: [
                    {
                        time: 0,
                        duration: 15,
                        system: 'faceted',
                        parameters: { chaos: 0.3, speed: 1.0, hue: 180 },
                        patterns: [
                            { type: 'chaos_build', config: { amount: 0.5 } },
                            { type: 'rotation_spin', config: { speed: 0.5 } }
                        ],
                        beatSync: {
                            densityPulse: 10,
                            intensityFlash: 0.2
                        }
                    }
                ]
            },

            drop: {
                name: 'Maximum Drop',
                sequences: [
                    {
                        time: 0,
                        duration: 20,
                        system: 'quantum',
                        parameters: { chaos: 0.8, speed: 2.0, hue: 300 },
                        patterns: [
                            { type: 'hyperchaos', config: { intensity: 0.7 } },
                            { type: 'rainbow_sweep', config: { speed: 720 } }
                        ],
                        beatSync: {
                            hueSnap: [300, 330, 0, 30],
                            geometryMeasures: [0, 2, 4, 6],
                            chaosBump: 0.1
                        }
                    }
                ]
            },

            breakdown: {
                name: 'Minimal Breakdown',
                sequences: [
                    {
                        time: 0,
                        duration: 15,
                        system: 'holographic',
                        parameters: { chaos: 0.05, speed: 0.3, hue: 180 },
                        patterns: [
                            { type: 'morph_wave', config: { frequency: 1, amplitude: 0.3 } }
                        ]
                    }
                ]
            }
        };
    }
}
