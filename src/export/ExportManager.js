/**
 * Export Manager - Video, Trading Cards, and JSON Configuration
 * Handles all export functionality for the VIB34D system
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class ExportManager {
    constructor(canvas, registry) {
        this.canvas = canvas;
        this.registry = registry;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    /**
     * Start video recording
     */
    async startVideoRecording(options = {}) {
        try {
            // Capture canvas stream at 60fps
            const stream = this.canvas.captureStream(options.fps || 60);

            // Create media recorder
            const mimeType = this.getSupportedMimeType();
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: options.bitrate || 8000000 // 8 Mbps
            });

            this.recordedChunks = [];

            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;

            console.log('📹 Video recording started');
            return true;

        } catch (err) {
            console.error('Failed to start recording:', err);
            return false;
        }
    }

    /**
     * Stop video recording and download
     */
    async stopVideoRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || !this.isRecording) {
                reject(new Error('No active recording'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                try {
                    // Create blob from recorded chunks
                    const blob = new Blob(this.recordedChunks, {
                        type: this.getSupportedMimeType()
                    });

                    // Create download link
                    const url = URL.createObjectURL(blob);
                    const timestamp = Date.now();
                    const system = this.registry.getCurrentSystem()?.name || 'unknown';
                    const filename = `vib34d-${system}-${timestamp}.webm`;

                    this.downloadFile(url, filename);

                    this.isRecording = false;
                    this.recordedChunks = [];

                    console.log(`✅ Video saved: ${filename}`);
                    resolve(filename);

                } catch (err) {
                    reject(err);
                }
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * Get supported MIME type for video recording
     */
    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
            'video/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return 'video/webm'; // fallback
    }

    /**
     * Generate trading card image
     */
    async generateTradingCard(metadata = {}) {
        try {
            // Create card canvas (1080x1920 - Instagram story size)
            const cardCanvas = document.createElement('canvas');
            cardCanvas.width = 1080;
            cardCanvas.height = 1920;
            const ctx = cardCanvas.getContext('2d');

            // Capture current frame
            const frameBlob = await new Promise(resolve =>
                this.canvas.toBlob(resolve, 'image/png')
            );
            const frameImg = await createImageBitmap(frameBlob);

            // Draw visualization (top half)
            ctx.drawImage(frameImg, 0, 0, 1080, 1080);

            // Draw metadata panel (bottom half)
            this.drawMetadataPanel(ctx, metadata);

            // Convert to data URL
            const dataUrl = cardCanvas.toDataURL('image/png');

            // Download
            const timestamp = Date.now();
            const filename = `vib34d-card-${timestamp}.png`;
            this.downloadFile(dataUrl, filename);

            console.log(`✅ Trading card saved: ${filename}`);
            return dataUrl;

        } catch (err) {
            console.error('Failed to generate trading card:', err);
            throw err;
        }
    }

    /**
     * Draw metadata panel on trading card
     */
    drawMetadataPanel(ctx, metadata) {
        const system = this.registry.getCurrentSystem();
        const params = this.registry.getParameters();

        // Background
        ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
        ctx.fillRect(0, 1080, 1080, 840);

        // Border accent
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 1100, 1040, 780);

        // Title
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 64px "Courier New"';
        ctx.fillText('🌌 VIB34D', 50, 1190);

        // System name
        ctx.font = 'bold 48px "Courier New"';
        ctx.fillStyle = '#00ffaa';
        ctx.fillText(system?.name || 'Unknown', 50, 1260);

        // Parameters
        ctx.font = '32px "Courier New"';
        ctx.fillStyle = '#ffffff';
        let y = 1340;

        const displayParams = [
            { label: 'Grid Density', value: params.gridDensity?.toFixed(1) || '?' },
            { label: 'Speed', value: params.speed?.toFixed(1) || '?' },
            { label: 'Hue', value: params.hue?.toFixed(0) || '?' },
            { label: 'Reactivity', value: this.registry.getAudioReactivity()?.toFixed(1) || '?' }
        ];

        displayParams.forEach(param => {
            ctx.fillStyle = '#00ffaa';
            ctx.fillText(param.label + ':', 50, y);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(param.value, 450, y);
            y += 50;
        });

        // Color mode
        const colorMode = system?.colorSystem?.getCurrentMode() || 'Unknown';
        ctx.fillStyle = '#00ffaa';
        ctx.fillText('Color Mode:', 50, y);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(colorMode, 450, y);
        y += 80;

        // Timestamp
        ctx.fillStyle = '#888888';
        ctx.font = '24px "Courier New"';
        const date = new Date().toLocaleString();
        ctx.fillText(date, 50, y);

        // Signature
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 28px "Courier New"';
        ctx.fillText('A Paul Phillips Manifestation', 50, 1840);

        ctx.fillStyle = '#888888';
        ctx.font = '20px "Courier New"';
        ctx.fillText('Paul@clearseassolutions.com', 50, 1875);
    }

    /**
     * Save current configuration as JSON
     */
    saveConfiguration(name = null) {
        try {
            const system = this.registry.getCurrentSystem();
            const params = this.registry.getParameters();

            const config = {
                version: '1.0',
                name: name || `Config ${Date.now()}`,
                timestamp: Date.now(),
                date: new Date().toISOString(),
                system: {
                    name: system?.name || 'unknown',
                    type: system?.type || 'unknown'
                },
                parameters: params,
                colorSystem: {
                    mode: system?.colorSystem?.getCurrentMode() || 0,
                    palette: system?.colorSystem?.getCurrentPalette() || null,
                    gradientType: system?.colorSystem?.gradientType || 0
                },
                audioReactivity: this.registry.getAudioReactivity(),
                metadata: {
                    author: 'Paul Phillips',
                    organization: 'Clear Seas Solutions LLC',
                    contact: 'Paul@clearseassolutions.com'
                }
            };

            // Convert to JSON
            const json = JSON.stringify(config, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Download
            const filename = `vib34d-config-${Date.now()}.json`;
            this.downloadFile(url, filename);

            console.log(`✅ Configuration saved: ${filename}`);
            return config;

        } catch (err) {
            console.error('Failed to save configuration:', err);
            throw err;
        }
    }

    /**
     * Load configuration from JSON file
     */
    async loadConfiguration(file) {
        try {
            const text = await file.text();
            const config = JSON.parse(text);

            // Validate version
            if (config.version !== '1.0') {
                throw new Error(`Unsupported config version: ${config.version}`);
            }

            // Switch to system
            if (config.system?.type) {
                await this.registry.switchTo(config.system.type);
            }

            // Apply parameters
            if (config.parameters) {
                Object.entries(config.parameters).forEach(([key, value]) => {
                    this.registry.updateParameter(key, value);
                });
            }

            // Apply color system settings
            const system = this.registry.getCurrentSystem();
            if (system && config.colorSystem) {
                if (config.colorSystem.mode !== undefined) {
                    system.colorSystem.setMode(config.colorSystem.mode);
                }
                if (config.colorSystem.palette) {
                    system.colorSystem.setPalette(config.colorSystem.palette);
                }
                if (config.colorSystem.gradientType !== undefined) {
                    system.colorSystem.setGradientType(config.colorSystem.gradientType);
                }
            }

            // Apply audio reactivity
            if (config.audioReactivity !== undefined) {
                this.registry.setAudioReactivity(config.audioReactivity);
            }

            console.log(`✅ Configuration loaded: ${config.name}`);
            return config;

        } catch (err) {
            console.error('Failed to load configuration:', err);
            throw err;
        }
    }

    /**
     * Download file helper
     */
    downloadFile(url, filename) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * Get recording status
     */
    isRecordingActive() {
        return this.isRecording;
    }
}
