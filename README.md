# ⚡ SolarChain — Solar Energy Digital Twin

A fully interactive, end-to-end 3D digital twin of solar energy — from macro city grid all the way down to the silicon atomic lattice.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🏗️ Three Zoom Levels

### MACRO — City Energy Grid
- Click any node (solar farm, wind, battery, house, marketplace) to inspect
- Drag the Time of Day slider to simulate sun movement and watch production change
- Hit Execute Trade to fire energy packets flying between nodes
- Toggle nodes on/off

**Click a Solar Farm → auto-zooms to Meso level**

### MESO — Physical Asset Detail
- Panel Tilt slider physically tilts the panel array in real-time
- Soiling Factor slider dirtys the cells (changes roughness/emissive)
- Inverter Load drives the status bar + LED
- Live current particles flow through wiring

**Click "Go Atomic" → dives into silicon physics**

### ATOMIC — Silicon Photovoltaic Physics
- Real-time GLSL simulation of the photovoltaic effect
- Silicon crystal lattice with N-type / P-type regions visible
- Photon rain (yellow) hits the lattice, exciting electrons
- Electron drift (cyan) and hole flow (orange) move opposite directions
- Photon Flux slider controls all of this live

## Controls
- Left drag — orbit | Scroll — zoom | Right drag — pan
- Top nav: MACRO / MESO / ATOMIC buttons jump between levels
- Right panel: context controls for current level
- Bottom left: live trade log

## Tech Stack
React 18 + TypeScript + Vite + React Three Fiber + Three.js + Zustand + GLSL Shaders
