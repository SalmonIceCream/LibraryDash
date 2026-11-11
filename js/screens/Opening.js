/* Opening (UC-01): layar pembuka dengan tombol Masuk Perpustakaan */
import { $, openBg, openArt } from './art.js';
export class Opening {
  constructor(app) { this.app = app; }
  render() {
    $('#open-bg').innerHTML = openBg();
    $('#open-art').innerHTML = openArt();
    $('#enter').onclick = () => { this.app.sound.play('ok'); this.app.goTo('world'); };
  }
}