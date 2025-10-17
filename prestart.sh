'''js

prestart.sh#!/data/data/com.termux/files/usr/bin/bash

echo "🧭 Starting QonexAI Pre-Launch Structure Check..."

Enforce single entry point
ENTRY_FILE="src/server.js"

if [ -f "ENTRY_FILE" ]; then
  echo "✅ Entry point confirmed:ENTRY_FILE"
else
  echo "❌ Entry file missing or mislocated: ENTRY_FILE"
  exit 1
fi

Confirm only one valid route into the app
echo "🔒 Enforcing single entry route viaENTRY_FILE"

List of essential folders to verify
ESSENTIAL_FOLDERS=("src" "assets" "public" "core" "routes" "models" "config" "controllers")

for folder in "ESSENTIAL_FOLDERS[@]"; do
  if [ -d "folder" ]; then
    echo "📁 Found folder: folder"
  else
    echo "⚠️ Missing folder:folder"
  fi
done

echo "🚀 QonexAI is ready for launch through $ENTRY_FILE"
```
