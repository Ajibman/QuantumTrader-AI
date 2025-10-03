```js
document.getElementById("commForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
    timestamp: new Date().toISOString()
  };

  const res = await fetch("/api/commhub", { 

method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const msg = await res.text();
  document.getElementById("statusMsg").innerText = msg;
});

method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const msg = await res.text();
  document.getElementById("statusMsg").innerText = msg;
});
```
