  '''js

✅ Structure
- *One-time entry fee* (e.g. ₦5,000)
- *Fee status check* before granting access
- *Mock payment handling* for now (real gateway can come later)
- *Free access from Nov 2–9, 2025* (test flight window)

🧠 Implementation Plan
1. *User pays entry fee* → `/pay-entry-fee`
2. *Status stored* in `labEntry.json`
3. *On accessing TraderLab* → server checks:
   - If date is within free access window → allow
   - Else if user paid → allow
   - Else → reject with "Entry fee required."

 '''

----
