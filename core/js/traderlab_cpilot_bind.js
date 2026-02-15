// core/js/traderlab_cpilot_bind.js

import CPilot from './cpilot_ready.js';

/**
 * Read-only binding between TraderLab UI and CPilot
 * No trade execution. No persistence. No side effects.
 */

const TraderLabCPilotBind = (() => {

  const ui = {
    modeManual: document.querySelector('#mode-manual'),
    modeAuto: document.querySelector('#mode-auto'),

    tp15: document.querySelector('#tp-15s'),
    tp30: document.querySelector('#tp-30s'),
    tp7d: document.querySelector('#tp-7d'),

    startBtn: document.querySelector('#cpilot-start'),
    stopBtn: document.querySelector('#cpilot-stop'),

    monitor: document.querySelector('#cpilot-monitor')
  };

  function getTradeMode() {
    if (ui.modeAuto?.checked) return 'Auto';
    return 'Manual';
  }

  function getTpTiming() {
    if (ui.tp30?.checked) return '30s';
    if (ui.tp7d?.checked) return '7d';
    return '15s';
  }

  function render(snapshot) {
    if (!ui.monitor) return;

    ui.monitor.textContent =
      `[CPilot Signal]\n` +
      `ID: ${snapshot.id}\n` +
      `Mode: ${snapshot.mode}\n` +
      `Direction: ${snapshot.direction || '—'}\n` +
      `Confidence: ${snapshot.confidence}%\n` +
      `Risk: ${snapshot.risk}\n` +
      `Status: ${snapshot.status}\n`;
  }

  function start() {
    const initSnap = CPilot.init({
      mode: getTradeMode(),
      tpTiming: getTpTiming()
    });

    render(initSnap);
  }

  function stop() {
    CPilot.resetSignal();
    if (ui.monitor) ui.monitor.textContent = 'CPilot idle.';
  }

  function wire() {
    ui.startBtn?.addEventListener('click', start);
    ui.stopBtn?.addEventListener('click', stop);
  }

  return { wire };

})();

export default TraderLabCPilotBind;
