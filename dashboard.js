// Export JSON
document.getElementById('export-json').addEventListener('click', () => {
    const dataStr = JSON.stringify(allLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QT_AI_dashboard_logs_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

// Export CSV
document.getElementById('export-csv').addEventListener('click', () => {
    if (!allLogs.length) return;

    const headers = Object.keys(allLogs[0]);
    let csv = headers.join(',') + '\n';

    allLogs.forEach(log => {
        const row = headers.map(h => {
            if (h === 'simulation_events' || h === 'self_structure') {
                return `"${JSON.stringify(log[h]).replace(/"/g, '""')}"`; // escape quotes
            }
            return log[h];
        }).join(',');
        csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QT_AI_dashboard_logs_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});
