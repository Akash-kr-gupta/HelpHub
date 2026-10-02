let audioContext;

export function enableIncomingMessageSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  } catch {
    // Some browsers do not expose Web Audio.
  }
}

export function playIncomingMessageBell() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => playIncomingMessageBell()).catch(() => {});
      return;
    }

    const now = audioContext.currentTime;
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.34, now + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    masterGain.connect(audioContext.destination);

    [880, 1320].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.04);
      oscillator.connect(masterGain);
      oscillator.start(now + index * 0.04);
      oscillator.stop(now + 1.2);
    });
  } catch {
    // Some browsers block Web Audio until the user interacts with the page.
  }
}
