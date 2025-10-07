/**
 * A Paul Phillips Manifestation
 * ReactivityFormatSwitcher - Live audio reactivity format presets
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

export class ReactivityFormatSwitcher {
    constructor() {
        this.currentFormat = 'balanced';

        // Audio reactivity format presets
        this.formats = {
            // Balanced - subtle reactivity across all parameters
            balanced: {
                name: 'Balanced',
                description: 'Subtle, musical reactivity',
                mappings: {
                    gridDensity: { source: 'bass', amount: 20, mode: 'add' },
                    morphFactor: { source: 'mid', amount: 0.3, mode: 'add' },
                    chaos: { source: 'high', amount: 0.2, mode: 'add' },
                    speed: { source: 'energy', amount: 0.5, mode: 'multiply' },
                    hue: { source: 'centroid', amount: 30, mode: 'add' },
                    saturation: { source: 'energy', amount: 0.2, mode: 'add' },
                    intensity: { source: 'rms', amount: 0.3, mode: 'multiply' }
                }
            },

            // Bass Heavy - density and geometry react to bass
            bassHeavy: {
                name: 'Bass Heavy',
                description: 'Density pulses with bass',
                mappings: {
                    gridDensity: { source: 'bass', amount: 50, mode: 'add' },
                    morphFactor: { source: 'bass', amount: 0.8, mode: 'add' },
                    chaos: { source: 'mid', amount: 0.3, mode: 'add' },
                    speed: { source: 'bass', amount: 1.0, mode: 'multiply' },
                    hue: { source: 'bass', amount: 60, mode: 'oscillate' },
                    saturation: { source: 'energy', amount: 0.3, mode: 'add' },
                    intensity: { source: 'bass', amount: 0.5, mode: 'multiply' },
                    rot4dXW: { source: 'bass', amount: 2.0, mode: 'add' }
                }
            },

            // High Energy - chaos and color react to highs
            highEnergy: {
                name: 'High Energy',
                description: 'Chaos driven by treble',
                mappings: {
                    gridDensity: { source: 'high', amount: 40, mode: 'add' },
                    morphFactor: { source: 'high', amount: 0.6, mode: 'add' },
                    chaos: { source: 'high', amount: 0.7, mode: 'add' },
                    speed: { source: 'high', amount: 1.2, mode: 'multiply' },
                    hue: { source: 'high', amount: 120, mode: 'add' },
                    saturation: { source: 'high', amount: 0.4, mode: 'add' },
                    intensity: { source: 'high', amount: 0.6, mode: 'multiply' },
                    rot4dYW: { source: 'high', amount: 3.0, mode: 'add' }
                }
            },

            // Mid Focus - vocals and melody
            midFocus: {
                name: 'Mid Focus',
                description: 'Responds to vocals/melody',
                mappings: {
                    gridDensity: { source: 'mid', amount: 30, mode: 'add' },
                    morphFactor: { source: 'mid', amount: 1.0, mode: 'add' },
                    chaos: { source: 'mid', amount: 0.4, mode: 'add' },
                    speed: { source: 'mid', amount: 0.8, mode: 'multiply' },
                    hue: { source: 'centroid', amount: 90, mode: 'add' },
                    saturation: { source: 'mid', amount: 0.5, mode: 'add' },
                    intensity: { source: 'mid', amount: 0.7, mode: 'multiply' },
                    rot4dZW: { source: 'mid', amount: 2.5, mode: 'oscillate' }
                }
            },

            // Minimal - very subtle reactivity
            minimal: {
                name: 'Minimal',
                description: 'Barely there, smooth',
                mappings: {
                    gridDensity: { source: 'energy', amount: 10, mode: 'add' },
                    morphFactor: { source: 'energy', amount: 0.15, mode: 'add' },
                    chaos: { source: 'energy', amount: 0.1, mode: 'add' },
                    speed: { source: 'energy', amount: 0.2, mode: 'multiply' },
                    hue: { source: 'centroid', amount: 15, mode: 'add' },
                    saturation: { source: 'energy', amount: 0.1, mode: 'add' },
                    intensity: { source: 'rms', amount: 0.15, mode: 'multiply' }
                }
            },

            // Explosive - maximum reactivity
            explosive: {
                name: 'Explosive',
                description: 'MAXIMUM CHAOS',
                mappings: {
                    gridDensity: { source: 'bass', amount: 80, mode: 'add' },
                    morphFactor: { source: 'energy', amount: 1.5, mode: 'add' },
                    chaos: { source: 'high', amount: 0.9, mode: 'add' },
                    speed: { source: 'energy', amount: 2.0, mode: 'multiply' },
                    hue: { source: 'energy', amount: 180, mode: 'oscillate' },
                    saturation: { source: 'energy', amount: 0.6, mode: 'add' },
                    intensity: { source: 'rms', amount: 0.8, mode: 'multiply' },
                    rot4dXW: { source: 'bass', amount: 4.0, mode: 'add' },
                    rot4dYW: { source: 'mid', amount: 4.0, mode: 'add' },
                    rot4dZW: { source: 'high', amount: 4.0, mode: 'add' }
                }
            },

            // Color Focused - hue/saturation driven
            colorFocused: {
                name: 'Color Focused',
                description: 'Rainbow waves',
                mappings: {
                    gridDensity: { source: 'energy', amount: 15, mode: 'add' },
                    morphFactor: { source: 'energy', amount: 0.2, mode: 'add' },
                    chaos: { source: 'energy', amount: 0.15, mode: 'add' },
                    speed: { source: 'energy', amount: 0.3, mode: 'multiply' },
                    hue: { source: 'centroid', amount: 180, mode: 'add' },
                    saturation: { source: 'energy', amount: 0.5, mode: 'oscillate' },
                    intensity: { source: 'rms', amount: 0.4, mode: 'multiply' }
                }
            },

            // Rotation Dance - 4D rotation driven
            rotationDance: {
                name: 'Rotation Dance',
                description: '4D spins and twists',
                mappings: {
                    gridDensity: { source: 'energy', amount: 20, mode: 'add' },
                    morphFactor: { source: 'energy', amount: 0.25, mode: 'add' },
                    chaos: { source: 'energy', amount: 0.2, mode: 'add' },
                    speed: { source: 'energy', amount: 0.4, mode: 'multiply' },
                    hue: { source: 'centroid', amount: 30, mode: 'add' },
                    rot4dXW: { source: 'bass', amount: 3.0, mode: 'add' },
                    rot4dYW: { source: 'mid', amount: 3.0, mode: 'add' },
                    rot4dZW: { source: 'high', amount: 3.0, mode: 'add' }
                }
            }
        };

        this.createUI();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'reactivity-format-switcher';
        container.style.cssText = `
            position: fixed;
            top: 90px;
            right: 380px;
            background: rgba(0, 20, 40, 0.9);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            font-family: 'Orbitron', monospace;
            color: #00ffff;
            max-width: 220px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        `;

        const title = document.createElement('div');
        title.textContent = 'AUDIO REACTIVITY';
        title.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            border-bottom: 1px solid #00ffff;
            padding-bottom: 5px;
        `;
        container.appendChild(title);

        // Create buttons for each format
        Object.entries(this.formats).forEach(([key, format]) => {
            const button = document.createElement('button');
            button.textContent = format.name;
            button.dataset.format = key;
            button.style.cssText = `
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: ${key === this.currentFormat ? '#00ffff' : 'rgba(0, 255, 255, 0.2)'};
                color: ${key === this.currentFormat ? '#000' : '#00ffff'};
                border: 1px solid #00ffff;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 11px;
                transition: all 0.3s;
            `;

            button.addEventListener('mouseenter', () => {
                if (key !== this.currentFormat) {
                    button.style.background = 'rgba(0, 255, 255, 0.4)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (key !== this.currentFormat) {
                    button.style.background = 'rgba(0, 255, 255, 0.2)';
                }
            });

            button.addEventListener('click', () => {
                this.switchFormat(key);
                this.updateUI();
            });

            const description = document.createElement('div');
            description.textContent = format.description;
            description.style.cssText = `
                font-size: 9px;
                color: rgba(0, 255, 255, 0.7);
                margin-top: 2px;
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(description);
            container.appendChild(buttonContainer);
        });

        document.body.appendChild(container);
    }

    switchFormat(formatKey) {
        if (!this.formats[formatKey]) return;

        this.currentFormat = formatKey;

        // Dispatch event with new mappings
        const event = new CustomEvent('reactivityFormatChanged', {
            detail: {
                format: formatKey,
                mappings: this.formats[formatKey].mappings
            }
        });
        window.dispatchEvent(event);
    }

    updateUI() {
        const buttons = document.querySelectorAll('#reactivity-format-switcher button');
        buttons.forEach(button => {
            const format = button.dataset.format;
            if (format === this.currentFormat) {
                button.style.background = '#00ffff';
                button.style.color = '#000';
            } else {
                button.style.background = 'rgba(0, 255, 255, 0.2)';
                button.style.color = '#00ffff';
            }
        });
    }

    getCurrentMappings() {
        return this.formats[this.currentFormat].mappings;
    }

    // Apply mappings to parameters based on audio data
    applyReactivity(baseParams, audioData) {
        const mappings = this.getCurrentMappings();
        const result = { ...baseParams };

        // Audio sources from analyzer
        const audioSources = {
            bass: audioData.bands?.bass?.value || 0,
            mid: audioData.bands?.mid?.value || 0,
            high: audioData.bands?.high?.value || 0,
            energy: audioData.energy || 0,
            rms: audioData.rms || 0,
            centroid: (audioData.spectralCentroid || 0) / 20000 // Normalize
        };

        Object.entries(mappings).forEach(([param, mapping]) => {
            const baseValue = baseParams[param] || 0;
            const sourceValue = audioSources[mapping.source] || 0;

            switch (mapping.mode) {
                case 'add':
                    result[param] = baseValue + (sourceValue - 0.5) * mapping.amount;
                    break;

                case 'multiply':
                    result[param] = baseValue * (1 + (sourceValue - 0.5) * mapping.amount);
                    break;

                case 'oscillate':
                    result[param] = baseValue + Math.sin(Date.now() * 0.001 + sourceValue * Math.PI * 2) * mapping.amount;
                    break;

                case 'replace':
                    result[param] = sourceValue * mapping.amount;
                    break;
            }
        });

        return result;
    }
}
