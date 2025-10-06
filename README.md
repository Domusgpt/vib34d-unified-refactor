# 🎵 VIB34D Music Video Choreographer - Unified System

**Advanced 4D visualization choreography with professional audio reactivity**

## 🌟 Features

### **4 Visualization Systems**
- 🔷 **Faceted** - Simple 2D patterns with elegant mouse tracking
- 🌌 **Quantum** - Complex 3D lattice with volumetric lighting
- ✨ **Holographic** - Audio-reactive multi-layer rendering
- 🔮 **Polychora** - 4D polytope mathematics

### **Professional Audio Analysis**
- 7 frequency bands (sub-bass, bass, low-mid, mid, high-mid, high, air)
- Spectral features (centroid, rolloff, flux, RMS)
- Onset detection for kicks/snares/transients
- BPM estimation
- ADSR envelopes for smooth parameter changes
- Multiple mapping curves (exponential, logarithmic, s-curve, threshold)

### **Advanced Color System**
- 8 color modes (single, dual, triad, complementary, analogous, palette, gradient, reactive)
- 8+ predefined palettes (vaporwave, cyberpunk, synthwave, holographic, neon, fire, ocean, forest)
- 5 gradient types (horizontal, vertical, radial, spiral, wave)
- Audio-reactive colors based on spectral analysis

### **11 Real-Time Parameters**
- 4D rotations (X-W, Y-W, Z-W planes)
- Grid density (4-100)
- Morph factor (0-2)
- Chaos (0-1)
- Speed (0.1-3)
- Dimension (3.0-4.5)
- Color controls (hue, saturation, intensity)
- Geometry selection (8 types)

## 🚀 Quick Start

```bash
# Serve locally
python3 -m http.server 8080
# or
npx serve -p 8080

# Open in browser
http://localhost:8080
```

## 📁 Architecture

```
src/
├── systems/          # Visualization systems
│   ├── shared/       # BaseSystem + common interfaces
│   ├── faceted/      # Simple 2D patterns
│   ├── quantum/      # Complex 3D lattice
│   ├── holographic/  # Audio-reactive layers
│   └── polychora/    # 4D mathematics
├── core/            # Parameter & canvas management
├── audio/           # Professional audio analysis
├── color/           # Palette & gradient system
├── geometry/        # 8 shared geometry types
└── export/          # Video + trading card export
```

## 🎨 Color Palettes

- **Vaporwave**: Pink, cyan, mint, purple
- **Cyberpunk**: Hot pink, orange, yellow, violet
- **Synthwave**: Magenta, purple, deep blue, blue
- **Holographic**: Magenta, cyan, pink, sky blue
- **Neon**: Magenta, cyan, yellow, green
- **Fire**: Red, red-orange, orange, yellow
- **Ocean**: Deep blue, blue, cyan, aqua
- **Forest**: Dark green, green, lime, yellow-green

## 🎵 Audio Mapping Examples

**4D Rotations from Frequency Bands:**
```javascript
rot4dXW: bass frequencies (exponential curve)
rot4dYW: mid frequencies (exponential curve)
rot4dZW: high frequencies (exponential curve)
```

**Grid Density from Onsets:**
```javascript
gridDensity: spectralFlux (threshold curve)
- Triggers on kicks/snares
- Fast attack (50ms), long decay (2000ms)
```

**Color from Sound Brightness:**
```javascript
hue: spectralCentroid (linear)
- Bright sounds → warm colors
- Dark sounds → cool colors
```

## 📖 Documentation

See [UNIFIED-REFACTOR-PLAN.md](UNIFIED-REFACTOR-PLAN.md) for complete architecture details.

## 🧠 Technology

- WebGL 2.0 / WebGL 1.0 (fallback)
- GLSL fragment shaders for 4D mathematics
- Web Audio API for professional audio analysis
- ES6 modules
- No external dependencies (vanilla JS)

## 📄 License

© 2025 Paul Phillips - Clear Seas Solutions LLC
All Rights Reserved - Proprietary Technology

---

# 🌟 A Paul Phillips Manifestation

**Send Love, Hate, or Opportunity to:** Paul@clearseassolutions.com
**Join The Exoditical Moral Architecture Movement today:** [Parserator.com](https://parserator.com)

> *"The Revolution Will Not be in a Structured Format"*
