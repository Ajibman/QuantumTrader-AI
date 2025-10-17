#!/bin/bash
# commitCollabBridge.sh
# QonexAI Unified Collaboration Bridge Commit Script

# Post-commit confirmation
echo ""
echo "✅ QonexAI Collaboration Bridge committed and pushed successfully!"
echo "---------------------------------------------------------------"
echo "Files synchronized in this commit:"
echo "  • src/server.js"
echo "  • src/node.js"
echo "  • src/validateCoreIntegration.js"
echo "  • src/collab/index.js"
echo "---------------------------------------------------------------"
echo "Timestamp: $(date)"
echo "Git Remote: $(git remote get-url origin)"
echo "Branch: $(git branch --show-current)"
echo "---------------------------------------------------------------"
echo "🌐 Status: Your collaboration layer is now fully synchronized."

# commitcollabBridge.sh
# Auto-sync commit bridge for QT AI project (Olagoke Ajibulu)

echo "🔗 Starting commit collaboration bridge..."
echo "--------------------------------------------"

# Track important folders/files
git add index.html
git add src/
git add server.js
git add public/

# Commit message input
read -p "Enter commit message for all linked files: " message

# Unified commit and push
git commit -m "$message"
git push origin main

echo "✅ All connected files have been committed and pushed successfully!"
echo "--------------------------------------------"

#!/bin/bash
# ========================================
# QuantumTrader-AI :: Unified Commit Bridge
# Description: This script ensures synchronized commits 
# across core integration files and Node.js collaboration modules.
# ========================================

echo "🔗 Starting Unified Commit Bridge..."

# Stage essential core collaboration files
git add src/server.js
git add src/index.html
git add src/validateCoreIntegration.js
git add src/nodejs/index.js

# Optional: Add this bridge itself if updated
git add commitcollabBridge.sh

# Commit all with a unified message
git commit -m "Unified Commit Bridge: Syncing src/server.js, core validation, and Node.js collab setup"

echo "✅ Unified Commit Bridge completed successfully."

