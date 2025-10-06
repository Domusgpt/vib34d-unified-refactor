/**
 * TouchpadControl - XY Parameter Control System
 *
 * Features:
 * - Map any two parameters to X/Y axes
 * - Visual feedback with trails and indicators
 * - Touch and mouse support
 * - Snap-to-grid option
 * - Preset positions
 * - Value display and bounds
 * - Smooth interpolation
 * - Audio-reactive modulation
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class TouchpadControl {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container ${containerId} not found`);
        }

        // Options
        this.width = options.width || 300;
        this.height = options.height || 300;
        this.xParam = options.xParam || 'rot4dXW';
        this.yParam = options.yParam || 'rot4dYW';
        this.xLabel = options.xLabel || this.xParam;
        this.yLabel = options.yLabel || this.yParam;
        this.xMin = options.xMin || 0;
        this.xMax = options.xMax || 1;
        this.yMin = options.yMin || 0;
        this.yMax = options.yMax || 1;
        this.snapToGrid = options.snapToGrid || false;
        this.gridSize = options.gridSize || 10;
        this.showTrail = options.showTrail !== undefined ? options.showTrail : true;
        this.trailLength = options.trailLength || 20;

        // State
        this.x = 0.5; // Normalized 0-1
        this.y = 0.5;
        this.isActive = false;
        this.trail = [];

        // Audio reactivity
        this.audioReactive = false;
        this.audioModulationX = 0;
        this.audioModulationY = 0;
        this.audioStrength = 0.3;

        // Callbacks
        this.onChange = options.onChange || null;

        // Preset positions
        this.presets = options.presets || {
            'Center': { x: 0.5, y: 0.5 },
            'Top Left': { x: 0, y: 1 },
            'Top Right': { x: 1, y: 1 },
            'Bottom Left': { x: 0, y: 0 },
            'Bottom Right': { x: 1, y: 0 }
        };

        this.init();
    }

    init() {
        this.createUI();
        this.attachEventListeners();
        this.render();
    }

    createUI() {
        this.container.innerHTML = `
            <div class="touchpad-wrapper" style="
                width: ${this.width}px;
                background: rgba(0, 20, 40, 0.8);
                border: 2px solid #0ff;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            ">
                <!-- Header -->
                <div class="touchpad-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    color: #0ff;
                    font-size: 14px;
                    font-weight: 600;
                ">
                    <span>XY Control</span>
                    <button id="touchpadAudioToggle" style="
                        background: rgba(0, 255, 255, 0.1);
                        border: 1px solid #0ff;
                        color: #0ff;
                        padding: 4px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                        transition: all 0.3s;
                    ">🎵 Audio</button>
                </div>

                <!-- Canvas -->
                <div style="position: relative;">
                    <canvas id="touchpadCanvas" width="${this.width - 30}" height="${this.height - 30}" style="
                        display: block;
                        background: rgba(0, 10, 20, 0.9);
                        border: 1px solid #0ff;
                        border-radius: 8px;
                        cursor: crosshair;
                        box-shadow: inset 0 0 20px rgba(0, 255, 255, 0.1);
                    "></canvas>

                    <!-- Value displays -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        background: rgba(0, 0, 0, 0.7);
                        color: #0ff;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 11px;
                        font-family: 'Courier New', monospace;
                    ">
                        <div id="touchpadXValue">X: 0.50</div>
                        <div id="touchpadYValue">Y: 0.50</div>
                    </div>
                </div>

                <!-- Axis labels -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    color: #00ffaa;
                    font-size: 12px;
                ">
                    <span>← ${this.xLabel} →</span>
                    <span>↓ ${this.yLabel} ↑</span>
                </div>

                <!-- Presets -->
                <div class="touchpad-presets" style="
                    display: flex;
                    gap: 5px;
                    margin-top: 10px;
                    flex-wrap: wrap;
                ">
                    ${Object.keys(this.presets).map(name => `
                        <button class="preset-btn" data-preset="${name}" style="
                            background: rgba(0, 255, 255, 0.1);
                            border: 1px solid #0ff;
                            color: #0ff;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 10px;
                            transition: all 0.3s;
                        ">${name}</button>
                    `).join('')}
                </div>

                <!-- Snap toggle -->
                <div style="
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #00ffaa;
                    font-size: 12px;
                ">
                    <input type="checkbox" id="touchpadSnapGrid" ${this.snapToGrid ? 'checked' : ''} style="
                        cursor: pointer;
                        accent-color: #0ff;
                    ">
                    <label for="touchpadSnapGrid" style="cursor: pointer;">Snap to Grid (${this.gridSize}x${this.gridSize})</label>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('touchpadCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.xValueDisplay = document.getElementById('touchpadXValue');
        this.yValueDisplay = document.getElementById('touchpadYValue');
        this.audioToggleBtn = document.getElementById('touchpadAudioToggle');
        this.snapCheckbox = document.getElementById('touchpadSnapGrid');
    }

    attachEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleEnd());
        this.canvas.addEventListener('mouseleave', () => this.handleEnd());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleStart(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.handleEnd());

        // Audio toggle
        this.audioToggleBtn.addEventListener('click', () => {
            this.audioReactive = !this.audioReactive;
            this.audioToggleBtn.style.background = this.audioReactive ?
                'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.1)';
            this.audioToggleBtn.textContent = this.audioReactive ? '🎵 Audio ON' : '🎵 Audio OFF';
        });

        // Snap toggle
        this.snapCheckbox.addEventListener('change', (e) => {
            this.snapToGrid = e.target.checked;
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetName = e.target.dataset.preset;
                this.loadPreset(presetName);
            });

            // Hover effect
            btn.addEventListener('mouseenter', (e) => {
                e.target.style.background = 'rgba(0, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.background = 'rgba(0, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
            });
        });
    }

    handleStart(e) {
        this.isActive = true;
        this.updatePosition(e);
    }

    handleMove(e) {
        if (!this.isActive) return;
        this.updatePosition(e);
    }

    handleEnd() {
        this.isActive = false;
    }

    updatePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width;
        let y = 1 - (e.clientY - rect.top) / rect.height; // Flip Y

        // Clamp to 0-1
        x = Math.max(0, Math.min(1, x));
        y = Math.max(0, Math.min(1, y));

        // Snap to grid if enabled
        if (this.snapToGrid) {
            x = Math.round(x * this.gridSize) / this.gridSize;
            y = Math.round(y * this.gridSize) / this.gridSize;
        }

        this.x = x;
        this.y = y;

        // Add to trail
        if (this.showTrail) {
            this.trail.push({ x, y });
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }
        }

        this.render();
        this.emitChange();
    }

    loadPreset(name) {
        const preset = this.presets[name];
        if (!preset) return;

        this.x = preset.x;
        this.y = preset.y;
        this.trail = [];

        this.render();
        this.emitChange();
    }

    /**
     * Update from audio analysis
     */
    updateFromAudio(audioData) {
        if (!this.audioReactive) return;

        // Modulate X with bass/mid content
        this.audioModulationX = (audioData.bands?.bass?.value || 0) * this.audioStrength;

        // Modulate Y with high/air content
        this.audioModulationY = (audioData.bands?.high?.value || 0) * this.audioStrength;

        this.render();
        this.emitChange();
    }

    emitChange() {
        if (!this.onChange) return;

        // Calculate actual parameter values (with audio modulation)
        const xValue = this.denormalize(this.x + this.audioModulationX, this.xMin, this.xMax);
        const yValue = this.denormalize(this.y + this.audioModulationY, this.yMin, this.yMax);

        this.onChange({
            [this.xParam]: xValue,
            [this.yParam]: yValue,
            xNormalized: this.x,
            yNormalized: this.y,
            audioModX: this.audioModulationX,
            audioModY: this.audioModulationY
        });

        // Update value displays
        this.xValueDisplay.textContent = `X: ${xValue.toFixed(2)}`;
        this.yValueDisplay.textContent = `Y: ${yValue.toFixed(2)}`;
    }

    denormalize(value, min, max) {
        return min + value * (max - min);
    }

    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Clear
        this.ctx.clearRect(0, 0, w, h);

        // Draw grid
        this.drawGrid();

        // Draw trail
        if (this.showTrail && this.trail.length > 1) {
            this.drawTrail();
        }

        // Draw crosshair at center
        this.drawCrosshair(w / 2, h / 2, 'rgba(0, 255, 255, 0.2)', 20);

        // Draw current position
        const effectiveX = this.x + this.audioModulationX;
        const effectiveY = this.y + this.audioModulationY;
        const screenX = effectiveX * w;
        const screenY = (1 - effectiveY) * h;

        // Glow effect
        const gradient = this.ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 20);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(screenX - 20, screenY - 20, 40, 40);

        // Indicator circle
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0ff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00ffaa';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Audio modulation indicator
        if (this.audioReactive && (this.audioModulationX !== 0 || this.audioModulationY !== 0)) {
            // Draw line from base position to modulated position
            const baseX = this.x * w;
            const baseY = (1 - this.y) * h;

            this.ctx.beginPath();
            this.ctx.moveTo(baseX, baseY);
            this.ctx.lineTo(screenX, screenY);
            this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Base position indicator
            this.ctx.beginPath();
            this.ctx.arc(baseX, baseY, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.fill();
        }
    }

    drawGrid() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= this.gridSize; i++) {
            const x = (i / this.gridSize) * w;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, h);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= this.gridSize; i++) {
            const y = (i / this.gridSize) * h;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(w, y);
            this.ctx.stroke();
        }
    }

    drawTrail() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.beginPath();
        this.trail.forEach((point, i) => {
            const x = point.x * w;
            const y = (1 - point.y) * h;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawCrosshair(x, y, color, size) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }

    /**
     * Set parameter mappings
     */
    setParameters(xParam, yParam, xLabel, yLabel, xMin, xMax, yMin, yMax) {
        this.xParam = xParam;
        this.yParam = yParam;
        this.xLabel = xLabel || xParam;
        this.yLabel = yLabel || yParam;
        this.xMin = xMin || 0;
        this.xMax = xMax || 1;
        this.yMin = yMin || 0;
        this.yMax = yMax || 1;

        // Update labels in UI
        this.container.querySelector('.touchpad-wrapper > div:nth-child(3)').innerHTML = `
            <span>← ${this.xLabel} →</span>
            <span>↓ ${this.yLabel} ↑</span>
        `;
    }

    /**
     * Get current values
     */
    getValues() {
        return {
            [this.xParam]: this.denormalize(this.x + this.audioModulationX, this.xMin, this.xMax),
            [this.yParam]: this.denormalize(this.y + this.audioModulationY, this.yMin, this.yMax)
        };
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.container.innerHTML = '';
    }
}
