/* main.js: titik masuk */
import { App } from './core/App.js';
import { KenaliPerpustakaan } from './games/KenaliPerpustakaan.js';
import { SusunKata } from './games/SusunKata.js';
const app = new App();
app.games.kenali = KenaliPerpustakaan;
app.games.susun = SusunKata;
window.libadv = app;   // memudahkan uji di konsol
app.start();