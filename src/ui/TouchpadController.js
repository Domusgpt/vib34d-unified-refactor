/**
 * A Paul Phillips Manifestation
 * TouchpadController - XY touchpad overlays for live parameter control
 * Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Paul Phillips - Clear Seas Solutions LLC
 */

export class TouchpadController {
    constructor() {
        // Primary touchpad (overlaid on visualizer canvas)
        this.primaryTouchpad = {
            enabled: true,
            mappings: {
                x: 'gridDensity',  // Default: X controls density
                y: 'morphFactor'   // Default: Y controls morph
            },
            values: { x: 0.5, y: 0.5 },
            isDragging: false
        };

        // Secondary touchpad (separate UI element)
        this.secondaryTouchpad = {
            enabled: true,
            mappings: {
                x: 'hue',          // Default: X controls hue
                y: 'saturation'    // Default: Y controls saturation
            },
            values: { x: 0.5, y: 0.5 },
            isDragging: false
        };

        // Available parameters for mapping
        this.availableParams = [
            'gridDensity',
            'morphFactor',
            'chaos',
            'speed',
            'hue',
            'saturation',
            'intensity',
            'rot4dXW',
            'rot4dYW',
            'rot4dZW',
            'geometry' // Special: discrete values 0-7
        ];

        // Parameter ranges
        this.paramRanges = {
            gridDensity: { min: 5, max: 100 },
            morphFactor: { min: 0, max: 2 },
            chaos: { min: 0, max: 1 },
            speed: { min: 0.1, max: 3 },
            hue: { min: 0, max: 360 },
            saturation: { min: 0, max: 1 },
            intensity: { min: 0, max: 1 },
            rot4dXW: { min: -6.28, max: 6.28 },
            rot4dYW: { min: -6.28, max: 6.28 },
            rot4dZW: { min: -6.28, max: 6.28 },
            geometry: { min: 0, max: 7 }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Primary touchpad - overlay on main canvas
        const mainCanvas = document.getElementById('polychora-canvas') ||
                          document.getElementById('quantum-canvas') ||
                          document.getElementById('holographic-canvas');

        if (mainCanvas) {
            this.setupTouchpad(mainCanvas, this.primaryTouchpad, true);
            this.createPrimaryTouchpadIndicator(mainCanvas);
        }

        // Secondary touchpad - create UI element
        this.createSecondaryTouchpad();
    }

    createPrimaryTouchpadIndicator(canvas) {
        // Create overlay indicator
        const indicator = document.createElement('div');
        indicator.id = 'primary-touchpad-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 40px;
            height: 40px;
            border: 2px solid rgba(0, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(indicator);

        // Show indicator when dragging
        canvas.addEventListener('mousedown', () => {
            if (this.primaryTouchpad.enabled) {
                indicator.style.opacity = '1';
            }
        });

        canvas.addEventListener('mouseup', () => {
            indicator.style.opacity = '0';
        });

        canvas.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0';
        });

        // Update indicator position
        canvas.addEventListener('mousemove', (e) => {
            if (this.primaryTouchpad.isDragging && this.primaryTouchpad.enabled) {
                indicator.style.left = e.clientX + 'px';
                indicator.style.top = e.clientY + 'px';
                indicator.style.transform = 'translate(-50%, -50%)';

                // Pulse effect
                const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
                indicator.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
        });
    }

    setupTouchpad(element, touchpad, isOverlay = false) {
        // Mouse events
        element.addEventListener('mousedown', (e) => {
            if (!touchpad.enabled) return;
            touchpad.isDragging = true;
            this.updateTouchpadValues(e, element, touchpad);
            if (!isOverlay) e.preventDefault();
        });

        element.addEventListener('mousemove', (e) => {
            if (!touchpad.enabled || !touchpad.isDragging) return;
            this.updateTouchpadValues(e, element, touchpad);
            if (!isOverlay) e.preventDefault();
        });

        element.addEventListener('mouseup', () => {
            touchpad.isDragging = false;
        });

        element.addEventListener('mouseleave', () => {
            touchpad.isDragging = false;
        });

        // Touch events
        element.addEventListener('touchstart', (e) => {
            if (!touchpad.enabled) return;
            touchpad.isDragging = true;
            const touch = e.touches[0];
            this.updateTouchpadValues(touch, element, touchpad);
            if (!isOverlay) e.preventDefault();
        });

        element.addEventListener('touchmove', (e) => {
            if (!touchpad.enabled || !touchpad.isDragging) return;
            const touch = e.touches[0];
            this.updateTouchpadValues(touch, element, touchpad);
            if (!isOverlay) e.preventDefault();
        });

        element.addEventListener('touchend', () => {
            touchpad.isDragging = false;
        });
    }

    updateTouchpadValues(event, element, touchpad) {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        touchpad.values.x = Math.max(0, Math.min(1, x));
        touchpad.values.y = Math.max(0, Math.min(1, 1 - y)); // Invert Y for intuitive control
    }

    createSecondaryTouchpad() {
        const container = document.createElement('div');
        container.id = 'secondary-touchpad-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 200px;
            background: rgba(0, 20, 40, 0.9);
            border: 2px solid #00ffff;
            border-radius: 10px;
            cursor: crosshair;
            z-index: 1000;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        `;

        // Add visual feedback
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.cssText = 'width: 100%; height: 100%;';
        container.appendChild(canvas);

        // Add labels
        const labelX = document.createElement('div');
        labelX.id = 'touchpad-label-x';
        labelX.style.cssText = `
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            color: #00ffff;
            font-size: 10px;
            font-family: 'Orbitron', monospace;
            text-align: center;
        `;
        labelX.textContent = this.secondaryTouchpad.mappings.x;

        const labelY = document.createElement('div');
        labelY.id = 'touchpad-label-y';
        labelY.style.cssText = `
            position: absolute;
            top: 50%;
            left: 5px;
            transform: translateY(-50%) rotate(-90deg);
            transform-origin: left center;
            color: #00ffff;
            font-size: 10px;
            font-family: 'Orbitron', monospace;
        `;
        labelY.textContent = this.secondaryTouchpad.mappings.y;

        container.appendChild(labelX);
        container.appendChild(labelY);

        document.body.appendChild(container);

        // Setup events
        this.setupTouchpad(container, this.secondaryTouchpad, false);

        // Start visual update loop
        this.updateTouchpadVisual(canvas);
    }

    updateTouchpadVisual(canvas) {
        const ctx = canvas.getContext('2d');
        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const pos = (i / 4) * canvas.width;
                ctx.beginPath();
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, pos);
                ctx.lineTo(canvas.width, pos);
                ctx.stroke();
            }

            // Draw crosshair at current position
            const x = this.secondaryTouchpad.values.x * canvas.width;
            const y = (1 - this.secondaryTouchpad.values.y) * canvas.height;

            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x + 10, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y - 10);
            ctx.lineTo(x, y + 10);
            ctx.stroke();

            // Draw circle around position
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.strokeStyle = this.secondaryTouchpad.isDragging ? '#ff00ff' : '#00ffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            requestAnimationFrame(update);
        };
        update();
    }

    // Map touchpad values to actual parameter values
    getParameterValues() {
        const params = {};

        // Primary touchpad
        if (this.primaryTouchpad.enabled) {
            const xParam = this.primaryTouchpad.mappings.x;
            const yParam = this.primaryTouchpad.mappings.y;

            params[xParam] = this.mapToRange(
                this.primaryTouchpad.values.x,
                this.paramRanges[xParam]
            );

            params[yParam] = this.mapToRange(
                this.primaryTouchpad.values.y,
                this.paramRanges[yParam]
            );
        }

        // Secondary touchpad
        if (this.secondaryTouchpad.enabled) {
            const xParam = this.secondaryTouchpad.mappings.x;
            const yParam = this.secondaryTouchpad.mappings.y;

            params[xParam] = this.mapToRange(
                this.secondaryTouchpad.values.x,
                this.paramRanges[xParam]
            );

            params[yParam] = this.mapToRange(
                this.secondaryTouchpad.values.y,
                this.paramRanges[yParam]
            );
        }

        return params;
    }

    mapToRange(normalizedValue, range) {
        const value = normalizedValue * (range.max - range.min) + range.min;

        // Special handling for geometry (discrete values)
        if (range.min === 0 && range.max === 7) {
            return Math.floor(value);
        }

        return value;
    }

    // Update mappings dynamically
    updateMapping(touchpad, axis, paramName) {
        if (touchpad === 'primary') {
            this.primaryTouchpad.mappings[axis] = paramName;
        } else if (touchpad === 'secondary') {
            this.secondaryTouchpad.mappings[axis] = paramName;

            // Update label
            const label = document.getElementById(`touchpad-label-${axis}`);
            if (label) label.textContent = paramName;
        }
    }

    // Toggle touchpad enable/disable
    toggleTouchpad(touchpad, enabled) {
        if (touchpad === 'primary') {
            this.primaryTouchpad.enabled = enabled;
        } else if (touchpad === 'secondary') {
            this.secondaryTouchpad.enabled = enabled;
        }
    }
}
