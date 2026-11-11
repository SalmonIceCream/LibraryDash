/* Game: kelas induk. Menyediakan rangka layar permainan, jeda, keluar, dan layar selesai */
import { $, INK, star } from '../screens/art.js';
import { ResultCalculator } from '../core/ResultCalculator.js';

const PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="2" fill="currentColor"/><rect x="14" y="4" width="5" height="16" rx="2" fill="currentColor"/></svg>';
const STARS = n => `<svg viewBox="0 0 300 110" aria-hidden="true"><g stroke="${INK}" stroke-width="3">${[60, 150, 240].map((x, i) => star(x, i === 1 ? 48 : 62, i === 1 ? 46 : 34, i < n ? '#E2A63A' : '#E6D2AA')).join('')}</g></svg>`;

export class Game {
  constructor(app, id) { this.app = app; this.id = id; this.meta = app.game(id); this.state = 'idle'; this.calc = new ResultCalculator(); }
  start() {
    this.state = 'play';
    $('#s-game').innerHTML = `<header class="g-top"><button class="round" type="button" id="g-pause" aria-label="Jeda dan pengaturan">${PAUSE}</button><h2 id="g-title"></h2><span class="badge" id="g-prog" aria-live="polite"></span></header><div class="g-scene" id="g-scene"></div>`;
    $('#g-title').textContent = this.meta.name;
    $('#g-pause').onclick = () => { this.app.sound.play('klik'); this.pause(); };
    this.begin($('#g-scene'));
  }
  begin() { /* diisi tiap permainan */ }
  progress(text) { $('#g-prog').textContent = text; }
  pause() {
    this.state = 'pause';
    this.app.dialog.open({ title: 'Permainan dijeda', body: this.app.swRow(), onClose: () => { this.state = 'play'; },
      actions: [{ label: 'Lanjut Bermain' }, { label: 'Bantuan', cls: 'ghost', fn: () => this.app.help() }, { label: 'Kembali ke Perpustakaan', cls: 'ghost', fn: () => this.confirmExit() }] });
  }
  confirmExit() {
    this.app.dialog.open({ title: 'Kembali ke perpustakaan?', body: 'Permainan ini akan dihentikan.', cancel: false,
      actions: [{ label: 'Tetap di sini', cls: 'ghost' }, { label: 'Ya, kembali', fn: () => { this.app.sound.play('kembali'); this.app.goTo('world'); } }] });
  }
  finish(accuracy = 1) {
    this.state = 'done'; this.app.sound.play('selesai');
    this.app.dialog.open({ art: STARS(this.calc.stars(accuracy)), title: 'Hebat sekali!', body: this.calc.lesson(this.meta), cancel: false,
      actions: [{ label: 'Main lagi', fn: () => this.restart() }, { label: 'Kembali ke Perpustakaan', cls: 'ghost', fn: () => this.app.goTo('world') }] });
  }
  restart() { this.app.startGame(this.id); }
}