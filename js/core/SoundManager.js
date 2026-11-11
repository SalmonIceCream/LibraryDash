/* SoundManager: bunyi singkat, tombol suara, dan satu-satunya pengguna localStorage */
const KEY = 'libadv.sound';
export class SoundManager {
  constructor(onChange = () => {}) { this.enabled = true; this.ac = null; this.onChange = onChange; this.restore(); }
  restore() { try { this.enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) { this.enabled = true; } }
  save() { try { localStorage.setItem(KEY, this.enabled ? 'on' : 'off'); } catch (e) { /* mode privat: abaikan */ } }
  toggle(v = !this.enabled) { this.enabled = v; this.save(); this.onChange(v); this.play('klik'); }
  play(name = 'klik') {
    if (!this.enabled) return;
    const f = { klik: 520, ok: 660, salah: 300, kembali: 392, selesai: 784 }[name] || 520;
    try {
      this.ac = this.ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = this.ac.createOscillator(), g = this.ac.createGain(), t = this.ac.currentTime;
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
      o.connect(g); g.connect(this.ac.destination); o.start(t); o.stop(t + .16);
    } catch (e) { /* peramban tanpa audio: diam saja */ }
  }
}