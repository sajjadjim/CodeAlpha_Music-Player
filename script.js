/* ==========================================================================
   MUSIC PLAYER - CORE AUDIO ENGINE
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Tracks Database & Assets
// --------------------------------------------------------------------------
const TRACKS_PLAYLIST = [
  {
    id: 0,
    title: "Neon Odyssey",
    artist: "Minimal Echo",
    genre: "Synthwave",
    cover: "assets/cover1.png",
    // Standard high-quality test audio tracks
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    colorClass: "theme-cyberpunk",
    durationText: "6:12"
  },
  {
    id: 1,
    title: "Retro Dreams",
    artist: "Solstice Echo",
    genre: "Retrowave",
    cover: "assets/cover2.png",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    colorClass: "theme-synthwave",
    durationText: "7:05"
  },
  {
    id: 2,
    title: "Cosmos Voyage",
    artist: "Lofi Astronaut",
    genre: "Ambient Lofi",
    cover: "assets/cover3.png",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    colorClass: "theme-lofi",
    durationText: "5:44"
  }
];

// Offline Synthesized Tracks list
const SYNTH_PLAYLIST = [
  {
    id: 100,
    title: "Warm Vinyl Rain",
    artist: "Procedural Synth",
    genre: "Generative Lofi",
    cover: "assets/cover3.png",
    colorClass: "theme-lofi",
    durationText: "Infinite",
    tempo: 75,
    progression: [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [110.00, 130.81, 164.81, 196.00], // Am7 (A2, C3, E3, G3)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [98.00, 146.83, 196.00, 246.94]   // G7 (G2, D3, G3, B3)
    ]
  },
  {
    id: 101,
    title: "Neon Tokyo Sleep",
    artist: "Procedural Synth",
    genre: "Ambient Cyber",
    cover: "assets/cover1.png",
    colorClass: "theme-cyberpunk",
    durationText: "Infinite",
    tempo: 85,
    progression: [
      [146.83, 174.61, 220.00, 293.66], // Dm9 (D3, F3, A3, D4)
      [164.81, 196.00, 246.94, 329.63], // Em7 (E3, G3, B3, E4)
      [130.81, 164.81, 196.00, 261.63], // Cmaj7 (C3, E3, G3, C4)
      [146.83, 174.61, 220.00, 293.66]  // Dm9 (D3, F3, A3, D4)
    ]
  },
  {
    id: 102,
    title: "Vaporwave Sunset",
    artist: "Procedural Synth",
    genre: "Retrowave Synth",
    cover: "assets/cover2.png",
    colorClass: "theme-synthwave",
    durationText: "Infinite",
    tempo: 90,
    progression: [
      [110.00, 146.83, 164.81, 220.00], // Fmaj7 (F2, D3, E3, A3)
      [116.54, 146.83, 174.61, 233.08], // Bbmaj7 (Bb2, D3, F3, Bb3)
      [130.81, 164.81, 196.00, 261.63], // Cmaj7 (C3, E3, G3, C4)
      [98.00, 146.83, 196.00, 246.94]   // G7 (G2, D3, G3, B3)
    ]
  }
];

// --------------------------------------------------------------------------
// 2. Global Player State
// --------------------------------------------------------------------------
let isPlaying = false;
let isMuted = false;
let currentTrackIndex = 0;
let previousVolume = 0.8;
let repeatMode = 2; // 0 = no repeat, 1 = repeat one, 2 = repeat all
let isShuffle = false;
let isSynthMode = false; // true = generative music synth, false = cloud mp3s

// Active Playlist points to standard tracks initially
let activePlaylist = TRACKS_PLAYLIST;

// Synth scheduler variables
let audioCtx = null;
let synthTimer = null;
let synthBeatCount = 0;
let currentChordIndex = 0;
let isSynthRunning = false;

// Floating notes rate control
let lastNoteTime = 0;

// --------------------------------------------------------------------------
// 3. DOM Element Cache
// --------------------------------------------------------------------------
const playerCard = document.getElementById("playerCard");
const audioPlayer = document.getElementById("audioPlayer");

// Metadata
const coverArt = document.getElementById("coverArt");
const artFrame = document.getElementById("artFrame");
const artShadow = document.getElementById("artShadow");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const songGenre = document.getElementById("songGenre");

// Control buttons
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const repeatBadge = document.getElementById("repeatBadge");

// Range sliders
const progressSlider = document.getElementById("progressSlider");
const progressFill = document.getElementById("progressFill");
const progressTooltip = document.getElementById("progressTooltip");
const currentTimeLabel = document.getElementById("currentTime");
const totalDurationLabel = document.getElementById("totalDuration");

const volumeSlider = document.getElementById("volumeSlider");
const volumeFill = document.getElementById("volumeFill");
const muteBtn = document.getElementById("muteBtn");
const volHighIcon = document.getElementById("volHighIcon");
const volMuteIcon = document.getElementById("volMuteIcon");

// Playlist Drawer elements
const playlistDrawer = document.getElementById("playlistDrawer");
const playlistToggleBtn = document.getElementById("playlistToggleBtn");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const playlistItems = document.getElementById("playlistItems");
const modeToggleBtn = document.getElementById("modeToggleBtn");
const playlistSourceInfo = document.getElementById("playlistSourceInfo");
const floatingNotes = document.getElementById("floatingNotes");

// Equalizer
const visualizerContainer = document.getElementById("visualizerContainer");

// --------------------------------------------------------------------------
// 4. Initializer
// --------------------------------------------------------------------------
function init() {
  loadTrack(currentTrackIndex);
  renderPlaylist();
  setupEventListeners();
  updateVolumeUI(volumeSlider.value / 100);
  
  // Set starting repeat UI state (2 = repeat all, active initially)
  repeatBtn.classList.add("btn-active");
  repeatBadge.style.opacity = "0";
}

// Load track details
function loadTrack(index) {
  const track = activePlaylist[index];
  
  // Reset cover art rotation state
  coverArt.style.animation = 'none';
  // Force reflow
  void coverArt.offsetWidth; 
  if (isPlaying) {
    coverArt.style.animation = '';
  }

  // Update text & art metadata
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  songGenre.textContent = track.genre;
  coverArt.src = track.cover;
  
  // Apply dynamic color class to body and wrapper to shift ambient glow
  document.body.className = track.colorClass;
  playerCard.className = `player-card ${track.colorClass}`;

  if (!isSynthMode) {
    audioPlayer.src = track.url;
    audioPlayer.load();
    
    // Reset Progress Elements
    currentTimeLabel.textContent = "0:00";
    totalDurationLabel.textContent = track.durationText;
    progressSlider.value = 0;
    progressFill.style.width = "0%";
  } else {
    // Synth infinite track reset
    currentTimeLabel.textContent = "--:--";
    totalDurationLabel.textContent = "Infinite";
    progressSlider.value = 0;
    progressFill.style.width = "100%";
  }

  // Highlight track in playlist drawer
  updatePlaylistHighlight();
}

// --------------------------------------------------------------------------
// 5. Play / Pause Control Panel
// --------------------------------------------------------------------------
function togglePlay() {
  if (isSynthMode) {
    if (isPlaying) {
      pauseSynth();
    } else {
      playSynth();
    }
  } else {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }
}

function playAudio() {
  audioPlayer.play()
    .then(() => {
      isPlaying = true;
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      playerCard.classList.add("playing");
      triggerNotesEmitter(true);
    })
    .catch((err) => {
      console.warn("Failed playing track from CDN, switching to procedural Synth offline fallback...", err);
      // Automatically fallback to synth mode
      toggleSynthMode(true);
    });
}

function pauseAudio() {
  audioPlayer.pause();
  isPlaying = false;
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
  playerCard.classList.remove("playing");
  triggerNotesEmitter(false);
}

// Skip forward
function nextTrack() {
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * activePlaylist.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % activePlaylist.length;
  }
  
  loadTrack(currentTrackIndex);
  
  if (isPlaying) {
    if (isSynthMode) {
      // Re-trigger synth play loop
      pauseSynth();
      playSynth();
    } else {
      playAudio();
    }
  }
}

// Skip backward
function prevTrack() {
  // If track has been playing for more than 4 seconds, restart track instead of skipping
  if (!isSynthMode && audioPlayer.currentTime > 4) {
    audioPlayer.currentTime = 0;
    return;
  }

  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * activePlaylist.length);
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + activePlaylist.length) % activePlaylist.length;
  }

  loadTrack(currentTrackIndex);

  if (isPlaying) {
    if (isSynthMode) {
      pauseSynth();
      playSynth();
    } else {
      playAudio();
    }
  }
}

// --------------------------------------------------------------------------
// 6. Interactive Seek Slider & Time Formatter
// --------------------------------------------------------------------------
function updateProgressBar() {
  if (isSynthMode || !audioPlayer.duration) return;

  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  const progressPercent = (current / duration) * 100;

  progressSlider.value = progressPercent;
  progressFill.style.width = `${progressPercent}%`;
  currentTimeLabel.textContent = formatTime(current);
}

// Seek directly on progress click/drag
function seekTrack() {
  if (isSynthMode || !audioPlayer.duration) return;
  const seekTime = (progressSlider.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
  progressFill.style.width = `${progressSlider.value}%`;
}

// Format seconds into minutes:seconds
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Tooltip on hovering track progress slider
function showProgressTooltip(e) {
  if (isSynthMode || !audioPlayer.duration) return;

  const sliderWidth = progressSlider.clientWidth;
  const clickX = e.offsetX;
  const hoverPercent = (clickX / sliderWidth);
  const hoverTime = hoverPercent * audioPlayer.duration;

  progressTooltip.textContent = formatTime(hoverTime);
  progressTooltip.style.left = `${clickX}px`;
}

// --------------------------------------------------------------------------
// 7. Volume Engine
// --------------------------------------------------------------------------
function changeVolume() {
  const volValue = volumeSlider.value / 100;
  audioPlayer.volume = volValue;
  updateVolumeUI(volValue);
  
  if (volValue > 0) {
    isMuted = false;
    previousVolume = volValue;
  }
}

function updateVolumeUI(volume) {
  volumeFill.style.width = `${volume * 100}%`;
  
  if (volume === 0) {
    volHighIcon.classList.add("hidden");
    volMuteIcon.classList.remove("hidden");
  } else {
    volHighIcon.classList.remove("hidden");
    volMuteIcon.classList.add("hidden");
  }
}

function toggleMute() {
  if (isMuted) {
    // Unmute
    audioPlayer.volume = previousVolume;
    volumeSlider.value = previousVolume * 100;
    updateVolumeUI(previousVolume);
    isMuted = false;
  } else {
    // Mute
    previousVolume = volumeSlider.value / 100;
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    updateVolumeUI(0);
    isMuted = true;
  }
}

// --------------------------------------------------------------------------
// 8. Loop, Shuffle & Autoplay
// --------------------------------------------------------------------------
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("btn-active", isShuffle);
}

function toggleRepeat() {
  // Cycle: 2 (Repeat All) -> 1 (Repeat One) -> 0 (No Repeat)
  if (repeatMode === 2) {
    repeatMode = 1;
    repeatBtn.classList.add("btn-active");
    repeatBtn.classList.add("repeat-one");
  } else if (repeatMode === 1) {
    repeatMode = 0;
    repeatBtn.classList.remove("btn-active");
    repeatBtn.classList.remove("repeat-one");
  } else {
    repeatMode = 2;
    repeatBtn.classList.add("btn-active");
    repeatBtn.classList.remove("repeat-one");
  }
}

// Track end event handler
function handleTrackEnd() {
  if (repeatMode === 1) {
    // Loop active song
    if (isSynthMode) return;
    audioPlayer.currentTime = 0;
    playAudio();
  } else if (repeatMode === 2) {
    // Loop entire list
    nextTrack();
  } else {
    // No repeat: stop playing if we reached end of standard tracks list
    if (currentTrackIndex === activePlaylist.length - 1 && !isShuffle) {
      pauseAudio();
    } else {
      nextTrack();
    }
  }
}

// --------------------------------------------------------------------------
// 9. Playlist Drawer Actions & DOM Populator
// --------------------------------------------------------------------------
function togglePlaylistDrawer() {
  playlistDrawer.classList.toggle("drawer-open");
}

function renderPlaylist() {
  playlistItems.innerHTML = "";
  
  activePlaylist.forEach((track, index) => {
    const item = document.createElement("div");
    item.className = `track-item ${index === currentTrackIndex ? "track-active" : ""}`;
    item.dataset.index = index;
    
    item.innerHTML = `
      <img src="${track.cover}" class="track-cover-mini" alt="${track.title}">
      <div class="track-info">
        <h4 class="track-title">${track.title}</h4>
        <p class="track-artist">${track.artist}</p>
      </div>
      <div class="track-right-sec">
        <span class="track-duration">${track.durationText}</span>
        <div class="speaker-wave">
          <span class="span-1"></span>
          <span class="span-2"></span>
          <span class="span-3"></span>
        </div>
      </div>
    `;
    
    item.addEventListener("click", () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      
      if (!isPlaying) {
        isPlaying = true;
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
        playerCard.classList.add("playing");
      }
      
      if (isSynthMode) {
        pauseSynth();
        playSynth();
      } else {
        playAudio();
      }
      
      // Auto-close drawer on selection for clean mobile UX
      setTimeout(() => {
        playlistDrawer.classList.remove("drawer-open");
      }, 300);
    });
    
    playlistItems.appendChild(item);
  });
}

function updatePlaylistHighlight() {
  const items = playlistItems.querySelectorAll(".track-item");
  items.forEach((item, idx) => {
    if (idx === currentTrackIndex) {
      item.classList.add("track-active");
      if (isPlaying) {
        item.classList.add("playing");
      } else {
        item.classList.remove("playing");
      }
      // Scroll to view if out of viewport
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove("track-active");
      item.classList.remove("playing");
    }
  });
}

// Toggle between procedural Web Audio synthesizer vs Cloud mp3 files
function toggleSynthMode(forceState = null) {
  const targetState = (forceState !== null) ? forceState : !isSynthMode;
  
  if (targetState === isSynthMode) return;
  
  isSynthMode = targetState;
  
  if (isSynthMode) {
    // Switch to Procedural synth offline playlist
    pauseAudio();
    activePlaylist = SYNTH_PLAYLIST;
    currentTrackIndex = 0;
    modeToggleBtn.classList.add("synth-mode-active");
    playlistSourceInfo.innerHTML = 'Playing offline <strong>Synthesizer Loops</strong>';
  } else {
    // Switch to Standard tracks
    pauseSynth();
    activePlaylist = TRACKS_PLAYLIST;
    currentTrackIndex = 0;
    modeToggleBtn.classList.remove("synth-mode-active");
    playlistSourceInfo.innerHTML = 'Playing from <strong>Cloud Network</strong>';
  }
  
  renderPlaylist();
  loadTrack(currentTrackIndex);
  
  if (isPlaying) {
    if (isSynthMode) {
      playSynth();
    } else {
      playAudio();
    }
  }
}

// --------------------------------------------------------------------------
// 10. Web Audio API Generative Lofi Beats Engine (Bulletproof Offline UX)
// --------------------------------------------------------------------------
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSynth() {
  initAudioContext();
  isPlaying = true;
  isSynthRunning = true;
  
  playIcon.classList.add("hidden");
  pauseIcon.classList.remove("hidden");
  playerCard.classList.add("playing");
  triggerNotesEmitter(true);
  
  synthBeatCount = 0;
  currentChordIndex = 0;
  
  const bpm = activePlaylist[currentTrackIndex].tempo;
  const beatDurationSeconds = 60 / bpm;
  
  // Main scheduling timer loop
  scheduler(beatDurationSeconds);
}

function pauseSynth() {
  isSynthRunning = false;
  isPlaying = false;
  if (synthTimer) {
    clearTimeout(synthTimer);
    synthTimer = null;
  }
  
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
  playerCard.classList.remove("playing");
  triggerNotesEmitter(false);
  
  // Smooth visualizer bars height reset
  const bars = visualizerContainer.querySelectorAll(".bar");
  bars.forEach(b => b.style.height = "4px");
}

function scheduler(beatDuration) {
  if (!isSynthRunning) return;
  
  const now = audioCtx.currentTime;
  
  // Every 4 beats, progress chord progression
  if (synthBeatCount % 4 === 0) {
    const progression = activePlaylist[currentTrackIndex].progression;
    currentChordIndex = (Math.floor(synthBeatCount / 4)) % progression.length;
    playSynthChord(progression[currentChordIndex], now);
  }
  
  // Play rhythm drum beats
  playDrumSynth(synthBeatCount, now);
  
  // Random cute pentatonic melody triggers
  if (Math.random() > 0.4 && synthBeatCount % 2 !== 0) {
    playRandomMelody(now);
  }
  
  synthBeatCount++;
  
  // Trigger micro-bouncing visualizer equalizer bars custom height
  bounceVisualizerBars();
  
  // Schedule next beat interval
  synthTimer = setTimeout(() => {
    scheduler(beatDuration);
  }, beatDuration * 1000);
}

// Bounces visualizer bars when Synthesizer beats play
function bounceVisualizerBars() {
  const bars = visualizerContainer.querySelectorAll(".bar");
  bars.forEach(bar => {
    const randomHeight = Math.floor(Math.random() * 20) + 5;
    bar.style.height = `${randomHeight}px`;
    setTimeout(() => {
      if (isPlaying) bar.style.height = `${Math.floor(randomHeight/2)}px`;
    }, 150);
  });
}

// Generate synthesizer cozy chord pads
function playSynthChord(frequencies, startTime) {
  // Dynamic gain nodes to prevent clipping
  const masterVolume = volumeSlider.value / 100;
  if (masterVolume === 0) return;
  
  const chordFilter = audioCtx.createBiquadFilter();
  chordFilter.type = 'lowpass';
  chordFilter.frequency.setValueAtTime(450, startTime);
  chordFilter.Q.setValueAtTime(1, startTime);
  
  const chordGain = audioCtx.createGain();
  chordGain.gain.setValueAtTime(0.06 * masterVolume, startTime);
  // Warm slow envelope fade-in
  chordGain.gain.exponentialRampToValueAtTime(0.12 * masterVolume, startTime + 0.8);
  chordGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.9);
  
  chordFilter.connect(chordGain);
  chordGain.connect(audioCtx.destination);
  
  frequencies.forEach(freq => {
    const osc = audioCtx.createOscillator();
    // Warm soft triangle wave
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    
    osc.connect(chordFilter);
    osc.start(startTime);
    osc.stop(startTime + 3.0);
  });
}

// Generate procedurally synthesized rhythm beats (lofi kick/brush)
function playDrumSynth(beat, startTime) {
  const masterVolume = volumeSlider.value / 100;
  if (masterVolume === 0) return;

  // Lofi Kick Drum on beat 0 and 2
  if (beat % 2 === 0) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.frequency.setValueAtTime(150, startTime);
    // Pitch sweep downwards
    osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.15);
    
    gain.gain.setValueAtTime(0.18 * masterVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }
  
  // Brush/Snare on odd beats (soft noise bursts)
  if (beat % 2 !== 0) {
    // Generate simple white noise
    const bufferSize = audioCtx.sampleRate * 0.12; // 0.12s
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // Snare low pass to sound warm/lofi
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, startTime);
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08 * masterVolume, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.11);
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noiseNode.start(startTime);
  }
}

// Generate pentatonic light lead melodies
function playRandomMelody(startTime) {
  const masterVolume = volumeSlider.value / 100;
  if (masterVolume === 0) return;
  
  // C-Major Pentatonic scale mapping
  const melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
  const randomFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.type = 'sine'; // pure elegant tone
  osc.frequency.setValueAtTime(randomFreq, startTime);
  
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, startTime);
  
  gain.gain.setValueAtTime(0.01, startTime);
  gain.gain.linearRampToValueAtTime(0.08 * masterVolume, startTime + 0.05); // soft pluck envelope
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + 0.95);
  
  // Emit floating visual notes in rhythm!
  emitFloatingNote();
}

// --------------------------------------------------------------------------
// 11. Custom Interactive Visual Animations (Floating Music Notes)
// --------------------------------------------------------------------------
function emitFloatingNote() {
  const now = Date.now();
  if (now - lastNoteTime < 400) return; // rate limit note emissions
  lastNoteTime = now;

  const noteSymbols = ["♫", "♪", "♬", "♩", "♥"];
  const symbol = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
  
  const note = document.createElement("span");
  note.className = "music-note";
  note.textContent = symbol;
  
  // Start near the album cover
  const startX = 110 + (Math.random() * 30 - 15);
  const startY = 110 + (Math.random() * 30 - 15);
  
  // Direction vectors
  const dx = (Math.random() * 160 - 80) + "px";
  const dy = -(Math.random() * 120 + 80) + "px";
  const rot = (Math.random() * 180 - 90) + "deg";
  
  note.style.left = `${startX}px`;
  note.style.top = `${startY}px`;
  note.style.setProperty("--dx", dx);
  note.style.setProperty("--dy", dy);
  note.style.setProperty("--rot", rot);
  
  floatingNotes.appendChild(note);
  
  // Remove after animation completes
  setTimeout(() => {
    note.remove();
  }, 3500);
}

let emitterTimer = null;
function triggerNotesEmitter(start) {
  if (start) {
    if (emitterTimer) clearInterval(emitterTimer);
    // Automatically emit note symbols every 1.5s
    emitterTimer = setInterval(() => {
      emitFloatingNote();
    }, 1500);
  } else {
    if (emitterTimer) {
      clearInterval(emitterTimer);
      emitterTimer = null;
    }
  }
}

// --------------------------------------------------------------------------
// 12. DOM Event Listeners Wire-up
// --------------------------------------------------------------------------
function setupEventListeners() {
  // Play button click
  playBtn.addEventListener("click", togglePlay);

  // Skip buttons click
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  // Mode/Synthesizer switcher click
  modeToggleBtn.addEventListener("click", () => toggleSynthMode());

  // Shuffle & Repeat buttons click
  shuffleBtn.addEventListener("click", toggleShuffle);
  repeatBtn.addEventListener("click", toggleRepeat);

  // HTML5 audio player updates
  audioPlayer.addEventListener("timeupdate", updateProgressBar);
  audioPlayer.addEventListener("ended", handleTrackEnd);
  
  // Load event to populate final metadata total duration once loaded
  audioPlayer.addEventListener("loadedmetadata", () => {
    if (!isSynthMode) {
      totalDurationLabel.textContent = formatTime(audioPlayer.duration);
    }
  });

  // Seek bar events
  progressSlider.addEventListener("input", seekTrack);
  progressSlider.addEventListener("change", seekTrack);
  progressSlider.addEventListener("mousemove", showProgressTooltip);

  // Volume slider events
  volumeSlider.addEventListener("input", changeVolume);
  volumeSlider.addEventListener("change", changeVolume);
  muteBtn.addEventListener("click", toggleMute);

  // Playlist drawer open/close
  playlistToggleBtn.addEventListener("click", togglePlaylistDrawer);
  closeDrawerBtn.addEventListener("click", () => playlistDrawer.classList.remove("drawer-open"));

  // Keyboard shortcut keys triggers for tactile music playback
  window.addEventListener("keydown", (e) => {
    // Avoid executing shortcuts if user is typing (not applicable since no inputs, but safe practice)
    if (document.activeElement.tagName === "INPUT" && document.activeElement.type === "text") return;
    
    switch (e.code) {
      case "Space":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        if (e.ctrlKey || e.metaKey) {
          nextTrack();
        } else if (!isSynthMode) {
          audioPlayer.currentTime += 5; // seek forward 5s
        }
        break;
      case "ArrowLeft":
        if (e.ctrlKey || e.metaKey) {
          prevTrack();
        } else if (!isSynthMode) {
          audioPlayer.currentTime -= 5; // seek back 5s
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        volumeSlider.value = Math.min(parseInt(volumeSlider.value) + 5, 100);
        changeVolume();
        break;
      case "ArrowDown":
        e.preventDefault();
        volumeSlider.value = Math.max(parseInt(volumeSlider.value) - 5, 0);
        changeVolume();
        break;
      case "KeyM":
        toggleMute();
        break;
      case "KeyS":
        toggleShuffle();
        break;
      case "KeyR":
        toggleRepeat();
        break;
      case "KeyP":
        togglePlaylistDrawer();
        break;
    }
  });
}

// --------------------------------------------------------------------------
// 13. DOM DOMContentLoaded Trigger
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", init);
