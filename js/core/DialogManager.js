/* DialogManager: dialog (bantuan, galat, konfirmasi), toast, kunci fokus */
import { $, $$ } from '../screens/art.js';
const OWL = '<svg viewBox="0 0 120 150" aria-hidden="true"><use href="#owl" width="120" height="150"/></svg>';
export class DialogManager {
  constructor() {
    this.ov = $('#ov'); this.current = null; this.lastFocus = null; this.toastT = 0;
    this.ov.inert = true;
    this.ov.addEventListener('click', e => { if (e.target === this.ov && this.ov.dataset.cancel) this.close(); });
    document.addEventListener('keydown', e => this.onKey(e));
  }
  get isOpen() { return this.ov.classList.contains('on'); }
  open({ art = OWL, title, body = '', actions = [], cancel = true, type = 'info', onClose = null }) {
    this.onClose = onClose; this.lastFocus = document.activeElement; this.current = type;
    $('#dlg-art').innerHTML = art; $('#dlg-t').textContent = title; $('#dlg-b').innerHTML = body;
    const a = $('#dlg-a'); a.textContent = '';
    actions.forEach(x => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (x.cls || ''); b.textContent = x.label;
      b.onclick = () => { this.close(); if (x.fn) x.fn(); }; a.append(b);
    });
    this.ov.dataset.cancel = cancel ? '1' : ''; this.ov.inert = false; this.ov.classList.add('on');
    ($('button', a) || $('.dlg')).focus();
  }
  close(quiet) {
    if (!this.isOpen) return;
    this.ov.classList.remove('on'); this.ov.inert = true; this.current = null;
    if (!quiet && this.lastFocus && this.lastFocus.focus && this.lastFocus.isConnected) this.lastFocus.focus();
    const f = this.onClose; this.onClose = null; if (!quiet && f) f();
  }
  toast(m) {
    const t = $('#toast'); t.textContent = m; t.classList.add('on');
    clearTimeout(this.toastT); this.toastT = setTimeout(() => t.classList.remove('on'), 1900);
  }
  onKey(e) {
    if (!this.isOpen) return;
    if (e.key === 'Escape' && this.ov.dataset.cancel) { this.close(); return; }
    if (e.key === 'Tab') { this.trapFocus(e); }
  }
  trapFocus(e) {
    const f = $$('button', this.ov); if (!f.length) return;
    const i = f.indexOf(document.activeElement); e.preventDefault();
    f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  }
}