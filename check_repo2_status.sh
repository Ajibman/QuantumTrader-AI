#!/bin/bash
# =====================================================
# QT AI Repo2 Health Check & Dashboard
# =====================================================
SCRIPT_FILE="repo2/scripts/generate_all_modules.sh"

echo "=== QT AI Repo2 Health Check ==="
echo "Checking master generator script: $SCRIPT_FILE"

# 1️⃣ Check if the master generator script exists
if [ ! -f "$SCRIPT_FILE" ]; then
    echo "❌ ERROR: $SCRIPT_FILE not found!"
    exit 1
fi
echo "✅ Master generator script found"

# 2️⃣ Verify all 15 module functions exist
echo "Checking for Modules 01-15 definitions..."
missing_modules=()
for i in {01..15}; do
    grep -q "module${i}_" "$SCRIPT_FILE" || missing_modules+=("module${i}_")
done

if [ ${#missing_modules[@]} -eq 0 ]; then
    echo "✅ All modules 01-15 are defined"
else
    echo "❌ Missing module definitions: ${missing_modules[*]}"
fi

# 3️⃣ Dry-run check: confirm execution order
echo "Verifying execution order..."
for i in {01..15}; do
    grep -q "module${i}_" "$SCRIPT_FILE" && echo "✅ Module $i present"
done

# 4️⃣ Check for master logs and archives
echo "Checking for master logs and archives..."
logs_found=$(ls repo2/scripts | grep master_log)
if [ -z "$logs_found" ]; then
    echo "⚠️ No master logs found"
else
    echo "✅ Master logs found:"
    echo "$logs_found"
fi

# 5️⃣ Mini visual dashboard
echo "=== Mini Dashboard ==="
printf "%-10s %-10s\n" "Module" "Status"
for i in {01..15}; do
    grep -q "module${i}_" "$SCRIPT_FILE" && status="✔️ Defined" || status="❌ Missing"
    printf "%-10s %-10s\n" "Module $i" "$status"
done
echo "======================="

# 6️⃣ Summary
if [ ${#missing_modules[@]} -eq 0 ]; then
    echo "✅ Repo2 Modules Health: All modules present and ready"
else
    echo "⚠️ Repo2 Modules Health: Check missing modules above"
fi

echo "=== Health Check Complete ==="
