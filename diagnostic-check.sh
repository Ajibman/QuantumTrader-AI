[[ -f ".github/workflows/validate-handshake.yml" ]] && echo "✅ validate-handshake.yml present" || echo "❌ validate-handshake.yml missing"

5. Final Harmony log check
echo -e "\n📄 Log file checks:"
[[ -f "logs/final_harmony_log.json" ]] && echo "✅ final_harmony_log.json exists" || echo "❌ final_harmony_log.json missing"

6. Commit history scan
echo -e "\n🕓 Recent commits:"
git log --oneline -n 5

echo -e "\n✅ Diagnostic Complete."

#!/bin/bash

echo "🔍 Starting QuantumTrader-AI Repository Diagnostic..."
echo "==============================================="

1. File count
echo "📦 Total files tracked by Git:"
git ls-files | wc -l

2. Folder structure check
echo -e "\n📁 Validating expected folder structure:"
expected_dirs=("src" "logs" "assets" ".github" "src/modules" "src/core" "src/security" "scripts")
for dir in "expected_dirs[@]"; do
  if [ -d "dir" ]; then
    echo "✅ Found: dir"
  else
    echo "❌ Missing:dir"
  fi
done

3. Modules 01–15 check
echo -e "\n📚 Checking Modules 01–15:"
for i in {1..15}; do
  mod_file="src/modules/module(printf "i).js"
  if [ -f "mod_file" ]; then
    echo "✅mod_file exists"
  else
    echo "❌ $mod_file missing"
  fi
done

4. Handshake & integration files
echo -e "\n🤝 Handshake & Integration Files:"
[[ -f "src/modules/module14.js" ]] && echo "✅ module14.js present" || echo "❌ module14.js missing"
[[ -f "src/modules/module15.js" ]] && echo "✅ module15.js present" || echo "❌ module15.js missing"

chmod +x diagnostic-check.sh
./diagnostic-check.sh
```



 
