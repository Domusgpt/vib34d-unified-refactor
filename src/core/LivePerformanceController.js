/**
 * A Paul Phillips Manifestation
 * LivePerformanceController - Unified controller integrating all live features
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

import { TouchpadController } from '../ui/TouchpadController.js';
import { ReactivityFormatSwitcher } from '../ui/ReactivityFormatSwitcher.js';
import { ParameterMappingUI } from '../ui/ParameterMappingUI.js';
import { ChoreographyEngine } from '../choreography/ChoreographyEngine.js';
import { PatternTriggerUI } from '../ui/PatternTriggerUI.js';

export class LivePerformanceController {
    constructor(systemRegistry, audioAnalyzer) {
        this.registry = systemRegistry;
        this.audioAnalyzer = audioAnalyzer;

        // Initialize all subsystems
        this.touchpadController = new TouchpadController();
        this.formatSwitcher = new ReactivityFormatSwitcher();
        this.mappingUI = new ParameterMappingUI(this.touchpadController);
        this.choreographyEngine = new ChoreographyEngine(audioAnalyzer, systemRegistry);

        // Performance mode state
        this.mode = 'touchpad'; // 'touchpad', 'choreography', 'hybrid'

        this.setupEventListeners();
        this.createModeSelector();

        // Add pattern trigger UI
        this.patternTriggerUI = new PatternTriggerUI(this);
    }

    createModeSelector() {
        const container = document.createElement('div');
        container.id = 'performance-mode-selector';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 20, 40, 0.95);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 10px 20px;
            z-index: 1000;
            font-family: 'Orbitron', monospace;
            color: #00ffff;
            display: flex;
            gap: 10px;
            align-items: center;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        `;

        const label = document.createElement('div');
        label.textContent = 'MODE:';
        label.style.cssText = `
            font-size: 12px;
            font-weight: bold;
            margin-right: 5px;
        `;

        const modes = [
            { key: 'touchpad', label: 'TOUCHPAD', desc: 'Manual XY control' },
            { key: 'choreography', label: 'CHOREOGRAPHY', desc: 'Timeline sequences' },
            { key: 'hybrid', label: 'HYBRID', desc: 'Choreography + Touchpads' }
        ];

        container.appendChild(label);

        modes.forEach(mode => {
            const button = document.createElement('button');
            button.textContent = mode.label;
            button.dataset.mode = mode.key;
            button.title = mode.desc;
            button.style.cssText = `
                padding: 8px 15px;
                background: ${mode.key === this.mode ? '#00ffff' : 'rgba(0, 255, 255, 0.2)'};
                color: ${mode.key === this.mode ? '#000' : '#00ffff'};
                border: 1px solid #00ffff;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 10px;
                font-weight: bold;
                transition: all 0.3s;
            `;

            button.addEventListener('click', () => {
                this.switchMode(mode.key);
                this.updateModeUI();
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    switchMode(mode) {
        this.mode = mode;
        console.log(`🎭 Performance mode: ${mode.toUpperCase()}`);

        // Enable/disable components based on mode
        switch (mode) {
            case 'touchpad':
                this.touchpadController.toggleTouchpad('primary', true);
                this.touchpadController.toggleTouchpad('secondary', true);
                // Touchpads control everything, audio reactivity modulates
                break;

            case 'choreography':
                this.touchpadController.toggleTouchpad('primary', false);
                this.touchpadController.toggleTouchpad('secondary', false);
                // Choreography engine controls everything
                break;

            case 'hybrid':
                this.touchpadController.toggleTouchpad('primary', true);
                this.touchpadController.toggleTouchpad('secondary', true);
                // Choreography sets base, touchpads override, audio modulates
                break;
        }
    }

    updateModeUI() {
        const buttons = document.querySelectorAll('#performance-mode-selector button');
        buttons.forEach(button => {
            const mode = button.dataset.mode;
            if (mode === this.mode) {
                button.style.background = '#00ffff';
                button.style.color = '#000';
            } else {
                button.style.background = 'rgba(0, 255, 255, 0.2)';
                button.style.color = '#00ffff';
            }
        });
    }

    setupEventListeners() {
        // Listen for reactivity format changes
        window.addEventListener('reactivityFormatChanged', (e) => {
            console.log('🎵 Reactivity format:', e.detail.format);
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            // 1, 2, 3 for modes
            if (e.key === '1') this.switchMode('touchpad');
            if (e.key === '2') this.switchMode('choreography');
            if (e.key === '3') this.switchMode('hybrid');

            // Space to toggle audio reactivity
            if (e.key === ' ') {
                e.preventDefault();
                // Cycle through reactivity formats
                const formats = Object.keys(this.formatSwitcher.formats);
                const currentIndex = formats.indexOf(this.formatSwitcher.currentFormat);
                const nextIndex = (currentIndex + 1) % formats.length;
                this.formatSwitcher.switchFormat(formats[nextIndex]);
                this.formatSwitcher.updateUI();
            }

            // R to reset touchpads to center
            if (e.key === 'r' || e.key === 'R') {
                this.touchpadController.primaryTouchpad.values = { x: 0.5, y: 0.5 };
                this.touchpadController.secondaryTouchpad.values = { x: 0.5, y: 0.5 };
            }
        });
    }

    // Main update loop - called every frame
    update(deltaTime) {
        let finalParams = {};

        // Get audio data
        const audioData = this.audioAnalyzer ? this.audioAnalyzer.analyze() : {};

        switch (this.mode) {
            case 'touchpad':
                // Touchpads set base, audio modulates
                const touchpadParams = this.touchpadController.getParameterValues();
                finalParams = this.formatSwitcher.applyReactivity(touchpadParams, audioData);
                break;

            case 'choreography':
                // Choreography engine controls everything
                finalParams = this.choreographyEngine.update(deltaTime, audioData);
                break;

            case 'hybrid':
                // Choreography sets base, touchpads override, audio modulates
                const choreographyParams = this.choreographyEngine.update(deltaTime, audioData);
                const touchpadOverrides = this.touchpadController.getParameterValues();

                // Merge: choreography base + touchpad overrides
                const mergedParams = { ...choreographyParams, ...touchpadOverrides };

                // Apply audio reactivity on top
                finalParams = this.formatSwitcher.applyReactivity(mergedParams, audioData);
                break;
        }

        return finalParams;
    }

    // Apply parameters to current system
    applyToCurrentSystem(params) {
        const currentSystem = this.registry.currentSystem;
        if (!currentSystem) return;

        // Apply each parameter
        Object.entries(params).forEach(([key, value]) => {
            if (currentSystem.params && currentSystem.params.hasOwnProperty(key)) {
                currentSystem.params[key] = value;
            }

            // Also try setting directly on the system
            if (currentSystem.hasOwnProperty(key)) {
                currentSystem[key] = value;
            }

            // For visualizers
            if (currentSystem.visualizer && currentSystem.visualizer.hasOwnProperty(key)) {
                currentSystem.visualizer[key] = value;
            }
        });
    }

    // Load a choreography preset
    loadChoreography(presetName) {
        const presets = ChoreographyEngine.getPresets();
        const preset = presets[presetName];

        if (preset) {
            this.choreographyEngine.loadSequences(preset.sequences);
            this.switchMode('choreography');
            this.updateModeUI();
            console.log(`🎬 Loaded choreography: ${presetName}`);
        }
    }

    // Quick access to patterns
    triggerPattern(patternName, duration = 4000) {
        const pattern = this.choreographyEngine.patterns[patternName];
        if (pattern) {
            const sequence = pattern(duration);
            this.choreographyEngine.sequences = [sequence];
            this.choreographyEngine.currentSequenceIndex = 0;
            this.choreographyEngine.playbackTime = 0;
            console.log(`🎨 Triggered pattern: ${patternName}`);
        }
    }
}
