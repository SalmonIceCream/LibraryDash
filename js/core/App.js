/* App: layar aktif, navigasi, tema permainan, tombol util (suara, bantuan, beranda) */
import { $, $$, installSymbols } from '../screens/art.js';
import { ContentLoader } from './ContentLoader.js';
import { DialogManager } from './DialogManager.js';
import { SoundManager } from './SoundManager.js';
import { ScreenManager } from './ScreenManager.js';
import { Opening } from '../screens/Opening.js';
import { World } from '../screens/World.js';
import { Tutorial } from '../screens/Tutorial.js';

export class App {
  constructor() {
    this.stage = $('#stage'); this.wrap = $('#wrap');
    this.content = new ContentLoader();
    this.dialog = new DialogManager();
    this.sound = new SoundManager(v => this.syncSound(v));
    this.screens = new ScreenManager(this.stage);
    this.games = {};      // kelas permainan didaftarkan di sini: games.kenali = KenaliPerpustakaan, dst.
    this.data = null; this.currentScreen = 'open';
  }
  async start() {
    new ResizeObserver(() => this.fit()).observe(this.wrap); this.fit();
    installSymbols();
    this.opening = new Opening(this); this.world = new World(this); this.tutorial = new Tutorial(this);
    this.wire();
    this.opening.render(); this.world.render(); this.tutorial.render();
    this.syncSound(this.sound.enabled, true);
    this.goTo('open');
    await this.loadData();
  }
  async loadData() {
    try { this.data = await this.content.load('tutorial.json'); }
    catch (e) { this.loadError(e); }
  }
  fit() {
    const w = Math.max(280, Math.min(this.wrap.clientWidth, this.wrap.clientHeight * 16 / 9));
    this.stage.style.width = w + 'px'; this.stage.style.height = (w * 9 / 16) + 'px';
  }
  goTo(screen) {
    this.dialog.close(true); this.currentScreen = screen; this.screens.show(screen);
    if (screen === 'open' || screen === 'world') this.untheme(this.stage);
    if (screen === 'world') this.world.clear();
  }
  game(id) {
    const g = this.data && this.data.games.find(x => x.id === id);
    if (!g) throw new Error('Permainan tidak dikenal: ' + id);
    return g;
  }
  openTutorial(id) { if (this.data) this.tutorial.open(id); else this.loadError(); }
  startGame(id) {
    const Cls = this.games[id];
    if (!Cls) { this.dialog.open({ title: 'Segera hadir!', body: 'Permainan ini sedang disiapkan. Coba permainan lain dulu, ya.', actions: [{ label: 'Mengerti' }] }); return; }
    this.sound.play('ok'); this.current = new Cls(this); this.goTo('game'); this.current.start();
  }
  theme(el, id) { const c = this.game(id).colors; el.style.setProperty('--g', c.g); el.style.setProperty('--gt', c.gt); el.style.setProperty('--gd', c.gd); }
  untheme(el) { ['--g', '--gt', '--gd'].forEach(p => el.style.removeProperty(p)); }
  syncSound(v, quiet) {
    $$('[data-snd]').forEach(b => b.setAttribute('aria-pressed', v));
    $$('[data-sw]').forEach(b => b.setAttribute('aria-checked', v));
    if (!quiet) this.dialog.toast(v ? 'Suara menyala' : 'Suara dimatikan');
  }
  swRow() { return `<div class="sw-row"><span>Suara</span><button class="sw" type="button" role="switch" data-sw aria-checked="${this.sound.enabled}" aria-label="Suara"></button></div>`; }
  help() {
    const t = (this.data && this.data.hints[this.currentScreen]) || 'Ketuk gambar untuk bermain.';
    this.dialog.open({ title: 'Butuh bantuan?', body: t + this.swRow(), actions: [{ label: 'Mengerti' }] });
  }
  loadError(e) {
    this.dialog.open({ title: 'Ups, ada masalah', cancel: false, type: 'error',
      body: 'Isi permainan belum bisa dimuat. Periksa internetnya, lalu coba lagi.',
      actions: [{ label: 'Muat Ulang', fn: () => this.loadData() }] });
  }
  wire() {
    $('#home').onclick = () => { this.sound.play('kembali'); this.goTo('open'); };
    $('#snd').onclick = () => this.sound.toggle();
    $('#help').onclick = () => { this.sound.play('klik'); this.help(); };
    $('#dlg-b').addEventListener('click', e => { if (e.target.closest('[data-sw]')) this.sound.toggle(); });
  }
}