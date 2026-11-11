/* KenaliPerpustakaan (UC-07): ketuk enam benda bertanda tanya, baca penjelasannya */
import { $, INK, PAPER, shelf } from '../screens/art.js';
import { Game } from './Game.js';

const wallFloor = (wy, wc, fc) => `<rect width="1600" height="660" fill="${fc}"/><g filter="url(#wc)"><rect width="1600" height="${wy}" fill="${wc}"/><path d="M0 ${wy}H1600V660H0Z" fill="#D7B07C"/><path d="M0 ${wy + 90}H1600M0 ${wy + 190}H1600" stroke="#BE9461" stroke-width="3" fill="none"/></g>`;

// gambar tiap benda + posisi tanda tanya [x, y]
const ART = {
  rak: [shelf(60, 50, 400, 4, 100, 31), 260, 240],
  jam: [`<circle cx="600" cy="140" r="58" fill="${PAPER}" stroke="#9A6B45" stroke-width="10"/><path d="M600 140V98M600 140L630 156" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="600" cy="140" r="6" fill="${INK}"/>`, 660, 190],
  papan: [`<rect x="720" y="70" width="260" height="190" rx="10" fill="#C9955E" stroke="#9A6B45" stroke-width="10"/><rect x="750" y="100" width="70" height="60" fill="${PAPER}" transform="rotate(-4 785 130)"/><rect x="840" y="96" width="70" height="64" fill="#F3CE72" transform="rotate(5 875 128)"/><rect x="760" y="176" width="90" height="56" fill="#CFE3E0" transform="rotate(-2 805 204)"/><rect x="866" y="180" width="70" height="52" fill="#EBC0C0" transform="rotate(4 900 206)"/>`, 970, 250],
  globe: [`<rect x="1094" y="440" width="12" height="82" fill="#7B5A44"/><ellipse cx="1100" cy="526" rx="52" ry="12" fill="#7B5A44"/><circle cx="1100" cy="380" r="64" fill="#46868A"/><path d="M1060 350Q1090 330 1110 350T1140 380Q1120 410 1090 400T1060 350Z" fill="#86A67E"/><path d="M1036 380A64 64 0 0 0 1164 380" fill="none" stroke="#7B5A44" stroke-width="7"/>`, 1166, 330],
  meja: [`<rect x="1235" y="400" width="310" height="130" rx="12" fill="#C98F58"/><rect x="1210" y="362" width="360" height="42" rx="14" fill="#E3B26B"/><rect x="1260" y="296" width="80" height="58" rx="8" fill="#46868A" stroke="${INK}" stroke-width="4"/><path d="M1440 362q0-26 22-26t22 26z" fill="#E2A63A"/><rect x="1300" y="436" width="230" height="52" rx="10" fill="${PAPER}" stroke="#9A6B45" stroke-width="4"/>`, 1500, 320],
  baca: [`<ellipse cx="730" cy="590" rx="190" ry="44" fill="#46868A" opacity=".6"/><rect x="665" y="470" width="130" height="120" rx="34" fill="#D4969A"/><rect x="640" y="530" width="180" height="70" rx="26" fill="#C77F85"/><rect x="630" y="510" width="40" height="90" rx="18" fill="#D4969A"/><rect x="790" y="510" width="40" height="90" rx="18" fill="#D4969A"/><rect x="880" y="420" width="8" height="180" fill="#7B5A44"/><path d="M856 420L870 366H898L912 420Z" fill="#E2A63A"/>`, 730, 455]
};

const obj = (o) => {
  const [inner, px, py] = ART[o.id];
  return `<g class="obj" role="button" tabindex="0" data-k="${o.id}" aria-label="${o.name}">${inner}<g transform="translate(${px} ${py})"><g class="pin"><circle class="ring" r="26"/><circle r="22" fill="#E2A63A" stroke="${PAPER}" stroke-width="4"/><text y="9" text-anchor="middle" font-size="28" font-weight="800" fill="${INK}">?</text></g><g class="ok"><circle r="22" fill="#86A67E" stroke="${PAPER}" stroke-width="4"/><path d="M-10 0l7 8 14-16" fill="none" stroke="#FFF6E2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>`;
};

export class KenaliPerpustakaan extends Game {
  constructor(app) { super(app, 'kenali'); }
  async begin(scene) {
    try { this.data = await this.app.content.load('kenali.json'); }
    catch (e) { this.app.loadError(e); return; }
    this.found = new Set();
    scene.innerHTML = `<svg viewBox="0 0 1600 660" preserveAspectRatio="xMidYMid meet" style="overflow:visible"><rect x="-400" y="-300" width="2400" height="770" fill="#F1E1BC"/><rect x="-400" y="470" width="2400" height="600" fill="#D7B07C"/>${wallFloor(470, '#F1E1BC', '#D7B07C')}${this.data.objects.map(obj).join('')}<use href="#cat" x="520" y="560" width="110" height="73"/><use href="#plant" x="1500" y="470" width="80" height="136"/></svg>`;
    scene.addEventListener('click', e => { const o = e.target.closest('.obj'); if (o) this.openObject(o.dataset.k, o); });
    this.updateProgress();
  }
  updateProgress() { this.progress(`Benda ditemukan ${this.found.size}/${this.data.objects.length}`); }
  openObject(id, el) {
    if (this.state !== 'play') return;
    const o = this.data.objects.find(x => x.id === id);
    this.found.add(id); el.classList.add('found'); this.updateProgress(); this.app.sound.play('ok');
    this.app.dialog.open({ title: o.name, body: o.text, actions: [{ label: 'Lanjut' }],
      onClose: () => { if (this.found.size === this.data.objects.length) this.finish(1); } });
  }
  isComplete() { return this.found.size === this.data.objects.length; }
}