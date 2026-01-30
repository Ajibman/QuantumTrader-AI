const listeners = new Set();

export function subscribeCPilot(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(event) {
  listeners.forEach(fn => fn(event));
}
