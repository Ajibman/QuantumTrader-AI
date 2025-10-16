Deployment Checklist — QuantumTrader‑AI

This document describes the steps to deploy *QuantumTrader‑AI* on Termux (Android) or Linux environments.

1. Setup Environment

pkg update && pkg upgrade
pkg install git nodejs
node -v     # confirm Node.js version
git --version

2. Clone the Repository

git clone https://github.com/Ajibman/QuantumTrader-AI.git
cd QuantumTrader-AI

3. Validate Folder Structure & Naming

node checkStructure.js
node validateFolderNames.js

- Ensure folders `src/`, `assets/`, `public/` exist and are lowercase.
- No leftover uppercase variants like `SRC/` or `Assets/`.

4. Prepare to Run Server

cd src
ls # confirm server.js is present

5. Launch Server

node server.js

- Watch for startup logs and errors.
- Confirm it binds to a port (e.g. `http://localhost:3000`).

6. Test Application

- In browser or mobile: visit `http://localhost:PORT`  
  (where `PORT` is the server’s listening port)
- Check static assets, routes, UI, data endpoints.

7. Post‑Launch Sync

cd .. # if still in src
git add .git commit -m "Deployment: validated structure and launched server"
git push origin main

Notes & Best Practices
- *Freeze structural changes* after this point unless critical.
- Use the validation scripts (`checkStructure.js`, `validateFolderNames.js`) before any new commits.
- Backup before large updates.
- Ensure all collaborators use the same folder-naming rules.
---
