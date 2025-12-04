let audioCtx = null;
let gainNode = null;
let currentStyle = 'glass';

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

export const setSoundStyle = (style) => {
  currentStyle = style;
};

// Procedural Sound Generators per Style
const generateSound = (ctx, masterGain, type) => {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  const panner = ctx.createStereoPanner();
  panner.pan.value = (Math.random() * 0.4) - 0.2;

  osc.connect(gain);
  gain.connect(panner);
  panner.connect(masterGain);

  switch (currentStyle) {
    case 'mute': return;
    case 'air':
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
        osc.type = 'square';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(880, now);
             gain.gain.setValueAtTime(0.02, now);
             gain.gain.setValueAtTime(0, now + 0.02);
             osc.start(now);
             osc.stop(now + 0.03);
        } else {
             osc.frequency.setValueAtTime(440, now);
             osc.frequency.setValueAtTime(880, now + 0.05);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.1);
             osc.start(now);
             osc.stop(now + 0.1);
        }
        break;
    case 'chime':
        osc.type = 'sine';
        if (type === 'hover') {
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.connect(gain2);
            gain2.connect(panner);
            
            osc.frequency.setValueAtTime(880, now);
            osc2.frequency.setValueAtTime(1320, now); 

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
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); 
             osc.start(now);
             osc.stop(now + 0.1);
        }
        break;
    case 'spark':
        osc.type = 'sawtooth';
        if (type === 'hover') {
             osc.frequency.setValueAtTime(400, now);
             gain.gain.setValueAtTime(0.02, now);
             gain.gain.linearRampToValueAtTime(0, now + 0.05);
             osc.start(now);
             osc.stop(now + 0.05);
        } else {
             osc.frequency.setValueAtTime(200, now);
             osc.frequency.linearRampToValueAtTime(800, now + 0.1);
             gain.gain.setValueAtTime(0.05, now);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
             osc.start(now);
             osc.stop(now + 0.2);
        }
        break;
    case 'glass':
    default:
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

export const playSound = (type) => {
  initAudio();
  if (!audioCtx || !gainNode) return;
  generateSound(audioCtx, gainNode, type);
};

(window as any).playSound = playSound;
(window as any).setSoundStyle = setSoundStyle;