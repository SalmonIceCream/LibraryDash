/* susunArt.js: gambar petunjuk tiap kata (viewBox -60 -60 120 120). Ganti dengan ilustrasi final bila sudah ada. */
import { INK, PAPER, shelf, star, icon } from '../screens/art.js';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
const book = (c, extra = '') => `<rect x="-34" y="-44" width="68" height="88" rx="6" fill="${c}" ${S}/><rect x="-26" y="-44" width="6" height="88" fill="#000" opacity=".12"/>${extra}`;

export const CLUE = {
  BUKU: `<g transform="scale(1.45)">${icon(0)}</g>`,
  RAK: shelf(-46, -46, 92, 3, 28, 5),
  JAM: `<circle r="42" fill="${PAPER}" stroke="#9A6B45" stroke-width="8"/><path d="M0 0V-26M0 0L18 10" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle r="5" fill="${INK}"/>`,
  MEJA: `<rect x="-48" y="-6" width="96" height="14" rx="5" fill="#E3B26B" ${S}/><rect x="-40" y="8" width="10" height="42" fill="#A87244"/><rect x="30" y="8" width="10" height="42" fill="#A87244"/><rect x="-18" y="-24" width="34" height="18" rx="3" fill="#B65B3D" ${S}/>`,
  PETA: `<path d="M-48 -34L-16 -44L16 -34L48 -44V36L16 46L-16 36L-48 46Z" fill="#F3E3BE" ${S}/><path d="M-16 -44V36M16 -34V46" stroke="${INK}" stroke-width="2.5" opacity=".5"/><path d="M-34 20Q-10 -10 12 6T34 -18" fill="none" stroke="#B65B3D" stroke-width="4" stroke-dasharray="7 6"/><path d="M28 -26l12 12M40 -26L28 -14" stroke="#B65B3D" stroke-width="5" stroke-linecap="round"/>`,
  KURSI: `<rect x="-26" y="-6" width="52" height="34" rx="12" fill="#D4969A" ${S}/><rect x="-26" y="-48" width="52" height="46" rx="14" fill="#D4969A" ${S}/><rect x="-24" y="26" width="8" height="24" fill="#8B5E3C"/><rect x="16" y="26" width="8" height="24" fill="#8B5E3C"/>`,
  LAMPU: `<path d="M-26 -8L-14 -46H14L26 -8Z" fill="#E2A63A" ${S}/><rect x="-3" y="-8" width="6" height="52" fill="#7B5A44"/><ellipse cy="46" rx="24" ry="6" fill="#7B5A44"/>`,
  PENSIL: `<g transform="scale(1.45)">${icon(3)}</g>`,
  KUCING: `<use href="#cat" x="-60" y="-40" width="120" height="80"/>`,
  GLOBE: `<rect x="-4" y="22" width="8" height="26" fill="#7B5A44"/><ellipse cy="50" rx="26" ry="7" fill="#7B5A44"/><circle cy="-6" r="38" fill="#46868A" ${S}/><path d="M-22 -18Q-6 -34 8 -20T24 -4Q10 14 -6 6T-22 -18Z" fill="#86A67E"/>`,
  KAMUS: book('#46868A', `<text y="6" text-anchor="middle" font-size="22" font-weight="800" fill="${PAPER}">A-Z</text>`),
  KOMIK: book('#E2A63A', `<path d="M-18 -26h36v22H0l-8 10v-10h-10Z" fill="${PAPER}" ${S}/><circle cx="-8" cy="-15" r="2.5" fill="${INK}"/><circle cx="2" cy="-15" r="2.5" fill="${INK}"/><circle cx="12" cy="-15" r="2.5" fill="${INK}"/>`),
  GAMBAR: `<rect x="-48" y="-38" width="96" height="76" rx="6" fill="#FFF6DE" stroke="#9A6B45" stroke-width="8"/><circle cx="-20" cy="-14" r="9" fill="#F3CE72"/><path d="M-40 30L-10 -2L8 18L22 4L40 30Z" fill="#86A67E" ${S}/>`,
  DONGENG: book('#9A6A8E', `<g ${S.replace('stroke-width="3"', 'stroke-width="2"')}>${star(0, -4, 20, '#F3CE72')}</g>`),
  TANAMAN: `<use href="#plant" x="-35" y="-60" width="70" height="119"/>`
};