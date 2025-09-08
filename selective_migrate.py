# Paths to repo1 (source) and repo2 (destination)
repo1_path = "/path/to/repo1/Quantum-Trader-AI"
repo2_path = "/path/to/repo2/QuantumTrader-AI"

homepage_files = [
    os.path.join(repo2_path, "index.html"),  
    os.path.join(repo2_path, "src", "components", "Header.jsx")
]

python selective_migrate.py

import os
import shutil
from datetime import datetime

# ------------------ CONFIG ------------------
# Paths to repo1 (source) and repo2 (destination)
repo1_path = "/path/to/repo1/Quantum-Trader-AI"
repo2_path = "/path/to/repo2/QuantumTrader-AI"

# Folders to selectively copy
folders_to_copy = {
    "modules": [".py"],      # Only Python scripts
    "docs": [".md"],         # Only Markdown docs
    "assets": [".png", ".jpg", ".svg"]  # Only image assets
}

# Homepage files to update references (adjust paths if needed)
homepage_files = [
    os.path.join(repo2_path, "index.html"),  # HTML homepage
    os.path.join(repo2_path, "src", "components", "Header.jsx")  # React JSX homepage
]

# ------------------ SETUP LOG ------------------
logs_dir = os.path.join(repo2_path, "logs")
os.makedirs(logs_dir, exist_ok=True)
timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_file = os.path.join(logs_dir, f"selective_migrate_{timestamp}.txt")

copied_files = []

# ------------------ MIGRATION ------------------
with open(log_file, "w", encoding="utf-8") as log:
    log.write(f"Selective migration log - {timestamp}\n")
    log.write(f"Source: {repo1_path}\nDestination: {repo2_path}\n\n")

    for folder, extensions in folders_to_copy.items():
        src_folder = os.path.join(repo1_path, folder)
        dst_folder = os.path.join(repo2_path, folder)
        os.makedirs(dst_folder, exist_ok=True)

        if not os.path.exists(src_folder):
            log.write(f"⚠️ Source folder does not exist: {src_folder}\n")
            continue

        for filename in os.listdir(src_folder):
            if any(filename.endswith(ext) for ext in extensions):
                src_file = os.path.join(src_folder, filename)
                dst_file = os.path.join(dst_folder, filename)
                shutil.copy2(src_file, dst_file)
                copied_files.append(f"{folder}/{filename}")
                log.write(f"✅ Copied: {folder}/{filename}\n")

# ------------------ UPDATE HOMEPAGE REFERENCES ------------------
html_snippet = '<img src="assets/globe.png" alt="QT AI Rotating Globe" width="250" />\n'

for homepage in homepage_files:
    if os.path.exists(homepage):
        with open(homepage, "r+", encoding="utf-8") as f:
            content = f.read()
            if "globe.png" not in content:
                # Insert snippet after <body> or return (React JSX)
                if homepage.endswith(".html"):
                    content = content.replace("<body>", f"<body>\n  {html_snippet}")
                else:
                    # React JSX: insert inside return()
                    content = content.replace("return (", f"return (\n  {html_snippet}")
                f.seek(0)
                f.write(content)
                f.truncate()
                log.write(f"✅ Updated homepage reference: {homepage}\n")
            else:
                log.write(f"ℹ️ Homepage already contains globe.png: {homepage}\n")
    else:
        log.write(f"⚠️ Homepage file not found: {homepage}\n")

# ------------------ SUMMARY ------------------
with open(log_file, "a", encoding="utf-8") as log:
    log.write("\n--- Migration Summary ---\n")
    log.write(f"Total files copied: {len(copied_files)}\n")
    for f in copied_files:
        log.write(f"  {f}\n")

print("✅ Selective migration complete. Log saved to:", log_file)
