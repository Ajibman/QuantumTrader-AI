// js/core/federation/subscriptionGuard.js

export function enforceSubscription() {
  const start = localStorage.getItem("qtai_subscription_start");
  const durationDays = 30;

  if (!start) {
    throw new Error("Subscription not found");
  }

  const startDate = new Date(start);
  const now = new Date();
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + durationDays);

  if (now > expiry) {
    document.body.innerHTML = `
      <div style="padding:2rem;font-family:sans-serif">
        <h2>Subscription Expired</h2>
        <p>Your monthly subscription has expired.</p>
        <p>Please renew to continue.</p>
      </div>
    `;
    throw new Error("Subscription expired");
  }
}
