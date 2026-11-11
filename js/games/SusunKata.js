/* SusunKata (UC-08): susun huruf menjadi kata bertema perpustakaan. Seret atau ketuk huruf. */
import { $, DARK } from '../screens/art.js';
import { Game } from './Game.js';
import { CLUE } from './susunArt.js';

let level = 0;   // shortcut: tingkat hanya di memori; kembali ke 1 saat halaman dimuat ulang (localStorage hanya untuk suara)

const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [r[i], r[j]] = [r[j], r[i]]; } return r; };

function validate(d) {
  const ws = (d.levels || []).flatMap(l => l.words || []);
  if (!d.levels || !d.levels.length || d.levels.some(l => !l.words || l.words.length !== 5)) throw new Error('susun.json: tiap tingkat harus berisi 5 kata');
  if (ws.length < 15 || ws.some(w => !/^[A-Z]{3,7}$/.test(w.word))) throw new Error('susun.json: minimal 15 kata, 3 sampai 7 huruf A-Z');
}

export class SusunKata extends Game {
  constructor(app) { super(app, 'susun'); }
  async begin(scene) {
    try { this.data = await this.app.content.load('susun.json'); validate(this.data); }
    catch (e) { this.app.loadError(e); return; }
    this.scene = scene; this.level = level % this.data.levels.length; this.words = this.data.levels[this.level].words;
    this.idx = 0; this.ok = 0; this.bad = 0; this.helps = 0; this.dragEnd = 0;
    scene.innerHTML = `<div class="sk"><div class="sk-clue"><h3>Petunjuk</h3><svg viewBox="-60 -60 120 120" aria-hidden="true" id="sk-pic"></svg><p id="sk-hint"></p></div>
      <div class="sk-main"><div class="sk-slots" id="sk-slots" aria-label="Kotak jawaban"></div><div class="sk-tray" id="sk-tray" aria-label="Baki huruf"></div></div>
      <div class="sk-tools"><button class="btn ghost sm" type="button" id="sk-help">Bantuan</button><button class="btn ghost sm" type="button" id="sk-shuf">Acak</button></div></div>`;
    $('#sk-help').onclick = () => this.hint(); $('#sk-shuf').onclick = () => this.shuffle();
    const tray = $('#sk-tray');
    tray.addEventListener('click', e => {
      const t = e.target.closest('.sk-tile'); if (!t || this.locked || performance.now() - this.dragEnd < 300) return;
      this.put(+t.dataset.k, this.filled.indexOf(false), t);
    });
    tray.addEventListener('pointerdown', e => this.drag(e));
    this.word();
  }
  word() {
    const w = this.words[this.idx]; this.locked = false; $('#sk-slots').classList.remove('done'); this.letters = [...w.word]; this.filled = this.letters.map(() => false);
    this.tiles = this.letters.map((ch, i) => ({ id: i, ch, used: false }));
    this.order = this.shuffled(this.tiles.map(t => t.id));
    $('#sk-pic').innerHTML = CLUE[w.word] || ''; $('#sk-hint').textContent = w.hint;
    this.progress(`Tingkat ${this.level + 1} · Kata ${this.idx + 1} dari ${this.words.length}`);
    this.draw();
  }
  shuffled(ids) { let r = shuffle(ids); if (ids.length > 1 && r.every((v, i) => v === ids[i])) r = shuffle(ids); return r; }
  draw() {
    $('#sk-slots').innerHTML = this.letters.map((ch, s) => this.filled[s]
      ? `<div class="sk-slot full" data-s="${s}" style="--c:${DARK[s % 5]}">${ch}</div>` : `<div class="sk-slot" data-s="${s}"></div>`).join('');
    $('#sk-tray').innerHTML = this.order.filter(k => !this.tiles[k].used).map(k =>
      `<button class="sk-tile" type="button" data-k="${k}" style="--c:${DARK[k % 5]}" aria-label="Huruf ${this.tiles[k].ch}">${this.tiles[k].ch}</button>`).join('');
  }
  drag(e) {
    const t = e.target.closest('.sk-tile'); if (!t || this.locked) return;
    const sx = e.clientX, sy = e.clientY; let moved = false; t.setPointerCapture(e.pointerId);
    const mv = ev => { const dx = ev.clientX - sx, dy = ev.clientY - sy; if (!moved && Math.hypot(dx, dy) > 8) { moved = true; t.classList.add('drag'); } if (moved) t.style.transform = `translate(${dx}px,${dy}px)`; };
    const up = ev => {
      t.removeEventListener('pointermove', mv); t.removeEventListener('pointerup', up); t.removeEventListener('pointercancel', up);
      if (!moved) return;                       // ketukan biasa ditangani oleh event click
      this.dragEnd = performance.now(); t.style.visibility = 'hidden';
      const el = document.elementFromPoint(ev.clientX, ev.clientY); t.style.visibility = '';
      t.classList.remove('drag'); t.style.transform = '';
      const slot = el && el.closest('.sk-slot');
      if (slot && ev.type === 'pointerup') this.put(+t.dataset.k, +slot.dataset.s, t);
    };
    t.addEventListener('pointermove', mv); t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
  }
  put(k, s, el, helped = false) {
    if (this.locked || s < 0 || this.filled[s] || this.tiles[k].used) return;
    if (this.letters[s] !== this.tiles[k].ch) {
      this.bad++; this.app.sound.play('salah'); this.app.dialog.toast('Belum pas, coba huruf lain, ya!');
      if (el) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
      return;
    }
    this.tiles[k].used = true; this.filled[s] = true; helped ? this.helps++ : this.ok++;
    this.app.sound.play('ok'); this.draw();
    if (this.filled.every(Boolean)) this.done();
  }
  hint() {
    if (this.locked) return;
    const s = this.filled.indexOf(false), t = this.tiles.find(x => !x.used && x.ch === this.letters[s]);
    this.app.sound.play('klik'); if (t) this.put(t.id, s, null, true);
  }
  shuffle() { if (this.locked) return; this.order = this.shuffled(this.order); this.app.sound.play('klik'); this.draw(); }
  done() {
    this.locked = true; this.app.dialog.toast('Benar! ' + this.letters.join(''));
    $('#sk-slots').classList.add('done');
    setTimeout(() => {
      if (!this.scene.isConnected || this.app.current !== this) return;
      if (++this.idx < this.words.length) { this.word(); return; }
      level++; this.finish(this.ok / (this.ok + this.bad + this.helps));
    }, 1100);
  }
}