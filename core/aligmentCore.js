```js
function isAligned(input) {
  const corePrinciples = ['peace', 'truth', 'life'];

  return corePrinciples.every(principle =>
    input.toLowerCase().includes(principle)
  );
}

function enforceAlignment(moduleName, data) {
  if (!isAligned(data)) {
    console.warn(`⚠️ moduleName failed alignment check.`);
    return false;
  

  console.log(`✅{moduleName} passed alignment.`);
  return true;
}

module.exports = { isAligned, enforceAlignment };
```
