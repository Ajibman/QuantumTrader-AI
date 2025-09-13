modules/ → Python scripts and any .md files
docs/    → Markdown files
logs/    → For lots

import os
import shutil
from datetime import datetime

# ------------------ Config ------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
modules_dir = os.path.join(BASE_DIR, "modules")  # Python scripts folder
docs_dir = os.path.join(BASE_DIR, "docs")        # Markdown documentation folder
logs_dir = os.path.join(BASE_DIR, "logs")        # Logs folder
repo_version = "V2"  # Change to "V1" for repo1 if needed

# Rollout date
rollout_date = datetime(2025, 11, 9).date()

# ------------------ Setup Folders ------------------
os.makedirs(docs_dir, exist_ok=True)
os.makedirs(logs_dir, exist_ok=True)

# Ensure logs/README.md exists
logs_readme = os.path.join(logs_dir, "README.md")
if not os.path.exists(logs_readme):
    with open(logs_readme, "w", encoding="utf-8") as f:
        f.write("# Logs\n\n")
        f.write("This folder contains automatic backup and cleanup logs for Quantum-Trader-AI.\n")
        f.write("Each file is date-stamped and records which `.md` files were copied, skipped, or deleted.\n")
        f.write("Logs also include project milestones for historical tracking.\n")
    print("📄 Created logs/README.md")

# ------------------ Determine Milestone ------------------
today = datetime.now().date()
if repo_version == "V1":
    milestone_text = "Preparing for rollout — V2 in progress"
elif repo_version == "V2":
    if today < rollout_date:
        milestone_text = "Pre-rollout — V2 ready"
    elif today == rollout_date:
        milestone_text = "🚀 Rollout Day — V2"
    else:
        milestone_text = "Post-rollout — v2 live"
else:
    milestone_text = f"{repo_version} — incremental update"

# ------------------ Prepare Log File ------------------
timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_file = os.path.join(logs_dir, f"workflow_log_{timestamp}.txt")

copied, skipped, deleted, failed_delete = [], [], [], []

with open(log_file, "w", encoding="utf-8") as log:
    # Milestone header
    log.write(f"Quantum-Trader-AI — Master Workflow Log\n")
    log.write(f"Run timestamp: {datetime.now()}\n")
    log.write(f"Repo version: {repo_version}\n")
    log.write(f"Milestone: {milestone_text}\n")
    log.write("-" * 50 + "\n\n")

    # ------------------ Backup Step ------------------
    log.write("### Backup Step: Modules → Docs\n\n")
    for filename in os.listdir(modules_dir):
        if filename.endswith(".md"):
            src_path = os.path.join(modules_dir, filename)
            dst_path = os.path.join(docs_dir, filename)

            if os.path.exists(dst_path):
                skipped.append(filename)
                msg = f"⏭️ Skipped (already exists): {dst_path}"
            else:
                shutil.copy2(src_path, dst_path)
                copied.append(filename)
                msg = f"✅ Copied {src_path} → {dst_path}"

            print(msg)
            log.write(msg + "\n")

    # ------------------ Cleanup Step ------------------
    log.write("\n### Cleanup Step: Remove .md files from Modules\n\n")
    for filename in os.listdir(modules_dir):
        if filename.endswith(".md"):
            file_path = os.path.join(modules_dir, filename)
            try:
                os.remove(file_path)
                deleted.append(filename)
                msg = f"🗑️ Deleted {file_path}"
            except Exception as e:
                failed_delete.append(filename)
                msg = f"⚠️ Could not delete {file_path}: {e}"

            print(msg)
            log.write(msg + "\n")

    # ------------------ Summary ------------------
    log.write("\n--- Workflow Summary ---\n")
    log.write(f"Copied files: {copied if copied else 'None'}\n")
    log.write(f"Skipped files: {skipped if skipped else 'None'}\n")
    log.write(f"Deleted files: {deleted if deleted else 'None'}\n")
    log.write(f"Failed to delete: {failed_delete if failed_delete else 'None'}\n")

print("\nMaster workflow complete. Log saved to:", log_file)

# src/master_generator.py

class CCLM:
    def __init__(self):
        self.n = 1  # default baseline
    
    def scale(self, n: int):
        """
        Scale CCLM to n where n ∈ [0, ∞)
        - n = 0 → seed (potential only)
        - n = 1 → baseline operational
        - n → ∞ → cosmic orchestration
        """
        if n < 0:
            raise ValueError("n must be >= 0")
        self.n = n
        return f"CCLM scaled to {n}"

    def current_mode(self):
        if self.n == 0:
            return "Seed State 🌱"
        elif self.n == 1:
            return "Baseline ⚖️"
        elif self.n >= 1000:  # symbolic for ∞ scaling
            return "Cosmic Orchestration 🌌"
        else:
            return f"Scaled Mode n={self.n}"

def self_structure():
    """
    Returns the internal repo structure and module responsibilities.
    Useful for AT AI self-awareness and diagnostics.
    """
    structure = {
        "repo2": {
            "src": ["master_generator.py", "module01.py", "...", "module15.py"],
            "scripts": ["operational_dashboard.sh"],
            "docs": ["CHANGELOG.md", "PROJECT_LOG.md"],
            "assets": ["cclm_visual.png", "..."]
        },
        "modules": {
            "module01": "Omnidirectional Scan & Security",
            "module02": "Environmental Awareness & Sensor Calibration",
            "module03": "Data Acquisition & Preprocessing",
            "module04": "Core Algorithms & APIs Layer",
            "module05": "Immuno-Defense & Internal Coordination",
            "module06": "High-Risk Event Monitor",
            "module07": "Corruption & False Narrative Detector",
            "module08": "Noise & Pollution Monitoring",
            "module09": "Modular Backups & Failover",
            "module10": "Quantum Security & External Defense",
            "module11": "Strategic Intelligence & Forecasting",
            "module12": "Simulation Engine",
            "module13": "Peace Index Monitoring & Governance",
            "module14": "Decision Support & Advisory Layer",
            "module15": "Output, Communication & Visualization"
        },
        "governance": "CCLM²™ supervises all modules and enforces discipline & integrity"
    }
    return structure

# Example usage
if __name__ == "__main__":
    import pprint
    pprint.pprint(self_structure())
