// Inside Dashboard.js
const [logs, setLogs] = useState([]);

const fetchLogs = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/admin/logs");
    const data = await res.json();
    setLogs(data.logs);
  } catch (err) {
    setLogs([`Error: ${err.message}`]);
  }
};

// Auto-refresh logs every 10s
useEffect(() => {
  fetchLogs();
  const interval = setInterval(fetchLogs, 10000);
  return () => clearInterval(interval);
}, []);

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
