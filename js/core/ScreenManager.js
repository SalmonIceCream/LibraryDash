/* ScreenManager: menampilkan satu layar dan menyembunyikan sisanya */
import { $$ } from '../screens/art.js';
export class ScreenManager {
  constructor(stage) { this.stage = stage; this.current = null; this.screens = $$('.screen', stage); }
  show(id) {
    this.current = id; this.stage.dataset.screen = id;
    this.screens.forEach(s => { const on = s.id === 's-' + id; s.classList.toggle('on', on); s.inert = !on; });
  }
  hideAll() { this.screens.forEach(s => { s.classList.remove('on'); s.inert = true; }); }
}