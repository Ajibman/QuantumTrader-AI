<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuantumTrader™</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background: #000428;
      font-family: Arial, sans-serif;
      color: white;
      text-align: center;
    }

    header {
      margin-top: 20px;
    }

    #qtai-main-globe {
      width: 160px;
      max-width: 70%;
    }

    #peace-index-logo {
      width: 110px;
      margin-top: 25px; /* B2 spacing */
    }

    h2, h3, p {
      margin: 10px 0;
    }

    .node-section {
      margin-top: 45px;
      padding: 10px;
    }

    .node-section img {
      width: 85%;
      max-width: 420px;
      border-radius: 6px;
    }

    button {
      background-color: #1abc9c;
      color: white;
      padding: 14px 28px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 10px;
      font-size: 16px;
    }

    footer {
      margin-top: 40px;
      padding: 20px;
      background: #000215;
      font-size: 14px;
      color: #bbb;
    }
  </style>
</head>

<body>  
<script>
/* drawer & dropdown logic for QuantumTrader AI */
(function () {
  // elements
  const openDrawerBtn = document.getElementById('open-world-drawer');
  const closeDrawerBtn = document.getElementById('close-world-drawer');
  const worldDrawer = document.getElementById('world-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');

  const drawerLinks = document.querySelectorAll('.drawer-link');
  const compassToggle = document.getElementById('compass-toggle');
  const compassDropdown = document.getElementById('compass-dropdown');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // helpers
  function openDrawer() {
    worldDrawer.classList.add('open');
    worldDrawer.classList.remove('closed');
    drawerOverlay.classList.add('visible');
    drawerOverlay.classList.remove('hidden');
    worldDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    worldDrawer.classList.remove('open');
    worldDrawer.classList.add('closed');
    drawerOverlay.classList.remove('visible');
    drawerOverlay.classList.add('hidden');
    worldDrawer.setAttribute('aria-hidden', 'true');
  }

  // open/close events
  openDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  });
  closeDrawerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  });
  drawerOverlay?.addEventListener('click', () => closeDrawer());

  // escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (worldDrawer.classList.contains('open')) closeDrawer();
      if (!compassDropdown.classList.contains('hidden')) toggleCompass(false);
    }
  });

  // clicking a drawer link opens new window (module)
  drawerLinks.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const path = btn.getAttribute('data-open');
      if (!path) return;
      // open in new tab/window
      window.open(path, '_blank', 'noopener,noreferrer');
      // optional: close drawer after click on mobile
      closeDrawer();
    });
  });

  // Compass dropdown toggle
  function toggleCompass(forceOpen) {
    const isHidden = compassDropdown.classList.contains('hidden');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isHidden;
    if (shouldOpen) {
      compassDropdown.classList.remove('hidden');
      compassToggle.setAttribute('aria-expanded', 'true');
    } else {
      compassDropdown.classList.add('hidden');
      compassToggle.setAttribute('aria-expanded', 'false');
    }
  }

  compassToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCompass();
  });

  // close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!compassDropdown.contains(e.target) && e.target !== compassToggle) {
      toggleCompass(false);
    }
  });

  // handle dropdown items (open in new window)
  dropdownItems.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const path = btn.getAttribute('data-open');
      if (!path) return;
      window.open(path, '_blank', 'noopener,noreferrer');
      toggleCompass(false);
    });
  });

  // Accessibility: trap focus in drawer when open (simple)
  worldDrawer.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    // simple trap: if shift+tab on first focusable, move to last, etc.
    const focusable = worldDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

})();
</script>

  </body>
  </html>
