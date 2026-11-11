/* Tutorial (UC-03): satu template untuk empat permainan, isi dari tutorial.json */
import { $, INK, star, person, bubble, shelf, tile, icon } from './art.js';

function art(id, gt) {
  let a = '';
  if (id === 'dash') a = `<rect x="90" y="330" width="460" height="130" rx="12" fill="#C98F58"/><use href="#owl" x="260" y="150" width="120" height="150"/><rect x="75" y="298" width="490" height="44" rx="14" fill="#E3B26B"/><rect x="440" y="262" width="80" height="22" rx="4" fill="#B65B3D"/><rect x="446" y="240" width="68" height="22" rx="4" fill="#46868A"/>${person(130, 300, '#E9B98C', '#4A3022', '#46868A', 1)}${bubble(130, 215, '#B65B3D', 'Fiksi')}${person(520, 300, '#F2CDA5', '#8B5E3C', '#E2A63A', 1)}${bubble(520, 215, '#46868A', 'Sains')}`;
  if (id === 'kenali') a = `<g>${shelf(110, 60, 300, 3, 110, 41)}</g><rect x="60" y="420" width="520" height="14" rx="7" fill="#9A6B45"/><use href="#plant" x="440" y="270" width="80" height="136"/><circle cx="470" cy="300" r="70" fill="#FFFBF0" fill-opacity=".45" stroke="${INK}" stroke-width="14"/><path d="M520 350L585 425" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><g stroke="${INK}" stroke-width="2">${star(470, 300, 18, '#E2A63A')}</g>`;
  if (id === 'susun') a = ['', '', '', ''].map((_, i) => `<rect x="${140 + i * 92}" y="150" width="76" height="76" rx="12" fill="#FFFBF0" fill-opacity=".6" stroke="${INK}" stroke-width="3" stroke-dasharray="9 7"/>`).join('') + tile(140, 150, 76, 'B', 0, 0) + `<rect x="95" y="400" width="450" height="40" rx="16" fill="#E3B26B"/><rect x="125" y="436" width="26" height="70" rx="6" fill="#A87244"/><rect x="489" y="436" width="26" height="70" rx="6" fill="#A87244"/>` + ['U', 'K', 'U'].map((l, i) => tile(140 + i * 104, 322, 76, l, i + 1, [-5, 4, -3][i])).join('');
  if (id === 'memory') {
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const x = 150 + c * 130, y = 110 + r * 170, i = r * 3 + c;
      a += (i === 0 || i === 4)
        ? `<rect x="${x}" y="${y}" width="100" height="126" rx="12" fill="#FFF6DE" stroke="${INK}" stroke-width="3.5"/><g transform="translate(${x + 50} ${y + 63}) scale(.9)">${icon(i === 0 ? 0 : 1)}</g>`
        : `<use href="#cb" x="${x}" y="${y}" width="100" height="126"/>`;
    }
    a += `<g stroke="${INK}" stroke-width="2">${star(110, 70, 14, '#E2A63A')}${star(560, 420, 16, '#D4969A')}</g>`;
  }
  return `<svg viewBox="0 0 640 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g filter="url(#wc)"><path d="M70 130Q40 40 190 44T470 40Q620 70 596 230T560 440Q430 520 250 490T60 380Q20 250 70 130Z" fill="#FFFBF0" fill-opacity=".62" stroke="${INK}" stroke-opacity=".18" stroke-width="6"/></g><g filter="url(#wc)">${a}</g></svg>`;
}

export class Tutorial {
  constructor(app) { this.app = app; this.gameId = null; }
  render() {
    $('#tut-start').onclick = () => this.start();
    $('#tut-back').onclick = () => this.back();
  }
  open(id) {
    const g = this.app.game(id); this.gameId = id;
    this.app.theme(this.app.stage, id);
    $('#tut-art').innerHTML = art(id, g.colors.gt);
    $('#tut-title').textContent = g.name; $('#tut-desc').textContent = g.desc;
    $('#tut-steps').innerHTML = g.steps.map(s => `<li>${s}</li>`).join('');
    this.app.sound.play('ok'); this.app.goTo('tut');
  }
  start() { this.app.startGame(this.gameId); }
  back() { this.app.sound.play('kembali'); this.app.goTo('world'); }
}