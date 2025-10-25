```jsx
import TransmissionPreview from './components/TransmissionPreview';

// inside return():
<TransmissionPreview />
```

function checkGPSStatus() {
  if (!navigator.geolocation) {
    alert("Location services are required to use QonexAI.");
    window.location.href = "/gps-required.html"; // Graceful block
  } else {
    navigator.geolocation.getCurrentPosition(
      () => {}, 
      () => {
[10/6, 6:54 AM] ChatGPT 1-800-242-8478: alert("GPS is disabled. Please enable it to continue.");
        window.location.href = "/gps-required.html";
      }
    );
  }
}

window.onload = checkGPSStatus;
```

---
