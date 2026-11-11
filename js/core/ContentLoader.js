/* ContentLoader: satu-satunya tempat membaca berkas JSON konten */
export class ContentLoader {
  constructor(base = 'data/') { this.base = base; this.cache = new Map(); }
  async load(file) {
    if (this.cache.has(file)) return this.cache.get(file);
    let res;
    try { res = await fetch(this.base + file, { cache: 'no-cache' }); }
    catch (e) { throw new Error('Tidak bisa membaca ' + file); }
    if (!res.ok) throw new Error('Tidak bisa membaca ' + file);
    const data = await res.json();
    this.cache.set(file, data);
    return data;
  }
}