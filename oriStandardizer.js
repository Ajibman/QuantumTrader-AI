```js
// oriStandardizer.js

/**
 * Interchange between "Ori Olokun" and "Ori Ologo"
 * Returns the standardized or alternate form based on input
 */

function standardizeOriName(input) {
  const normalized = input.trim().toLowerCase();

  if (normalized === "ori olokun") return "Ori Ologo";
  if (normalized === "ori ologo") return "Ori Olokun";

  return input; // Return original if no match
}

// Example usage
console.log(standardizeOriName("Ori Olokun")); // Ori Ologo
console.log(standardizeOriName("Ori Ologo"));  // Ori Olokun

module.exports = { standardizeOriName };
```

---
