'''js

echo "🧭 Prestart Hook Initialized..."

Define correct entry path
ENTRY_PATH="QonexAI/src/server.js"

Check if server.js exists at correct location
if [ -f "ENTRY_PATH" ]; then
  echo "✅ Located server.js atENTRY_PATH"
else
  echo "❌ server.js not found at ENTRY_PATH"
  echo "Please ensure all root files are properly placed under QonexAI/src/"
  exit 1
fi

Check for key top-level folders
for folder in core modules data config routes utils assets public; do
  if [ -d "QonexAI/folder" ]; then
    echo "📁 folder folder found"
  else
    echo "⚠️folder folder is missing from QonexAI/"
  fi
done

echo "✅ Prestart validation complete. System structure aligned."

chmod +x prestart.sh
```
