const likeButton = document.getElementById("likeBtn");
const copyButton = document.getElementById("copyBtn");

const likeCounterText = document.getElementById("likeCount");
const coinCounterText = document.getElementById("coinCount");
const copyCounterText = document.getElementById("copyCount");

const STORAGE_KEY = "emergencyServiceState";
const DEFAULT_STATE = { likes: 0, coins: 100, copies: 2 };
const REFERRAL_CODE = "EMERGENCY-HELP-2025";

function loadState() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || { ...DEFAULT_STATE };
}

function saveState(currentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
}

function updateDisplay(currentState) {
  likeCounterText.textContent = currentState.likes;
  coinCounterText.textContent = currentState.coins;
  copyCounterText.textContent = currentState.copies;
}

let appState = loadState();
updateDisplay(appState);

likeButton.addEventListener("click", () => {
  appState.likes += 1;
  saveState(appState);
  updateDisplay(appState);
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(REFERRAL_CODE);
    appState.copies += 1;
    saveState(appState);
    updateDisplay(appState);
  } catch (error) {
    console.error("Failed to copy referral code:", error);
  }
});
