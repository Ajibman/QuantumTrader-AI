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

// Historical log viewer
async function fetchDashboardLogs() {
    try {
        const response = await fetch('http://localhost:5000/dashboard_logs');
        const logs = await response.json();
        document.getElementById('dashboard_logs').textContent = JSON.stringify(logs, null, 2);
    } catch (error) {
        console.error('Error fetching dashboard logs:', error);
    }
}

// Refresh live data every 5 seconds
setInterval(fetchDashboardData, 5000);
fetchDashboardData();

// Refresh historical logs every 30 seconds
setInterval(fetchDashboardLogs, 30000);
fetchDashboardLogs();

let allLogs = [];

async function fetchDashboardLogs() {
    try {
        const response = await fetch('http://localhost:5000/dashboard_logs');
        allLogs = await response.json();
        displayLogs(allLogs); // initial display
    } catch (error) {
        console.error('Error fetching dashboard logs:', error);
    }
}

function displayLogs(logs) {
    document.getElementById('dashboard_logs').textContent = JSON.stringify(logs, null, 2);
}

// Apply filters
document.getElementById('apply-filter').addEventListener('click', () => {
    const dateFilter = document.getElementById('filter-date').value;
    const peaceFilter = parseFloat(document.getElementById('filter-peace').value) || 0;

    const filteredLogs = allLogs.filter(log => {
        const logDate = log.timestamp.split('T')[0];
        return (!dateFilter || logDate === dateFilter) && (log.peace_index >= peaceFilter);
    });

    displayLogs(filteredLogs);
});

// Initial fetch and refresh
fetchDashboardLogs();
setInterval(fetchDashboardLogs, 30000);
