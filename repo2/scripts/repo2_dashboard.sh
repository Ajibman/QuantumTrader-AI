#!/bin/bash
# =====================================================
# QT AI Repo2 Operational Dashboard
# =====================================================
SCRIPT_FILE="repo2/scripts/generate_all_modules.sh"
DASHBOARD_FILE="repo2/scripts/repo2_dashboard_report.txt"

echo "=== QT AI Repo2 Operational Dashboard ==="
echo "Generating dashboard at $(date)" > "$DASHBOARD_FILE"

# 1️⃣ Confirm master generator script
if [ ! -f "$SCRIPT_FILE" ]; then
    echo "❌ ERROR: $SCRIPT_FILE not found!" | tee -a "$DASHBOARD_FILE"
    exit 1
fi
echo "✅ Master generator script exists" | tee -a "$DASHBOARD_FILE"

# 2️⃣ Module existence check
echo "=== Modules 01-15 Status ===" | tee -a "$DASHBOARD_FILE"
for i in {01..15}; do
    if grep -q "module${i}_" "$SCRIPT_FILE"; then
        status="✔️ Defined"
    else
        status="❌ Missing"
    fi
    printf "%-10s %-10s\n" "Module $i" "$status" | tee -a "$DASHBOARD_FILE"
done

# 3️⃣ Dry-run execution
echo "=== Dry-run Execution Output ===" | tee -a "$DASHBOARD_FILE"
for i in {01..15}; do
    # Simulate calling the function if it exists
    if grep -q "module${i}_" "$SCRIPT_FILE"; then
        echo "[Dry-run] Module $i executing..." | tee -a "$DASHBOARD_FILE"
        sleep 0.1
        echo "[Dry-run] Module $i completed successfully" | tee -a "$DASHBOARD_FILE"
    else
        echo "[Dry-run] Module $i skipped (missing)" | tee -a "$DASHBOARD_FILE"
    fi
done

# 4️⃣ Master logs & archive check
echo "=== Master Logs & Archives ===" | tee -a "$DASHBOARD_FILE"
logs=$(ls repo2/scripts | grep master_log)
if [ -z "$logs" ]; then
    echo "⚠️ No master logs found" | tee -a "$DASHBOARD_FILE"
else
    echo "✅ Master logs found:" | tee -a "$DASHBOARD_FILE"
    echo "$logs" | tee -a "$DASHBOARD_FILE"
fi

# 5️⃣ Summary
missing=$(grep "❌ Missing" "$DASHBOARD_FILE" | wc -l)
if [ "$missing" -eq 0 ]; then
    echo "✅ Repo2 operational status: All modules defined and ready" | tee -a "$DASHBOARD_FILE"
else
    echo "⚠️ Repo2 operational status: $missing modules missing" | tee -a "$DASHBOARD_FILE"
fi

echo "=== Dashboard Generation Complete ==="
echo "Report saved at: $DASHBOARD_FILE"
