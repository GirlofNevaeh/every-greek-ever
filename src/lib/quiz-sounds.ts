let audio: AudioContext | null = null;
let armed = false;

function context() {
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audio) audio = new Ctx();
  if (audio.state === "suspended") void audio.resume().catch(() => {});
  return audio;
}

/** Create the one page context and resume it on the first tap, click, or key. */
export function armQuizSounds() {
  if (armed || typeof window === "undefined") return;
  armed = true;
  const unlock = () => {
    try {
      const ctx = context();
      if (ctx && ctx.state === "running") {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      }
    } catch {
      // A failed unlock should not stop the page.
    }
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, volume: number, type: OscillatorType = "triangle") {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function withSound(run: (ctx: AudioContext, now: number) => void) {
  try {
    const ctx = context();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    run(ctx, ctx.currentTime + 0.03);
  } catch {
    // A failed sound should not stop the quiz.
  }
}

export function playCheer() {
  withSound((ctx, now) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      tone(ctx, frequency, now + index * 0.09, 0.32, 0.28);
    });
    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = "highpass";
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.25);
  });
}

export function playFart() {
  withSound((ctx, now) => {
    const duration = 0.7;
    const length = Math.floor(ctx.sampleRate * duration);
    const noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    let brown = 0;
    let phase = 0;
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate;
      phase += ((46 - (t / duration) * 24) / ctx.sampleRate) * Math.PI * 2;
      const lip = Math.sin(phase);
      const gate = lip > 0.05 ? 1 : 0.12;
      const white = Math.random() * 2 - 1;
      brown = brown * 0.8 + white * 0.2;
      data[i] = (brown * 1.4 + white * 0.45) * gate;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noise;
    filter.type = "bandpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(720, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.55);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration + 0.02);

    for (const [startHz, endHz, volume] of [
      [150, 62, 0.28],
      [300, 124, 0.16],
    ] as const) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(startHz, now);
      osc.frequency.exponentialRampToValueAtTime(endHz, now + 0.55);
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(volume, now + 0.025);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  });
}
