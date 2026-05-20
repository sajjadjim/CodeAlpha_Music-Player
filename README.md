# 🎵 AetherPlayer - Premium Glassmorphic Music Experience

AetherPlayer is an ultra-modern, high-fidelity interactive Web Music Player application designed with sleek glassmorphic card elements, dynamic floating background neon orbs, beautiful keyframe equalizers, and pixel-perfect SVG control icons. 

It handles streaming music playback via CDN networks and embeds a robust **Generative Lofi Synthesizer (Web Audio API)** for cozy procedural beats that play 100% offline if no network is available.

---

## ✨ Outstanding Features

- **Glassmorphic Design Aesthetics**: Soft blurred background filters (`backdrop-filter`), thin premium translucent borders, and deep floating dark mode shadow drops.
- **Dynamic Ambient Theme Shifts**: The background ambient neon orbs and glowing shadows transition color palettes dynamically to match the active song's visual genre (Cyberpunk Neon Pink, Synthwave Sunset Orange, and Lofi Space Green/Indigo).
- **Procedural Offline Synthesizer**: Toggling **Synth Mode** runs a customized Web Audio API engine. It schedules rich triangle wave chord progressions, deep sine wave drum kicks, and light pentatonic sine wave lead melodies generated procedurally in real-time.
- **Micro-Animations & Visualizers**: 
  - Smooth keyframe-driven equalizers and speaker wave representations.
  - Floating glowing music notes (`♫`, `♪`, `♬`, `♩`) that drift upwards when tracks play.
  - Rotating vinyl album artwork when active.
- **Advanced Playback Controls**: Full seek-bar scrub controls (with timing tooltips), double-click / mute-toggle volume management, loop/repeat configurations (None, Repeat Single, Repeat All), and shuffle patterns.
- **Tactile Keyboard Shortcuts**: Support for quick physical key controls for full accessibility.

---

## ⌨️ Premium Keyboard Shortcuts

Enjoy physical keyboard controls for a highly tactile experience:

| Key Command | Action |
|---|---|
| **Spacebar** | Play / Pause |
| **Arrow Up** / **Arrow Down** | Adjust Volume (Up/Down 5%) |
| **Arrow Right** / **Arrow Left** | Seek Audio Forward / Backward 5 seconds |
| **Ctrl + Arrow Right** / **Ctrl + Arrow Left** | Next / Previous Track |
| **M** | Mute / Unmute Toggle |
| **S** | Toggle Shuffle Play |
| **R** | Toggle Repeat Mode (None / Repeat One / Repeat All) |
| **P** | Open / Close Playlist Drawer |

---

## 📁 File Structure

```text
├── index.html          # Semantic HTML markup & SVG icons
├── style.css           # Glassmorphic layout, sliders, themes, and keyframe animations
├── script.js           # State controller, playlist logic, and Web Audio API synthesizer
├── assets/
│   ├── cover1.png      # Cyberpunk Album Cover Art (AI-Generated)
│   ├── cover2.png      # Synthwave Album Cover Art (AI-Generated)
│   └── cover3.png      # Lofi Space Album Cover Art (AI-Generated)
└── README.md           # Documentation and shortcut guide
```

---

## 🚀 Getting Started

Since the player is built using pure **HTML5, CSS3, and modern vanilla ES6 JavaScript**, it has zero third-party framework dependencies.

1. Double-click [index.html](file:///Users/sajjadhossainjim/Downloads/CodeAlpha_Music-Player/index.html) to run it directly inside any modern web browser (Chrome, Safari, Firefox, Edge).
2. Or run a simple local server in this directory:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx serve .
   ```
   Open `http://localhost:8000` in your web browser.
