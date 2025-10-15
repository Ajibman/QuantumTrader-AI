---js

echo "✅ Checking QuantumTrader-AI project structure..."

Check for src folder and server.js
if [ -f "./src/server.js" ]; then
  echo "✔️  Found: src/server.js"
else
  echo "❌ Missing: src/server.js"
fi

Check that old SRC folder is gone
if [ -d "./SRC" ]; then
  echo "⚠️  Warning: Old folder 'SRC' still exists"
else
  echo "✔️  Confirmed: No old 'SRC' folder"
fi

Check for index.html (adjust path if needed)
if [ -f "./Docs/index.html" ]; then
  echo "✔️  Found: Docs/index.html"
elif [ -f "./index.html" ]; then
  echo "✔️  Found: index.html in root"
else
  echo "❌ Missing: index.html"
fi

echo "✅ Structure check complete."
```

