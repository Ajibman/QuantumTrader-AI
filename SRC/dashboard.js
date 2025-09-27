import sys
import re

def check_and_fix_markdown(file_path, show_lines=False):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    errors = []
    fixed_lines = []

    for i, line in enumerate(lines, start=1):
        original = line.rstrip("\n")
        modified = original

        # Fix: add missing space after #
        if re.match(r"^#+[^ ]", original):
            modified = re.sub(r"^(#+)([^ ])", r"\1 \2", original)
            if modified != original:
                errors.append((i, "Fixed: Heading missing space after #", original, modified))

        # Detect broken links (cannot auto-fix)
        if "](" in original and not re.search(r"\[.*\]\(.*\)", original):
            errors.append((i, "Broken link syntax (manual fix required)", original, original))

        # Fix: bullet points missing space
        if original.strip().startswith("-") and not original.strip().startswith("- "):
            modified = original.replace("-", "- ", 1)
            if modified != original:
                errors.append((i, "Fixed: Bullet missing space", original, modified))

        fixed_lines.append(modified + "\n")

    # Save corrected file
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(fixed_lines)

    if errors:
        print("⚠️ Issues found:\n")
        for err in errors:
            line_num, msg, old, new = err
            print(f"Line {line_num}: {msg}")
            if show_lines:
                print(f"   ❌ Before: {old}")
                print(f"   ✅ After : {new}\n")
            else:
                print(f"👉 Use your editor’s 'Go to Line {line_num}'\n")
    else:
        print("✅ No Markdown errors found. All good!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python md_checker.py <markdown-file> [--show-lines]")
    else:
        file_path = sys.argv[1]
        show_lines = "--show-lines" in sys.argv
        check_and_fix_markdown(file_path, show_lines)

async function fetchDashboardData() {
    try {
        const response = await fetch('http://localhost:5000/dashboard_data');
        const data = await response.json();

        document.getElementById('cclm_mode').textContent = data.cclm_mode;
        document.getElementById('peace_index').textContent = data.peace_index;
        document.getElementById('simulation_events').textContent =
            JSON.stringify(data.simulation_events, null, 2);
        document.getElementById('self_structure').textContent =
            JSON.stringify(data.self_structure, null, 2);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Refresh every 5 seconds
setInterval(fetchDashboardData, 5000);
fetchDashboardData();

let peaceChart, cclmChart, moduleChart;

function initCharts() {
    const peaceCtx = document.getElementById('peaceIndexChart').getContext('2d');
    const cclmCtx = document.getElementById('cclmModeChart').getContext('2d');
    const moduleCtx = document.getElementById('moduleEventChart').getContext('2d');

    peaceChart = new Chart(peaceCtx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Peace Index', data: [], borderColor: 'lime', fill: false }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    cclmChart = new Chart(cclmCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'CCLM Mode Frequency', data: [], backgroundColor: 'cyan' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    moduleChart = new Chart(moduleCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Module 12 Events', data: [], backgroundColor: 'orange' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function updateCharts(logs) {
    // Peace Index over time
    peaceChart.data.labels = logs.map(l => l.timestamp);
    peaceChart.data.datasets[0].data = logs.map(l => l.peace_index);
    peaceChart.update();

    // CCLM mode frequency
    const cclmCounts = {};
    logs.forEach(l => { cclmCounts[l.cclm_mode] = (cclmCounts[l.cclm_mode] || 0) + 1; });
    cclmChart.data.labels = Object.keys(cclmCounts);
    cclmChart.data.datasets[0].data = Object.values(cclmCounts);
    cclmChart.update();

    // Module 12 event frequency
    const moduleEvents = {};
    logs.forEach(l => {
        l.simulation_events.forEach(e => {
            const name = e.event;
            moduleEvents[name] = (moduleEvents[name] || 0) + 1;
        });
    });
    moduleChart.data.labels = Object.keys(moduleEvents);
    moduleChart.data.datasets[0].data = Object.values(moduleEvents);
    moduleChart.update();
}

// Initialize charts on page load
initCharts();

// Update charts when historical logs are fetched
async function fetchDashboardLogs() {
    try {
        const response = await fetch('http://localhost:5000/dashboard_logs');
        allLogs = await response.json();
        displayLogs(allLogs);
        updateCharts(allLogs);
    } catch (error) {
        console.error('Error fetching dashboard logs:', error);
    }
}

function initCharts() {
    const peaceCtx = document.getElementById('peaceIndexChart').getContext('2d');
    const cclmCtx = document.getElementById('cclmModeChart').getContext('2d');
    const moduleCtx = document.getElementById('moduleEventChart').getContext('2d');

    const zoomOptions = {
        pan: { enabled: true, mode: 'x', modifierKey: 'ctrl' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
    };

    peaceChart = new Chart(peaceCtx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Peace Index', data: [], borderColor: 'lime', fill: false }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { zoom: zoomOptions } }
    });

    cclmChart = new Chart(cclmCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'CCLM Mode Frequency', data: [], backgroundColor: 'cyan' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { zoom: zoomOptions } }
    });

    moduleChart = new Chart(moduleCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Module 12 Events', data: [], backgroundColor: 'orange' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { zoom: zoomOptions } }
    });
}
