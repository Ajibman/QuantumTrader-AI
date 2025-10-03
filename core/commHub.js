... js


method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const msg = await res.text();
  document.getElementById("statusMsg").innerText = msg;
});
```
