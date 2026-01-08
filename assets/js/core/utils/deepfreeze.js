export function deepFreeze(obj) {
  const props = Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));

  props.forEach((prop) => {
    if (obj[prop] !== null && typeof obj[prop] === "object") {
      deepFreeze(obj[prop]);
    }
  });

  return Object.freeze(obj);
}
