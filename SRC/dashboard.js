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
