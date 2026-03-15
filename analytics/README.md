 # QuantumTrader-AI Analytics Folder

This folder contains all analytics dashboards and data for QuantumTrader-AI.

## 1. Founder Console (Private)
- **File:** `console.html`
- **Purpose:** Full Founder Console with all metrics, Peace Index panels, global traffic, governance signals.
- **Access:** Private. Only the founder/admin should access.
- **Note:** Do not share with investors.

## 2. Peace Index Summary (Investor-Friendly)
- **File:** `peace-index-summary.html`
- **Purpose:** Investor-ready dashboard showing Peace Index engagement metrics.
- **Access:** Safe to share selectively with investors.
- **Notes:**  
  - Reads metrics dynamically from `peace-index-stats.json`.
  - Displays aggregated metrics only; no sensitive data exposed.

## 3. Peace Index Stats JSON
- **File:** `peace-index-stats.json`
- **Purpose:** Contains aggregated metrics for the Peace Index Summary.
- **Access:** Public read-only.
- **Notes:**  
  - Updated automatically by GitHub Actions (`update-peace-index.yml`) or manually.
  - Structure must include:
    ```json
    {
      "total_views": 0,
      "unique_visitors": 0,
      "countries": 0,
      "avg_time": "0m 0s",
      "weekly_views": 0,
      "weekly_visitors": 0,
      "top_regions": []
    }
    ```

## 4. GitHub Actions Workflow
- **File:** `.github/workflows/update-peace-index.yml`
- **Purpose:** Automatically updates `peace-index-stats.json` on a schedule (daily or weekly) or manually.
- **Access:** Internal; runs only on GitHub Actions.
- **Notes:**  
  - Ensures `peace-index-summary.html` always shows up-to-date metrics.
  - Safe for public/investor sharing.

## Summary
- **Private files:** `console.html`  
- **Investor-accessible files:** `peace-index-summary.html` (reads from JSON)  
- **Auto-updated files:** `peace-index-stats.json` (via GitHub Actions)
