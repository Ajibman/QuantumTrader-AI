// js/core/constitution/accessControl.js

export function enforceAccessControl() {
  const role = localStorage.getItem("qtai_user_role");

  if (role !== "exclusive_trader") {
    document.body.innerHTML = `
      <div style="padding:2rem;font-family:sans-serif">
        <h2>Access Restricted</h2>
        <p>This application is currently in a private trading phase.</p>
      </div>
    `;
    throw new Error("Access denied: non-exclusive trader");
  }
}
