import { SoundStyle } from '../types';

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let currentStyle: SoundStyle = 'glass';

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.3; // Master volume
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setSoundStyle = (style: SoundStyle) => {
  currentStyle = style;
};

// Procedural Sound Generators per Style
const generateSound = (ctx: AudioContext, masterGain: GainNode, type: 'hover' | 'click' | 'success' | 'error' | 'open' | 'ripple') => {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Stereo Panner
  const panner = ctx.createStereoPanner();
  panner.pan.value = (Math.random() * 0.4) - 0.2; // Slight panning

  osc.connect(gain);
  gain.connect(panner);
  panner.connect(masterGain);

  switch (currentStyle) {
    case 'mute':
        // Do nothing
        return;

    // --- NEW STYLES ---

    case 'air':
        // Minimal Air Whisper: Uses noise buffer mostly, but simulating with smooth sine here for simplicity and performance
        // A real implementation might use a noise buffer, but for "no assets", high freq sine/triangle works well for "air"
        osc.type = 'triangle';
        if (type === 'hover') {
            osc.frequency.setValueAtTime(2000, now);
            gain.gain.setValueAtTime(0.005, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
        break;

    case 'pixel':
        // Retro Pixel Beep: Square waves, arpeggios
        osc.type = 'square';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(880, now);
             gain.gain.setValueAtTime(0.02, now);
             gain.gain.setValueAtTime(0, now + 0.02);
             osc.start(now);
             osc.stop(now + 0.03);
        } else {
             // 8-bit jump sound
             osc.frequency.setValueAtTime(440, now);
             osc.frequency.setValueAtTime(880, now + 0.05);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.1);
             osc.start(now);
             osc.stop(now + 0.1);
        }
        break;

    case 'chime':
        // Luxury Chime: Longer decay, sine waves, harmonic
        osc.type = 'sine';
        if (type === 'hover') {
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else {
            // Add a secondary harmonic for "expensive" feel
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.connect(gain2);
            gain2.connect(panner);
            
            osc.frequency.setValueAtTime(880, now);
            osc2.frequency.setValueAtTime(1320, now); // 5th

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            gain2.gain.setValueAtTime(0.05, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.start(now);
            osc2.start(now);
            osc.stop(now + 0.6);
            osc2.stop(now + 0.6);
        }
        break;

    case 'wood':
        // Wooden Tick: Short, muted sine/triangle, pitch drop
        osc.type = 'sine';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(300, now);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
             osc.start(now);
             osc.stop(now + 0.03);
        } else {
             osc.frequency.setValueAtTime(600, now);
             osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
             gain.gain.setValueAtTime(0.2, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); // Very short decay
             osc.start(now);
             osc.stop(now + 0.1);
        }
        break;

    case 'spark':
        // Energetic Spark: Sawtooth, quick slide
        osc.type = 'sawtooth';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(400, now);
             gain.gain.setValueAtTime(0.02, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.05);
             osc.start(now);
             osc.stop(now + 0.05);
        } else {
             // Zap sound
             osc.frequency.setValueAtTime(200, now);
             osc.frequency.linearRampToValueAtTime(800, now + 0.1);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
             osc.start(now);
             osc.stop(now + 0.2);
        }
        break;

    // --- EXISTING STYLES ---

    case 'digital':
        // Digital Pulse: Square waves, short bleeps
        osc.type = 'square';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(800, now);
             gain.gain.setValueAtTime(0.02, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
             osc.start(now);
             osc.stop(now + 0.03);
        } else if (type === 'click') {
             osc.frequency.setValueAtTime(600, now);
             osc.frequency.linearRampToValueAtTime(300, now + 0.05);
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
             osc.start(now);
             osc.stop(now + 0.05);
        } else {
             osc.type = 'sine';
             osc.frequency.setValueAtTime(type === 'success' ? 880 : 150, now);
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
             osc.start(now);
             osc.stop(now + 0.2);
        }
        break;

    case 'thump':
        // Haptic Thump: Low sine waves, bassy
        osc.type = 'sine';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(100, now);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
             osc.start(now);
             osc.stop(now + 0.05);
        } else if (type === 'click') {
             osc.frequency.setValueAtTime(80, now);
             osc.frequency.linearRampToValueAtTime(40, now + 0.08);
             gain.gain.setValueAtTime(0.3, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
             osc.start(now);
             osc.stop(now + 0.1);
        } else {
             osc.frequency.setValueAtTime(type === 'success' ? 200 : 80, now);
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
             osc.start(now);
             osc.stop(now + 0.3);
        }
        break;

    case 'clean':
        // Clean Click: High frequency short tick + body
        osc.type = 'triangle';
        if (type === 'hover') {
            osc.frequency.setValueAtTime(2000, now);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
            osc.start(now);
            osc.stop(now + 0.01);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        } else {
             osc.frequency.setValueAtTime(type === 'success' ? 1000 : 200, now);
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
             osc.start(now);
             osc.stop(now + 0.2);
        }
        break;

    case 'bubble':
        // Bubble Pop: Pitch bend upwards
        osc.type = 'sine';
        if (type === 'hover') {
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(400, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else {
             osc.frequency.setValueAtTime(type === 'success' ? 500 : 200, now);
             osc.frequency.linearRampToValueAtTime(type === 'success' ? 1000 : 100, now + 0.2);
             gain.gain.setValueAtTime(0.1, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
             osc.start(now);
             osc.stop(now + 0.2);
        }
        break;

    case 'glass':
    default:
        // Soft Glass Tap (Original)
        if (type === 'hover') {
             osc.type = 'sine';
             osc.frequency.setValueAtTime(800, now);
             osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
             osc.start(now);
             osc.stop(now + 0.06);
        } else if (type === 'click') {
             osc.type = 'triangle';
             osc.frequency.setValueAtTime(400, now);
             osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
             gain.gain.setValueAtTime(0.2, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
             osc.start(now);
             osc.stop(now + 0.2);
        } else if (type === 'success') {
             osc.type = 'sine';
             osc.frequency.setValueAtTime(440, now);
             osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
             gain.gain.setValueAtTime(0, now);
             gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
             osc.start(now);
             osc.stop(now + 0.7);
        } else if (type === 'error') {
             osc.type = 'sawtooth';
             osc.frequency.setValueAtTime(150, now);
             osc.frequency.linearRampToValueAtTime(100, now + 0.2);
             gain.gain.setValueAtTime(0.2, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
             osc.start(now);
             osc.stop(now + 0.35);
        } else if (type === 'open') {
             osc.type = 'sine';
             osc.frequency.setValueAtTime(200, now);
             osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
             gain.gain.setValueAtTime(0, now);
             gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
             gain.gain.linearRampToValueAtTime(0, now + 0.5);
             osc.start(now);
             osc.stop(now + 0.5);
        } else if (type === 'ripple') {
             osc.type = 'sine';
             osc.frequency.setValueAtTime(180, now);
             osc.frequency.linearRampToValueAtTime(185, now + 1);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.linearRampToValueAtTime(0, now + 1);
             osc.start(now);
             osc.stop(now + 1);
        }
        break;
  }
};

export const playSound = (type: 'hover' | 'click' | 'success' | 'error' | 'open' | 'ripple') => {
  initAudio();
  if (!audioCtx || !gainNode) return;
  generateSound(audioCtx, gainNode, type);
};