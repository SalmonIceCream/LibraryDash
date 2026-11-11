/* ResultCalculator: bintang dari ketepatan, bukan kecepatan saja */
export class ResultCalculator {
  stars(accuracy) { return accuracy >= .8 ? 3 : accuracy >= .5 ? 2 : 1; }
  lesson(meta) { return meta.lesson || 'Kamu hebat! Terus belajar di perpustakaan, ya.'; }
}