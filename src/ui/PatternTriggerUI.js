/**
 * A Paul Phillips Manifestation
 * PatternTriggerUI - Quick pattern trigger buttons
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

export class PatternTriggerUI {
    constructor(performanceController) {
        this.performanceController = performanceController;
        this.createUI();
    }

    createUI() {
        const container = document.createElement('div');
        container.id = 'pattern-trigger-ui';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 20, 40, 0.95);
            border: 2px solid #ff00ff;
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            font-family: 'Orbitron', monospace;
            color: #ff00ff;
            max-width: 250px;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        `;

        // Hide on mobile by default - will be moved to sidebar
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768) {
            container.style.display = 'none';
        }

        const title = document.createElement('div');
        title.textContent = 'QUICK PATTERNS';
        title.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            border-bottom: 1px solid #ff00ff;
            padding-bottom: 5px;
        `;
        container.appendChild(title);

        // Pattern buttons
        const patterns = [
            { key: 'density_pulse', label: 'Density Pulse', emoji: '🌊' },
            { key: 'rotation_spin', label: 'Rotation Spin', emoji: '🌀' },
            { key: 'color_shift', label: 'Color Shift', emoji: '🌈' },
            { key: 'chaos_build', label: 'Chaos Build', emoji: '⚡' },
            { key: 'morph_wave', label: 'Morph Wave', emoji: '〰️' },
            { key: 'geometry_cycle', label: 'Geometry Cycle', emoji: '🔷' },
            { key: 'intensity_flash', label: 'Intensity Flash', emoji: '💥' },
            { key: 'saturation_drop', label: 'Saturation Drop', emoji: '🎨' },
            { key: 'rainbow_sweep', label: 'Rainbow Sweep', emoji: '🌟' },
            { key: 'hyperchaos', label: 'HYPERCHAOS', emoji: '💫' }
        ];

        patterns.forEach(pattern => {
            const button = document.createElement('button');
            button.innerHTML = `${pattern.emoji} ${pattern.label}`;
            button.style.cssText = `
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: rgba(255, 0, 255, 0.2);
                color: #ff00ff;
                border: 1px solid #ff00ff;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 10px;
                transition: all 0.3s;
                text-align: left;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 0, 255, 0.4)';
                button.style.transform = 'translateX(5px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 0, 255, 0.2)';
                button.style.transform = 'translateX(0)';
            });

            button.addEventListener('click', () => {
                this.performanceController.triggerPattern(pattern.key);
                this.flashButton(button);
            });

            container.appendChild(button);
        });

        // Divider
        const divider = document.createElement('div');
        divider.style.cssText = `
            height: 1px;
            background: rgba(255, 0, 255, 0.3);
            margin: 10px 0;
        `;
        container.appendChild(divider);

        // Choreography presets
        const presetsTitle = document.createElement('div');
        presetsTitle.textContent = 'CHOREOGRAPHY PRESETS';
        presetsTitle.style.cssText = `
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #00ffff;
        `;
        container.appendChild(presetsTitle);

        const presets = [
            { key: 'intro', label: 'Intro', emoji: '🌅' },
            { key: 'build', label: 'Build', emoji: '📈' },
            { key: 'drop', label: 'Drop', emoji: '💣' },
            { key: 'breakdown', label: 'Breakdown', emoji: '🎭' }
        ];

        presets.forEach(preset => {
            const button = document.createElement('button');
            button.innerHTML = `${preset.emoji} ${preset.label}`;
            button.style.cssText = `
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: rgba(0, 255, 255, 0.2);
                color: #00ffff;
                border: 1px solid #00ffff;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                font-size: 10px;
                transition: all 0.3s;
                text-align: left;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(0, 255, 255, 0.4)';
                button.style.transform = 'translateX(5px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(0, 255, 255, 0.2)';
                button.style.transform = 'translateX(0)';
            });

            button.addEventListener('click', () => {
                this.performanceController.loadChoreography(preset.key);
                this.flashButton(button);
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    flashButton(button) {
        const originalBg = button.style.background;
        const originalColor = button.style.color;

        button.style.background = button.style.color;
        button.style.color = '#000';

        setTimeout(() => {
            button.style.background = originalBg;
            button.style.color = originalColor;
        }, 200);
    }
}
