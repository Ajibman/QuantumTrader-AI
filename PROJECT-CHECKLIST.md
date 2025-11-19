*`PROJECT-CHECKLIST.md`* file, crafted for your `QuantumTrader-AI` repository:
markdown
✅ QuantumTrader-AI™ Deployment Checklist  
*Maintained by:* Olagoke Ajibulu  
*Repo:* QuantumTrader-AI  
*Date:* Post–November 09, 2025  

---

✅ 1. Single Source of Truth  
- `server.mjs` must be *identical* across:
  - `QuantumTrader-AI/` (repo2)
  - `repo2` copy
  - `repo3` used by Render.com  
- Any update to `server.mjs` must sync across all repos.

---

✅ 2. Render Deployment  
- Only `repo3` is connected to *Render.com*.  
- Render must *start with `server.mjs`*, not fallback or static files.  
- No automatic exposure of modules or server routes to public.

---

✅ 3. Modules Visibility Control  
- *15 Modules* must:
  - Remain on the server.
  - Stay *hidden in `index.html`*.
  - Only accessible via backend logic (e.g., post-authentication).  
- No UI splash or frontend rendering of modules.

---

✅ 4. Image Rendering Policy  
- *Image names must not change.*
- All images must render properly.  
- Required:
  - `tradingfloor2_main.png`
  - `macarthur.png`
  - `peace_index_logo.png`
  - All other assets with correct filenames & structure.

---

✅ 5. index.html UI Rules  
- Must contain:
  - A *4–5 line app description* before activation.
[11/19, 11:29 AM] ChatGPT 1-800-242-8478: - Clean structure (no module previews, no messy footers).  
- Footer must appear only at the bottom.
- Payment gate images can be shown; activation logic will be wired in later.

---

✅ 6. Environment Variables  
- Load `OPENAI_API_KEY` via `.env` only.  
- Never exposed in frontend or static files.  
- Ensure `server.mjs` reads environment variables correctly.

---

✅ 7. README.md & LICENSE  
- Must reflect:
  - Accurate authorship by Olagoke Ajibulu.  
  - Project goal and purpose.  
- Remove all outdated or irrelevant boilerplate text.

---

✅ 8. Module Access Rules  
- After payment/activation:
  - Modules remain behind backend logic.
  - Still *not visually exposed* to the user in the UI.

---

✅ 9. GitHub as Source of Truth  
- GitHub repo2 (`QuantumTrader-AI/`) is the base of all truth.  
- Render.com builds from GitHub (`repo3`).  
- No manual edits on Render—sync from GitHub only.

---

> *NOTE:* This checklist is binding and active.  
> Do not deviate—not even by a comma.

```

