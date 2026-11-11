/* main.js: titik masuk */
import { App } from './core/App.js';
import { KenaliPerpustakaan } from './games/KenaliPerpustakaan.js';
import { SusunKata } from './games/SusunKata.js';
import { MemoryMatch } from './games/MemoryMatch.js';
const app = new App();
app.games.kenali = KenaliPerpustakaan;
app.games.susun = SusunKata;
app.games.memory = MemoryMatch;
window.libadv = app;   // memudahkan uji di konsol
app.start();