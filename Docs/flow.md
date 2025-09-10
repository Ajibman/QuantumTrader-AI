 [ Global Data Feeds ]   t0
        │
        ▼
┌─────────────────────────┐
│ Module 01 – Core Logic  │   t1
│ + Peace Index filter    │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Module 02 – Data Proc.  │   t2
│ (clean, normalize)      │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Module 03 – Market An.  │   t3
│ (patterns, signals)     │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Module 04 – Risk Mgmt   │   t4
│ (Peace Index applies)   │
└─────────────────────────┘
        │
        ▼
      ... continues ...

        ▼
┌─────────────────────────┐
│ Module 15 – Execution   │   t15
│ (orders, alerts)        │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│   CCLM (run_qtai.py)    │   t*
│ Orchestrates 01–15      │
│ Collects results        │
│ Outputs final decision  │
└─────────────────────────┘
        │
        ▼
[ Market Actions + Reports ]   t_end


