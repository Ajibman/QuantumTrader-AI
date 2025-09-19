#!/bin/bash
# pre-merge.sh
# Pre-merge helper to ensure essential files are staged

set -e

echo "🔍 Running pre-merge checks..."

# Always include TEST_LOG.md in commits
if [ -f "TEST_LOG.md" ]; then
  git add TEST_LOG.md
  echo "✅ TEST_LOG.md staged."
else
  echo "⚠️ TEST_LOG.md not found, skipping."
fi

# Include server and assets if they exist
if [ -f "server.js" ]; then
  git add server.js
  echo "✅ server.js staged."
fi

if [ -d "assets" ]; then
  git add assets/*
  echo "✅ assets staged."
fi

echo "Pre-merge checks complete. Ready for commit."

### [2025-09-19] Update
- Integrated Visitor Simulation module in `index.html`
- Added Horizontal "Y" with 🥁 (drum) and 🪘 (talking drum) to symbolize the Quantum Signal

### [2025-09-19] Update
- Integrated Visitor Simulation module in `index.html`
- Added Horizontal "Y" with 🥁 (drum) and 🪘 (talking drum) to symbolize the Quantum Signal
 
 # TEST_LOG.md

This file tracks all test sessions for QT AI.

---

## Test Session 1
- **Date/Time:** YYYY-MM-DD HH:MM
- **Module Tested:** (e.g., Module 3 – Data Parser)
- **Input:** (what was tested)
- **Expected Output:** (what should happen)
- **Actual Output:** (what happened)
- **Status:** Pass/Fail
- **Notes:** (any extra context, issues, fixes, etc.)

---

## Test Session 2
- **Date/Time:** YYYY-MM-DD HH:MM
- **Module Tested:** 
- **Input:** 
- **Expected Output:** 
- **Actual Output:** 
- **Status:** 
- **Notes:** 

---

*(continue with new sessions below as you test more modules)*
