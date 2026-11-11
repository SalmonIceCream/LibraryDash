/* MemoryMatch (UC-09): cocokkan pasangan kartu bergambar. Papan 2x3, 3x4, 4x4 */
import { $, icon } from '../screens/art.js';
import { Game } from './Game.js';
import { CLUE } from './SusunArt.js';

let level = 0;   // shortcut: tingkat hanya di memori; kembali ke 1 saat halaman dimuat ulang (localStorage hanya untuk suara)
const SYMBOL_ART = { buku: CLUE.BUKU, bintang: `<g transform="scale(1.5)">${icon(1)}</g>`, hantu: `<g transform="scale(1.4)">${icon(2)}</g>`, pensil: CLUE.PENSIL, kacamata: `<g transform="scale(1.5)">${icon(4)}</g>`, kucing: CLUE.KUCING, tanaman: CLUE.TANAMAN, globe: CLUE.GLOBE };
const ROW_H = { 2: 17, 3: 11.5, 4: 8.6 };   // tinggi kartu dalam cqw agar papan muat di adegan
const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [r[i], r[j]] = [r[j], r[i]]; } return r; };

function validate(d) {
  if (!d.levels || !d.levels.length || !d.symbols || d.symbols.length < 8) throw new Error('memori.json: minimal 8 simbol');
  for (const l of d.levels) {
    if ((l.rows * l.cols) % 2 || l.rows * l.cols / 2 > d.symbols.length || !ROW_H[l.rows]) throw new Error('memori.json: ukuran papan tidak valid');
  }
  if (d.symbols.some(s => !SYMBOL_ART[s.id])) throw new Error('memori.json: simbol tanpa gambar');
}

export class MemoryMatch extends Game {
  constructor(app) { super(app, 'memory'); }
  async begin(scene) {
    try { this.data = await this.app.content.load('memori.json'); validate(this.data); }
    catch (e) { this.app.loadError(e); return; }
    this.scene = scene; this.level = level % this.data.levels.length;
    const { rows, cols } = this.data.levels[this.level];
    const pairs = rows * cols / 2;
    this.total = pairs; this.pairs = 0; this.moves = 0; this.open = []; this.locked = false;
    this.cards = shuffle(shuffle(this.data.symbols).slice(0, pairs).flatMap(s => [s, s])).map((s, i) => ({ i, s, open: false, match: false }));
    scene.innerHTML = `<div class="mm"><p class="mm-hint">Cari pasangan yang sama!</p><div class="mm-board" style="--c:${cols};--h:${ROW_H[rows]}cqw">${this.cards.map(c =>
      `<button class="mm-card" type="button" data-i="${c.i}" aria-label="Kartu ${c.i + 1}"><span class="mm-in"><span class="mm-face mm-back"><svg viewBox="0 0 80 100" aria-hidden="true"><use href="#cb" width="80" height="100"/></svg></span><span class="mm-face mm-front"><svg viewBox="-60 -60 120 120" aria-hidden="true">${SYMBOL_ART[c.s.id]}</svg></span></span></button>`).join('')}</div></div>`;
    scene.querySelector('.mm-board').addEventListener('click', e => { const b = e.target.closest('.mm-card'); if (b) this.flip(+b.dataset.i, b); });
    this.update();
  }
  update() { this.progress(`Tingkat ${this.level + 1} · Pasangan ${this.pairs}/${this.total} · Langkah ${this.moves}`); }
  flip(i, el) {
    const c = this.cards[i];
    if (this.locked || c.open || c.match || this.open.length >= 2) return;   // ketukan cepat tidak boleh membuka kartu ketiga
    c.open = true; this.open.push(c); el.classList.add('open'); el.setAttribute('aria-label', `Kartu ${i + 1}: ${c.s.name}`);
    this.app.sound.play('klik');
    if (this.open.length < 2) return;
    this.moves++; this.locked = true;
    const [a, b] = this.open;
    if (a.s === b.s) {
      a.match = b.match = true; this.pairs++; this.open = []; this.locked = false; this.app.sound.play('ok');
      this.card(a).classList.add('match'); this.card(b).classList.add('match'); this.update();
      if (this.pairs === this.total) this.later(() => { level++; this.finish(Math.min(1, this.total * 1.6 / this.moves)); }, 800);
    } else {
      this.update();
      this.later(() => { [a, b].forEach(x => { x.open = false; const el = this.card(x); el.classList.remove('open'); el.setAttribute('aria-label', `Kartu ${x.i + 1}`); }); this.open = []; this.locked = false; }, 1000);
    }
  }
  card(c) { return this.scene.querySelector(`.mm-card[data-i="${c.i}"]`); }
  later(fn, ms) { setTimeout(() => { if (this.scene.isConnected && this.app.current === this) fn(); }, ms); }
  isComplete() { return this.pairs === this.total; }
}