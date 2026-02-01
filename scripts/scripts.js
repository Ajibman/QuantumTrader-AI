/* =========================
   SUBSCRIPTION GATE
========================= */
const SUB_KEY = "qtai_traderlab_subscription";
const SUB_DURATION = 30 * 24 * 60 * 60 * 1000;

function initSubscription() {
  if (!localStorage.getItem(SUB_KEY)) {
    const expiry = new Date(Date.now() + SUB_DURATION);
    localStorage.setItem(SUB_KEY, JSON.stringify({ expiry }));
  }
}

function subscriptionActive() {
  const data = JSON.parse(localStorage.getItem(SUB_KEY));
  return new Date() < new Date(data.expiry);
}

function updateStatus() {
  const msg = document.getElementById("status-message");
  if (subscriptionActive()) {
    msg.textContent = "TraderLab access active.";
  } else {
    msg.textContent = "Subscription inactive.";
    document.getElementById("start-assessment").disabled = true;
  }
}

/* =========================
   ORI OLOGO
========================= */
const oriSpeech = document.getElementById("ori-speech");

function oriSpeak(text) {
  oriSpeech.textContent = text;
}

/* =========================
   ASSESSMENT LOGIC
========================= */
const steps = [
  "Simulate opening a trade position.",
  "Analyze market trends.",
  "Apply stop-loss discipline.",
  "Execute a mock trade.",
  "Review performance."
];

const hints = [
  "Open trades only with intent.",
  "Follow trend, not emotion.",
  "Stop-loss preserves capital.",
  "Execution must be deliberate.",
  "Reflection builds mastery."
];

let currentStep = 0;
let score = 0;

const container = document.getElementById("assessment-container");
const stepText = document.getElementById("assessment-step");
const feedback = document.getElementById("feedback");
const finalScore = document.getElementById("final-score");
const progressBar = document.getElementById("progress-bar");
const blocks = document.getElementById("step-blocks");

const tradingFloorButton = document.getElementById("tradingFloorBtn");
const cpilotButton = document.getElementById("cpilotBtn");

function setupBlocks() {
  blocks.innerHTML = "";
  steps.forEach(() => {
    const b = document.createElement("div");
    b.className = "step-block";
    blocks.appendChild(b);
  });
}

function updateProgress() {
  progressBar.style.width = (score / 100) * 100 + "%";
}

function enableButtons() {
  tradingFloorButton.disabled = false;
  cpilotButton.disabled = false;
}

function startAssessment() {
  if (!subscriptionActive()) return;

  oriSpeak(
    "Welcome. I am Ori Ologo. This session values discipline over speed. Peace before Profits."
  );

  container.style.display = "block";
  currentStep = 0;
  score = 0;
  finalScore.textContent = "";
  feedback.textContent = "";
  setupBlocks();
  updateProgress();
  runStep();
}

function runStep() {
  if (currentStep >= steps.length) return endAssessment();

  oriSpeak(`Step ${currentStep + 1}. ${steps[currentStep]}`);
  stepText.textContent = steps[currentStep];
  feedback.textContent = "";

  setTimeout(() => {
    const pass = Math.random() < 0.9;
    const block = blocks.children[currentStep];

    if (pass) {
      score += 20;
      block.style.background = "var(--success)";
      oriSpeak("Well executed. Control is strength.");
    } else {
      block.style.background = "var(--error)";
      oriSpeak("Pause. Review your discipline.");
    }

    updateProgress();
    currentStep++;
    setTimeout(runStep, 1400);
  }, 900);
}

function endAssessment() {
  stepText.textContent
