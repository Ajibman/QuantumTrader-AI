// core/js/tradingfloor.js
function initTradingFloor(){
  state.subscribe(updateTradingFloor);

  function updateTradingFloor(s){
    const modeEl = document.getElementById('trademode');
    const tpEl = document.getElementById('tp-timing');
    const lightEl = document.getElementById('market-light');
    const labelEl = document.getElementById('market-label');
    const feed = document.getElementById('simulation-feed');

    if(!modeEl || !tpEl || !lightEl || !labelEl || !feed) return;

    modeEl.textContent = s.currentTradeMode;
    tpEl.textContent = s.currentTpTiming;

    switch(s.currentGuidance){
      case 'favorable': lightEl.style.backgroundColor='green'; labelEl.textContent='Proceed consciously'; break;
      case 'caution': lightEl.style.backgroundColor='yellow'; labelEl.textContent='Caution advised'; break;
      case 'unfavorable': lightEl.style.backgroundColor='red'; labelEl.textContent='Wait is recommended'; break;
      default: lightEl.style.backgroundColor='gray'; labelEl.textContent='Awaiting guidance…';
    }

    feed.innerHTML += `<p>[${new Date().toLocaleTimeString()}] Mode: ${s.currentTradeMode}, TP: ${s.currentTpTiming}, Guidance: ${labelEl.textContent}</p>`;
    feed.scrollTop = feed.scrollHeight;

    // Ori Ologo voice
    if(window.OriOlogo) OriOlogo.speak(labelEl.textContent);
  }
}
