```js
function alignStream(inputStream) {
  try {
    const aligned = inputStream
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .split(/\s+/)
      .filter(Boolean);

    console.log(`🔗 Stream aligned: [${aligned.join(', ')}]`);
    return aligned;
  } catch (error) {
    console.error("❌ Stream alignment failed:", error);
    return [];
  }
}

module.exports = { alignStream };
```
