/**
 * ReactiveInspector - Advanced Real-time Audio/Visual Telemetry
 *
 * Features:
 * - Real-time waveform and spectrum display
 * - All audio metrics visualization
 * - Parameter state monitoring
 * - Performance metrics (FPS, render time)
 * - Recording/export session data
 * - Collapsible sections
 * - Customizable layout
 *
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */

export class ReactiveInspector {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container ${containerId} not found`);
        }

        this.options = {
            width: options.width || 350,
            height: options.height || 600,
            position: options.position || 'right', // left, right, top, bottom
            collapsed: options.collapsed || false,
            showWaveform: options.showWaveform !== undefined ? options.showWaveform : true,
            showSpectrum: options.showSpectrum !== undefined ? options.showSpectrum : true,
            showMetrics: options.showMetrics !== undefined ? options.showMetrics : true,
            showParameters: options.showParameters !== undefined ? options.showParameters : true,
            updateRate: options.updateRate || 60, // Hz
            ...options
        };

        // State
        this.isCollapsed = this.options.collapsed;
        this.sections = {
            waveform: true,
            spectrum: true,
            audio: true,
            parameters: true,
            performance: true
        };

        // Data history for graphs
        this.fpsHistory = new Array(60).fill(0);
        this.rmsHistory = new Array(100).fill(0);
        this.centroidHistory = new Array(100).fill(0);

        // Recording
        this.isRecording = false;
        this.recordedData = [];
        this.recordStartTime = 0;

        this.init();
    }

    init() {
        this.createUI();
        this.attachEventListeners();
    }

    createUI() {
        const position = this.options.position;
        const positionStyles = {
            right: 'top: 0; right: 0; height: 100vh;',
            left: 'top: 0; left: 0; height: 100vh;',
            top: 'top: 0; left: 0; right: 0; width: 100%;',
            bottom: 'bottom: 0; left: 0; right: 0; width: 100%;'
        };

        this.container.innerHTML = `
            <div id="reactiveInspector" style="
                position: fixed;
                ${positionStyles[position]}
                width: ${this.isCollapsed ? '40px' : this.options.width + 'px'};
                background: rgba(0, 10, 20, 0.95);
                border-left: 2px solid #0ff;
                box-shadow: -5px 0 30px rgba(0, 255, 255, 0.2);
                z-index: 10000;
                overflow-y: auto;
                overflow-x: hidden;
                transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            ">
                <!-- Toggle Button -->
                <button id="inspectorToggle" style="
                    position: absolute;
                    top: 10px;
                    left: ${this.isCollapsed ? '5px' : this.options.width - 35 + 'px'};
                    width: 30px;
                    height: 30px;
                    background: rgba(0, 255, 255, 0.2);
                    border: 1px solid #0ff;
                    border-radius: 50%;
                    color: #0ff;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    z-index: 10001;
                ">${this.isCollapsed ? '◀' : '▶'}</button>

                <!-- Content (hidden when collapsed) -->
                <div id="inspectorContent" style="
                    padding: 50px 15px 15px 15px;
                    display: ${this.isCollapsed ? 'none' : 'block'};
                    color: #0ff;
                ">
                    <!-- Header -->
                    <div style="
                        font-size: 16px;
                        font-weight: 700;
                        margin-bottom: 15px;
                        text-align: center;
                        background: linear-gradient(135deg, #0ff 0%, #00ffaa 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        letter-spacing: 1px;
                    ">REACTIVE INSPECTOR</div>

                    <!-- Recording Controls -->
                    <div style="
                        margin-bottom: 15px;
                        padding: 10px;
                        background: rgba(0, 255, 255, 0.05);
                        border: 1px solid rgba(0, 255, 255, 0.2);
                        border-radius: 6px;
                    ">
                        <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                            <button id="recordBtn" style="
                                flex: 1;
                                padding: 6px;
                                background: rgba(255, 0, 100, 0.2);
                                border: 1px solid #ff0064;
                                color: #ff0064;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                                transition: all 0.3s;
                            ">⏺ Record</button>
                            <button id="exportBtn" style="
                                flex: 1;
                                padding: 6px;
                                background: rgba(0, 255, 255, 0.1);
                                border: 1px solid #0ff;
                                color: #0ff;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                                transition: all 0.3s;
                            ">📥 Export</button>
                        </div>
                        <div id="recordStatus" style="
                            font-size: 10px;
                            color: #00ffaa;
                            text-align: center;
                        ">Ready to record</div>
                    </div>

                    <!-- Waveform Section -->
                    <div class="inspector-section" data-section="waveform">
                        <div class="section-header" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            background: rgba(0, 255, 255, 0.1);
                            border-radius: 6px;
                            cursor: pointer;
                            margin-bottom: 8px;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            <span>🌊 WAVEFORM</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content">
                            <canvas id="waveformCanvas" width="320" height="100" style="
                                width: 100%;
                                height: 100px;
                                background: rgba(0, 10, 20, 0.8);
                                border: 1px solid rgba(0, 255, 255, 0.3);
                                border-radius: 4px;
                            "></canvas>
                        </div>
                    </div>

                    <!-- Spectrum Section -->
                    <div class="inspector-section" data-section="spectrum">
                        <div class="section-header" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            background: rgba(0, 255, 255, 0.1);
                            border-radius: 6px;
                            cursor: pointer;
                            margin: 10px 0 8px 0;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            <span>📊 SPECTRUM</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content">
                            <canvas id="spectrumCanvas" width="320" height="120" style="
                                width: 100%;
                                height: 120px;
                                background: rgba(0, 10, 20, 0.8);
                                border: 1px solid rgba(0, 255, 255, 0.3);
                                border-radius: 4px;
                            "></canvas>
                        </div>
                    </div>

                    <!-- Audio Metrics Section -->
                    <div class="inspector-section" data-section="audio">
                        <div class="section-header" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            background: rgba(0, 255, 255, 0.1);
                            border-radius: 6px;
                            cursor: pointer;
                            margin: 10px 0 8px 0;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            <span>🎵 AUDIO METRICS</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content">
                            <div id="audioMetrics" style="
                                font-family: 'Courier New', monospace;
                                font-size: 10px;
                                line-height: 1.6;
                                color: #00ffaa;
                            "></div>
                        </div>
                    </div>

                    <!-- Parameters Section -->
                    <div class="inspector-section" data-section="parameters">
                        <div class="section-header" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            background: rgba(0, 255, 255, 0.1);
                            border-radius: 6px;
                            cursor: pointer;
                            margin: 10px 0 8px 0;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            <span>🎛️ PARAMETERS</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content">
                            <div id="parameterState" style="
                                font-family: 'Courier New', monospace;
                                font-size: 10px;
                                line-height: 1.6;
                                color: #00ffaa;
                            "></div>
                        </div>
                    </div>

                    <!-- Performance Section -->
                    <div class="inspector-section" data-section="performance">
                        <div class="section-header" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            background: rgba(0, 255, 255, 0.1);
                            border-radius: 6px;
                            cursor: pointer;
                            margin: 10px 0 8px 0;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            <span>⚡ PERFORMANCE</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content">
                            <div id="performanceMetrics" style="
                                font-family: 'Courier New', monospace;
                                font-size: 10px;
                                line-height: 1.6;
                                color: #00ffaa;
                            "></div>
                            <canvas id="fpsGraph" width="320" height="60" style="
                                width: 100%;
                                height: 60px;
                                background: rgba(0, 10, 20, 0.8);
                                border: 1px solid rgba(0, 255, 255, 0.3);
                                border-radius: 4px;
                                margin-top: 8px;
                            "></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Get canvas contexts
        this.waveformCanvas = document.getElementById('waveformCanvas');
        this.spectrumCanvas = document.getElementById('spectrumCanvas');
        this.fpsGraph = document.getElementById('fpsGraph');
        this.waveformCtx = this.waveformCanvas?.getContext('2d');
        this.spectrumCtx = this.spectrumCanvas?.getContext('2d');
        this.fpsCtx = this.fpsGraph?.getContext('2d');

        this.audioMetricsDiv = document.getElementById('audioMetrics');
        this.parameterStateDiv = document.getElementById('parameterState');
        this.performanceMetricsDiv = document.getElementById('performanceMetrics');
    }

    attachEventListeners() {
        // Toggle button
        const toggleBtn = document.getElementById('inspectorToggle');
        toggleBtn?.addEventListener('click', () => this.toggle());

        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const section = e.currentTarget.parentElement;
                const content = section.querySelector('.section-content');
                const icon = section.querySelector('.toggle-icon');

                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    icon.textContent = '▼';
                } else {
                    content.style.display = 'none';
                    icon.textContent = '▶';
                }
            });
        });

        // Recording controls
        document.getElementById('recordBtn')?.addEventListener('click', () => this.toggleRecording());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        const inspector = document.getElementById('reactiveInspector');
        const content = document.getElementById('inspectorContent');
        const toggleBtn = document.getElementById('inspectorToggle');

        if (this.isCollapsed) {
            inspector.style.width = '40px';
            content.style.display = 'none';
            toggleBtn.textContent = '◀';
            toggleBtn.style.left = '5px';
        } else {
            inspector.style.width = this.options.width + 'px';
            content.style.display = 'block';
            toggleBtn.textContent = '▶';
            toggleBtn.style.left = (this.options.width - 35) + 'px';
        }
    }

    /**
     * Update with audio analyzer data
     */
    updateAudioData(audioData, analyser) {
        if (this.isCollapsed) return;

        // Draw waveform
        if (this.waveformCtx && analyser) {
            this.drawWaveform(analyser);
        }

        // Draw spectrum
        if (this.spectrumCtx && analyser) {
            this.drawSpectrum(analyser);
        }

        // Update audio metrics text
        if (this.audioMetricsDiv && audioData) {
            this.updateAudioMetrics(audioData);
        }

        // Record data if recording
        if (this.isRecording) {
            this.recordDataPoint(audioData);
        }
    }

    drawWaveform(analyser) {
        const buffer = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buffer);

        const w = this.waveformCanvas.width;
        const h = this.waveformCanvas.height;

        this.waveformCtx.fillStyle = 'rgba(0, 10, 20, 0.3)';
        this.waveformCtx.fillRect(0, 0, w, h);

        this.waveformCtx.strokeStyle = '#0ff';
        this.waveformCtx.lineWidth = 2;
        this.waveformCtx.beginPath();

        const sliceWidth = w / buffer.length;
        let x = 0;

        for (let i = 0; i < buffer.length; i++) {
            const v = buffer[i] / 128.0;
            const y = (v * h) / 2;

            if (i === 0) {
                this.waveformCtx.moveTo(x, y);
            } else {
                this.waveformCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.waveformCtx.lineTo(w, h / 2);
        this.waveformCtx.stroke();

        // Center line
        this.waveformCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        this.waveformCtx.lineWidth = 1;
        this.waveformCtx.beginPath();
        this.waveformCtx.moveTo(0, h / 2);
        this.waveformCtx.lineTo(w, h / 2);
        this.waveformCtx.stroke();
    }

    drawSpectrum(analyser) {
        const buffer = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buffer);

        const w = this.spectrumCanvas.width;
        const h = this.spectrumCanvas.height;

        this.spectrumCtx.fillStyle = 'rgba(0, 10, 20, 0.3)';
        this.spectrumCtx.fillRect(0, 0, w, h);

        const barWidth = w / buffer.length * 2.5;
        let x = 0;

        for (let i = 0; i < buffer.length; i++) {
            const barHeight = (buffer[i] / 255) * h;

            // Gradient from cyan to magenta
            const gradient = this.spectrumCtx.createLinearGradient(0, h - barHeight, 0, h);
            gradient.addColorStop(0, '#ff00ff');
            gradient.addColorStop(0.5, '#0ff');
            gradient.addColorStop(1, '#00ffaa');

            this.spectrumCtx.fillStyle = gradient;
            this.spectrumCtx.fillRect(x, h - barHeight, barWidth - 1, barHeight);

            x += barWidth;
        }
    }

    updateAudioMetrics(audioData) {
        const metrics = [];

        // Bands
        if (audioData.bands) {
            metrics.push('7-BAND ANALYSIS:');
            Object.entries(audioData.bands).forEach(([name, band]) => {
                const bar = '█'.repeat(Math.floor(band.value * 20));
                metrics.push(`${name.padEnd(8)}: ${bar} ${(band.value * 100).toFixed(0)}%`);
            });
            metrics.push('');
        }

        // Spectral features
        metrics.push('SPECTRAL:');
        metrics.push(`Centroid  : ${(audioData.spectralCentroid * 100).toFixed(1)}%`);
        metrics.push(`Rolloff   : ${(audioData.spectralRolloff * 100).toFixed(1)}%`);
        metrics.push(`Flux      : ${(audioData.spectralFlux * 100).toFixed(1)}%`);
        metrics.push(`RMS       : ${(audioData.rms * 100).toFixed(1)}%`);
        metrics.push('');

        // Rhythm
        if (audioData.bpm) {
            metrics.push('RHYTHM:');
            metrics.push(`BPM       : ${audioData.bpm.toFixed(1)}`);
            if (audioData.onset) {
                metrics.push(`Onset     : ${audioData.onset.detected ? 'YES' : 'no'}`);
            }
        }

        this.audioMetricsDiv.innerHTML = metrics.join('<br>');
    }

    /**
     * Update with parameter state
     */
    updateParameters(params) {
        if (this.isCollapsed || !this.parameterStateDiv) return;

        const lines = [];
        Object.entries(params).forEach(([key, value]) => {
            const displayValue = typeof value === 'number' ? value.toFixed(2) : value;
            lines.push(`${key.padEnd(12)}: ${displayValue}`);
        });

        this.parameterStateDiv.innerHTML = lines.join('<br>');
    }

    /**
     * Update with performance metrics
     */
    updatePerformance(fps, renderTime) {
        if (this.isCollapsed || !this.performanceMetricsDiv) return;

        // Update FPS history
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }

        // Display metrics
        const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

        this.performanceMetricsDiv.innerHTML = `
            FPS        : ${fps.toFixed(1)} (avg: ${avgFps.toFixed(1)})<br>
            Render     : ${renderTime.toFixed(2)}ms<br>
            Frame Budget: ${(100 * renderTime / 16.67).toFixed(1)}%
        `;

        // Draw FPS graph
        this.drawFPSGraph();
    }

    drawFPSGraph() {
        if (!this.fpsCtx) return;

        const w = this.fpsGraph.width;
        const h = this.fpsGraph.height;

        this.fpsCtx.fillStyle = 'rgba(0, 10, 20, 0.3)';
        this.fpsCtx.fillRect(0, 0, w, h);

        // 60 FPS target line
        this.fpsCtx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.fpsCtx.lineWidth = 1;
        this.fpsCtx.setLineDash([5, 5]);
        this.fpsCtx.beginPath();
        this.fpsCtx.moveTo(0, h / 2);
        this.fpsCtx.lineTo(w, h / 2);
        this.fpsCtx.stroke();
        this.fpsCtx.setLineDash([]);

        // FPS line
        this.fpsCtx.strokeStyle = '#0ff';
        this.fpsCtx.lineWidth = 2;
        this.fpsCtx.beginPath();

        this.fpsHistory.forEach((fps, i) => {
            const x = (i / this.fpsHistory.length) * w;
            const y = h - (fps / 60) * h;
            if (i === 0) {
                this.fpsCtx.moveTo(x, y);
            } else {
                this.fpsCtx.lineTo(x, y);
            }
        });

        this.fpsCtx.stroke();
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
        const btn = document.getElementById('recordBtn');
        const status = document.getElementById('recordStatus');

        if (this.isRecording) {
            this.recordedData = [];
            this.recordStartTime = Date.now();
            btn.style.background = 'rgba(255, 0, 100, 0.5)';
            btn.textContent = '⏸ Stop';
            status.textContent = 'Recording...';
            status.style.color = '#ff0064';
        } else {
            btn.style.background = 'rgba(255, 0, 100, 0.2)';
            btn.textContent = '⏺ Record';
            status.textContent = `Recorded ${this.recordedData.length} frames (${((Date.now() - this.recordStartTime) / 1000).toFixed(1)}s)`;
            status.style.color = '#00ffaa';
        }
    }

    recordDataPoint(audioData) {
        this.recordedData.push({
            timestamp: Date.now() - this.recordStartTime,
            audioData: { ...audioData }
        });
    }

    exportData() {
        if (this.recordedData.length === 0) {
            alert('No recorded data to export');
            return;
        }

        const dataStr = JSON.stringify(this.recordedData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vib34d-telemetry-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log(`📥 Exported ${this.recordedData.length} data points`);
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
