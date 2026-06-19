/**

* =====================================================
* QuantumTrader-AI
* STAGE 38D — EXECUTION STATUS PANEL
* =====================================================
* 
* Purpose:
* Displays trade execution results from backend.
* 
* =====================================================
  */

export class ExecutionPanel {

constructor() {
this.lastExecution = null;
}

update(execution) {
this.lastExecution = execution;
}

render() {

if (!this.lastExecution) {
  return { status: "NO_EXECUTION" };
}

return {

  type: "EXECUTION_PANEL",

  status: this.lastExecution.status,

  symbol: this.lastExecution.symbol,

  side: this.lastExecution.side,

  fillPrice: this.lastExecution.fillPrice,

  mode: this.lastExecution.mode
};

}
}
