---

### (2025-09-21) Step 3 – Frontend to Backend Integration (Flow Diagram)

**Notes:**
- **Frontend (`index.html`)** = requests and UI display.  
- **Backend (`server.js`)** = executes logic, routes visitors, updates logs.  
- **Logs (TEST_LOG.md, reminders)** = record of activities.  
- **Automation scripts (pre-merge.sh, backup.sh)** = ensure backups & safety.  

This establishes **linguistic clarity**:  
- Frontend → *requests*  
- Backend → *executes*  
- Logs → *remembers*  
- Scripts → *protect*  

---

**Notes:**
- **Frontend (`index.html`)** = requests and UI display.  
- **Backend (`server.js`)** = executes logic, routes visitors, updates logs.  
- **Logs (TEST_LOG.md, reminders)** = record of activities.  
- **Automation scripts (pre-merge.sh, backup.sh)** = ensure backups & safety.  

This establishes **linguistic clarity**:  
- Frontend → *requests*  
- Backend → *executes*  
- Logs → *remembers*  
- Scripts → *protect*  

---

## TEST_LOG.md entries

### [2025-09-20 08:59] - pre-merge.sh introduced
- Added **pre-merge.sh** to automate staging and preparation of files before commits.
- Ensures all newly created folders/files are detected and staged.
- Starts automatically at 06:00 hrs WA+1.
- Facilitates seamless pre-merge checks and auto-sync of changes.
- Target: QT AI repository (front-end and server.js).

### [2025-09-20 08:59] - restore.sh introduced
- Added **restore.sh** to enable rollback to the latest backup.
- Can restore all tracked files or specific files.
- Stages restored files and commits automatically with rollback timestamp.
- Provides safety net if any new change breaks functionality.
- Supports visitor/trader workflow continuity in QT AI.

# QuantumTrader-AI Test Log

## Log Entries

### 2025-09-19 13:20 UTC
- Visitor Simulation Tab integrated into index.html
- Initial run successful

### 2025-09-20 07:35 UTC
- Added Talking Drum (Gangan) + Drumsticks emoji 🥁🪘
- Symbolism: "The Talking Drum – Ancient communication system, now Quantum Signal of QT AI"

### 2025-09-20 08:00 UTC
- Defined unusual activity (UA) markers  
- `UA:internal` → activity triggered by system/backend/server  
- `UA:external` → activity triggered by visitors/users

### 2025-09-20 08:05 UTC
- Sample log entries for testing UA markers:  
  - `UA:internal` – Auto-restart simulation cycle completed successfully  
  - `UA:external` – Visitor attempted access with invalid parameters
 
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
