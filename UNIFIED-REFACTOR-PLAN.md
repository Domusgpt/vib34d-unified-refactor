# 🎯 VIB34D MUSIC CHOREOGRAPHER - UNIFIED REFACTORING PLAN

**Date**: October 5, 2025
**New Repository**: `/mnt/c/Users/millz/vib34d-unified-refactor`
**Objective**: Refactor multiple systems together, make elegant, expand colors and audio reactivity

---

## 📊 SOURCE ANALYSIS FROM ORIGINAL REPO

**Source**: `/mnt/c/Users/millz/vib34d-music-video-choreographer-alternative`

### **What We're Taking:**
- ✅ **3 Working Visualization Systems**: Faceted, Quantum, Holographic
- ✅ **Parameter System**: 11 parameters with validation
- ✅ **Geometry Library**: 8 geometry types (tetrahedron, hypercube, sphere, torus, klein, fractal, wave, crystal)
- ✅ **Canvas Management**: Working WebGL context handling
- ✅ **Reactivity Manager**: Mouse/touch/scroll interactions
- ✅ **Export System**: Trading cards + video export

### **What We're Improving:**
- ❌ **Audio**: Currently 3 bands (bass/mid/high) → 7 bands + spectral features
- ❌ **Color**: Currently single hue (0-360) → Palettes + gradients + reactive
- ❌ **Architecture**: 14 different index.html files → 1 unified system
- ❌ **Parameter Mapping**: Simple additive → ADSR envelopes + curves

---

## 🏗️ NEW PROJECT STRUCTURE

```
vib34d-unified-refactor/
├── index.html                           // Single unified interface
├── README.md                            // Project documentation
├── UNIFIED-REFACTOR-PLAN.md            // This file
├── .gitignore
├── package.json                         // Dependencies
│
├── src/
│   ├── systems/
│   │   ├── shared/
│   │   │   ├── BaseSystem.js           // Base class all systems extend
│   │   │   ├── BaseVisualizer.js       // Base visualizer interface
│   │   │   └── SystemRegistry.js       // System management
│   │   ├── faceted/
│   │   │   ├── FacetedSystem.js        // Simple 2D patterns
│   │   │   └── FacetedVisualizer.js
│   │   ├── quantum/
│   │   │   ├── QuantumSystem.js        // Complex 3D lattice
│   │   │   └── QuantumVisualizer.js
│   │   ├── holographic/
│   │   │   ├── HolographicSystem.js    // Audio-reactive
│   │   │   └── HolographicVisualizer.js
│   │   └── polychora/
│   │       ├── PolychoraSystem.js      // 4D mathematics
│   │       └── PolychoraVisualizer.js
│   │
│   ├── core/
│   │   ├── Parameters.js               // Unified parameter system
│   │   ├── CanvasManager.js            // WebGL canvas lifecycle
│   │   └── ReactivityManager.js        // Mouse/touch/scroll
│   │
│   ├── audio/
│   │   ├── AudioAnalyzer.js            // 7-band + spectral analysis
│   │   ├── ADSREnvelope.js             // Smooth parameter transitions
│   │   └── ParameterMapper.js          // Audio-to-parameter routing
│   │
│   ├── color/
│   │   └── ColorSystem.js              // Palettes + gradients + reactive
│   │
│   ├── geometry/
│   │   └── GeometryLibrary.js          // 8 shared geometries
│   │
│   └── export/
│       ├── ExportManager.js            // Unified export system
│       ├── VideoExporter.js            // Video generation
│       └── CardGenerator.js            // Trading cards
│
├── styles/
│   ├── base.css                        // Core layout
│   ├── systems/
│   │   ├── faceted.css
│   │   ├── quantum.css
│   │   ├── holographic.css
│   │   └── polychora.css
│   └── ui/
│       ├── controls.css
│       └── mobile.css
│
└── tests/
    ├── audio-analyzer.test.js
    ├── color-system.test.js
    └── system-switching.test.js
```

---

## 🎨 ENHANCED COLOR SYSTEM

### **Current Limitation**: Single hue (0-360)

### **New Color Modes:**

1. **Single Hue** (current)
2. **Dual Hue** - Two rotating colors
3. **Triad** - Three colors 120° apart
4. **Complementary** - Two opposite colors
5. **Analogous** - Adjacent colors on wheel
6. **Palette** - Predefined color sets
7. **Gradient** - Smooth transitions
8. **Audio Reactive** - Colors from spectral analysis

### **Predefined Palettes:**
```javascript
palettes = {
    vaporwave: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff'],
    cyberpunk: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec'],
    synthwave: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee'],
    holographic: ['#ff00ff', '#00ffff', '#ff00aa', '#00aaff'],
    neon: ['#fe00fe', '#00fefe', '#fefe00', '#00fe00'],
    fire: ['#ff0000', '#ff4400', '#ff8800', '#ffcc00'],
    ocean: ['#001eff', '#0088ff', '#00ccff', '#00ffee'],
    forest: ['#004d00', '#008800', '#00cc00', '#88ff00']
}
```

### **New Parameters:**
- `colorMode`: 0-7 (single, dual, triad, complementary, analogous, palette, gradient, reactive)
- `colorPalette`: 0-7 (palette selection)
- `gradientType`: 0-4 (horizontal, vertical, radial, spiral, wave)
- `gradientSpeed`: 0-3 (animation speed)
- `colorReactivity`: 0-1 (audio influence on color)

---

## 🎵 PROFESSIONAL AUDIO REACTIVITY

### **Current**: 3 bands (bass, mid, high) with simple addition

### **New Audio Features:**

**7 Frequency Bands:**
- Sub-Bass (20-60 Hz) - Kick drums, sub bass
- Bass (60-250 Hz) - Bass guitar, low toms
- Low-Mid (250-500 Hz) - Guitars, keyboards
- Mid (500-2000 Hz) - Vocals, snares
- High-Mid (2000-4000 Hz) - Cymbals, guitars
- High (4000-8000 Hz) - Hi-hats, strings
- Air (8000-20000 Hz) - Airiness, sparkle

**Spectral Features:**
- **Spectral Centroid** - Brightness of sound (0-1)
- **Spectral Rolloff** - High frequency content (0-1)
- **Spectral Flux** - Energy change (onset detection)
- **RMS** - Overall loudness (0-1)

**Advanced Features:**
- **Onset Detection** - Kick/snare/transient events
- **BPM Estimation** - Automatic tempo detection
- **ADSR Envelopes** - Smooth parameter changes
- **Mapping Curves** - Exponential, logarithmic, s-curve, threshold

### **Example Mappings:**

```javascript
rot4dXW: {
    source: 'bass',              // Reacts to bass frequencies
    curve: 'exponential',        // Exponential response curve
    range: [-2, 2],
    envelope: ADSR(200, 500, 0.6, 1000)  // Smooth transitions
}

gridDensity: {
    source: 'spectralFlux',      // Reacts to onsets (kicks/snares)
    curve: 'threshold',          // Only strong hits trigger
    range: [10, 100],
    threshold: 0.15,
    envelope: ADSR(50, 1000, 0.3, 2000)  // Long decay
}

hue: {
    source: 'spectralCentroid',  // Color follows brightness
    curve: 'linear',
    range: [0, 360],
    envelope: null               // Instant color changes
}
```

---

## 🎯 IMPLEMENTATION PHASES

### **PHASE 1: AUDIO SYSTEM** (Priority 1)

Build advanced audio analysis that works with existing systems:

**Files to Create:**
1. `src/audio/AudioAnalyzer.js` - 7-band analysis + spectral features
2. `src/audio/ADSREnvelope.js` - Smooth parameter transitions
3. `src/audio/ParameterMapper.js` - Audio-to-parameter routing

**Why First**: Can integrate immediately with existing systems to prove concept

---

### **PHASE 2: COLOR SYSTEM** (Priority 2)

Expand from single hue to palettes and gradients:

**Files to Create:**
1. `src/color/ColorSystem.js` - Palettes, gradients, audio-reactive colors

**Shader Updates:**
- Add palette uniforms to GLSL
- Multi-color support in fragment shaders

---

### **PHASE 3: BASE ARCHITECTURE** (Priority 3)

Create unified system interface:

**Files to Create:**
1. `src/systems/shared/BaseSystem.js` - Common interface
2. `src/systems/shared/BaseVisualizer.js` - Visualizer base
3. `src/systems/shared/SystemRegistry.js` - System management

**Refactor Systems:**
- Migrate Faceted → `src/systems/faceted/`
- Migrate Quantum → `src/systems/quantum/`
- Migrate Holographic → `src/systems/holographic/`
- Create Polychora → `src/systems/polychora/`

---

### **PHASE 4: UNIFIED INTERFACE** (Priority 4)

Single master interface:

**Files to Create:**
1. `index.html` - Unified interface (< 500 lines)
2. `styles/base.css` - Core styling
3. System-specific CSS files

---

### **PHASE 5: EXPORT & POLISH** (Priority 5)

**Files to Create:**
1. `src/export/ExportManager.js` - Unified export
2. Tests and documentation

---

## 📋 MIGRATION CHECKLIST

### **From Original Repo:**

**Core Files to Copy:**
- [x] `src/core/Parameters.js` - Parameter definitions
- [x] `src/core/CanvasManager.js` - Canvas lifecycle
- [x] `src/core/ReactivityManager.js` - Interactions
- [x] `src/geometry/GeometryLibrary.js` - 8 geometries

**Visualizer Files to Adapt:**
- [ ] `src/core/Visualizer.js` → `src/systems/faceted/FacetedVisualizer.js`
- [ ] `src/quantum/QuantumVisualizer.js` → `src/systems/quantum/QuantumVisualizer.js`
- [ ] `src/holograms/HolographicVisualizer.js` → `src/systems/holographic/HolographicVisualizer.js`

**Engine Files to Refactor:**
- [ ] `src/core/Engine.js` → `src/systems/faceted/FacetedSystem.js`
- [ ] `src/quantum/QuantumEngine.js` → `src/systems/quantum/QuantumSystem.js`
- [ ] `src/holograms/RealHolographicSystem.js` → `src/systems/holographic/HolographicSystem.js`

**Extract Best Features From:**
- [ ] `index-MASTER.html` - Beat sync + video export logic
- [ ] `index-ULTIMATE-V2.html` - 4D rotation choreography patterns
- [ ] `index-working-simple.html` - Clean UI implementation

---

## 🚀 IMMEDIATE NEXT STEPS

1. **Set up project structure** - Create directories
2. **Copy core files** - Parameters, Canvas, Reactivity, Geometry
3. **Build AudioAnalyzer.js** - Highest impact feature
4. **Build ADSREnvelope.js** - Smooth parameter changes
5. **Build ParameterMapper.js** - Audio routing
6. **Test with simple demo** - Prove audio system works

---

## ✅ SUCCESS CRITERIA

**Elegance:**
- ✅ Single `index.html` under 500 lines
- ✅ All systems use identical API (BaseSystem)
- ✅ No code duplication
- ✅ Clean module separation

**Color Expansion:**
- ✅ 8 color modes
- ✅ 8+ predefined palettes
- ✅ 5 gradient types
- ✅ Audio-reactive colors

**Audio Reactivity:**
- ✅ 7 frequency bands (vs 3 current)
- ✅ 4 spectral features
- ✅ Onset detection + BPM estimation
- ✅ ADSR envelopes
- ✅ 4 mapping curves

**Performance:**
- ✅ 60 FPS desktop
- ✅ 45+ FPS mobile
- ✅ Smooth system switching
- ✅ No memory leaks

---

**READY TO START**: Shall I begin with Phase 1 (Audio System)?
