/* World (UC-02): dunia perpustakaan; ketuk sekali = sorot, ketuk lagi = buka tutorial */
import { $, $$, worldSVG } from './art.js';
export class World {
  constructor(app) { this.app = app; this.sel = null; this.tip = $('#tip'); }
  render() {
    const w = $('#world'); w.innerHTML = worldSVG();
    w.addEventListener('click', e => {
      const s = e.target.closest('.spot');
      if (!s) { this.clear(); return; }
      const id = s.dataset.g;
      this.sel === id ? this.app.openTutorial(id) : this.select(id);
    });
    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('svg [role=button]')) {
        e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    const go = e => { e.stopPropagation(); if (this.sel) this.app.openTutorial(this.sel); };
    $('#tip-go').onclick = go; this.tip.onclick = go;
  }
  select(id) {
    const g = this.app.game(id); this.sel = id;
    $$('.spot').forEach(s => s.classList.toggle('sel', s.dataset.g === id));
    $('#world').classList.add('has-sel');
    this.app.theme(this.tip, id);
    $('#tip-t').textContent = g.name; $('#tip-p').textContent = g.invite;
    this.tip.style.left = (g.pin[0] / 16) + '%'; this.tip.style.top = ((g.pin[1] - 36) / 9) + '%';
    this.tip.classList.add('on'); $('#hint').textContent = 'Ketuk lagi untuk masuk!';
    this.app.sound.play('klik');
  }
  clear() {
    this.sel = null;
    $$('.spot').forEach(s => s.classList.remove('sel'));
    $('#world').classList.remove('has-sel'); this.tip.classList.remove('on');
    $('#hint').textContent = 'Ketuk sebuah tempat untuk melihatnya.';
  }
}