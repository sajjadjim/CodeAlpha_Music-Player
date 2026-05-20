# 🎵 Music Player - Elegant Dark Hi-Fi Experience

A modern, minimalist, and exceptionally elegant Music Player web application designed with sleek dark card overlays, a rounded-rectangle cover frame, grayscale equalizers, and ultra-thin interactive sliders.

It features direct playback support for audio tracks and embeds an advanced **procedural offline synthesizer (Web Audio API)** to generate cozy, high-fidelity ambient drum loops and chord pads when offline.

---

## ✨ Features

- **Minimalist & Elegant Carbon-Matte Design**: Refined dark charcoal body card background (`#161619`) set against a solid deep black backdrop (`#0b0b0c`) with thin borders.
- **Rounded-Rectangle Artwork Frame**: A static, elegant square card layout similar to modern streaming platforms (Spotify/Apple Music).
- **Subtle Titanium Highlights**: Dynamic accent adjustments are restrained to solid titanium whites and muted ambers or greens.
- **Micro-Visualizers**: Translucent grayscale equalizer columns that react beautifully to active tracks.
- **Generative Offline Synthesizer**: Generates cozily repeating triangle-wave chord pads, pure sine-wave bass drum sweeps, white noise brush snares, and melodic pentatonic scales procedurally in real-time.
- **Tactile Controls**: Integrated range input slide heads that reveal an active white marker point only on hover.
- **Accessible Keyboard Commands**: Standard physical keys to handle all controls (e.g. Spacebar to Play, arrows to seek/volume).

---

## ⌨️ Keyboard Shortcuts

| Key Command | Action |
|---|---|
| **Spacebar** | Play / Pause Toggle |
| **Arrow Up** / **Arrow Down** | Increase / Decrease Volume |
| **Arrow Right** / **Arrow Left** | Skip Audio Forward / Backward 5s |
| **Ctrl + Arrow Right** / **Ctrl + Arrow Left** | Next / Previous Track |
| **M** | Mute / Unmute Toggle |
| **S** | Shuffle Play Toggle |
| **R** | Cycle Repeat (None / Single Track / Entire List) |
| **P** | Slide Playlist Drawer Up / Down |

---

## 📁 File Structure

```text
├── index.html          # Clean HTML structure & custom SVG icons
├── style.css           # Carbon-matte card shapes, thin playheads, and visualizers
├── script.js           # Media engine controller & Web Audio API synthesizer
├── assets/
│   ├── cover1.png      # AI-Generated custom album cover art (Theme 1)
│   ├── cover2.png      # AI-Generated custom album cover art (Theme 2)
│   └── cover3.png      # AI-Generated custom album cover art (Theme 3)
└── README.md           # Documentation and shortcut guide
```

---

## 🚀 Getting Started

Simply double-click [index.html](file:///Users/sajjadhossainjim/Downloads/CodeAlpha_Music-Player/index.html) to open the player in any modern web browser. 

Or host a local server inside this folder:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` to enjoy your Music Player.
