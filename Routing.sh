# Ensure backup directory exists
mkdir -p repo2/backup

# Copy Trader_Routing_Engine.js into backup with timestamp
cp Trader_Routing_Engine.js repo2/backup/Trader_Routing_Engine_$(date +%Y%m%d_%H%M%S).js

echo "✅ Backup created in repo2/backup/"
