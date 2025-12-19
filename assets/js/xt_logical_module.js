// Activation threshold
const ACTIVATION_THRESHOLD = 100_000_000; // $100 million

// WEMA BANK Plc, NIGERIA, Account No: 0299134895
const WEMA_ACCOUNT = "0299134895";

// Path to QR code image
const qrCodeImage = "assets/alat_qr.png"; // adjust path as needed

// Sound notification file (subtle alert)
const alertSound = "assets/activation_sound.mp3"; // replace with actual sound file

// Polling interval (in milliseconds)
const POLLING_INTERVAL = 10000; // every 10 seconds

// Check if module has already been activated
let isActivated = localStorage.getItem("xtModuleActivated") === "true";

if (!isActivated) {
    const monitorAccount = setInterval(() => {
        let balance = getWemaAlatBalance(WEMA_ACCOUNT);

        // Log each check
        console.log(`[${new Date().toLocaleTimeString()}] Current balance: $${balance}. Threshold: $${ACTIVATION_THRESHOLD}`);

        if (balance >= ACTIVATION_THRESHOLD) {
            clearInterval(monitorAccount); // stop polling once activated
            activateXTLogicalModule();
            displayQRCode(qrCodeImage);
            notifyUser();
            playAlertSound(alertSound);

            // Mark as activated in localStorage
            localStorage.setItem("xtModuleActivated", "true");
            console.log("XT Logical Module activated, QR Code displayed, alert triggered, and activation state saved!");
        }
    }, POLLING_INTERVAL);
} else {
    // Already activated, restore QR code display
    console.log("XT Logical Module already activated. Restoring QR Code display...");
    displayQRCode(qrCodeImage);
}

// Function placeholders
function getWemaAlatBalance(accountNumber) {
    // Replace with actual API call to fetch your WEMA BANK account balance
    console.log(`Fetching balance for WEMA BANK Account No: ${accountNumber}...`);
    return 105_000_000; // example balance for testing
}

function activateXTLogicalModule() {
    console.log("XT Logical Module logic executed.");
}

function displayQRCode(imagePath) {
    console.log(`Displaying QR Code: ${imagePath}`);
    const qrContainer = document.getElementById("qtai-qr-container");
    if (qrContainer) {
        qrContainer.src = imagePath;
        qrContainer.style.display = "block"; // ensure it's visible
    } else {
        console.warn("QR container not found. Make sure you have an <img> with id='qtai-qr-container'.");
    }
}

function notifyUser() {
    alert("🚀 XT Logical Module Activated! QR Code is now visible.");
}

function playAlertSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.volume = 0.3; // subtle volume
    audio.play().catch(err => console.warn("Audio playback failed:", err));
}
