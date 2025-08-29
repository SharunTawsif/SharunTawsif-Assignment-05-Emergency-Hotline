document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEYS = { header: "es_header_state", history: "es_call_history" };
  const DEFAULT_HEADER_STATE = { likes: 0, coins: 100, copies: 0 };

  const nav = performance.getEntriesByType("navigation")[0];
  const isReload = nav ? nav.type === "reload" : performance.navigation.type === 1;
  if (isReload) {
    localStorage.removeItem(STORAGE_KEYS.header);
    localStorage.removeItem(STORAGE_KEYS.history);
  }

  const likeButton = document.getElementById("likeBtn");
  const likeCountText = document.getElementById("likeCount");
  const coinCountText = document.getElementById("coinCount");
  const copyHeaderButton = document.getElementById("copyBtn");
  const copyCountText = document.getElementById("copyCount");

  const historyList = document.getElementById("historyList");
  const clearHistoryButton = document.getElementById("clearHistory");

  const readHeaderState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.header)) || { ...DEFAULT_HEADER_STATE };
    } catch { return { ...DEFAULT_HEADER_STATE }; }
  };
  const saveHeaderState = (s) => localStorage.setItem(STORAGE_KEYS.header, JSON.stringify(s));

  const readHistory = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.history)) || []; }
    catch { return []; }
  };
  const saveHistory = (items) => localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(items));

  const updateHeaderCounters = (s) => {
    if (likeCountText) likeCountText.textContent = s.likes;
    if (coinCountText) coinCountText.textContent = s.coins;
    if (copyCountText) copyCountText.textContent = s.copies;
  };

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const renderHistory = (items) => {
    if (!historyList) return;
    historyList.innerHTML = "";
    [...items].reverse().forEach(({ title, number, time }) => {
      const row = document.createElement("div");
      row.className = "flex items-start justify-between rounded-xl border border-gray-100 bg-white px-3 py-3";
      row.innerHTML = `
        <div>
          <div class="text-sm font-semibold text-gray-800">${title}</div>
          <div class="text-xs text-gray-500">${number}</div>
        </div>
        <div class="text-xs text-gray-500">${time}</div>`;
      historyList.appendChild(row);
    });
  };

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const t = document.createElement("textarea");
      t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); document.body.removeChild(t); return true; }
      catch { document.body.removeChild(t); return false; }
    }
  };

  // Helper: read metadata from a specific card right when clicked
  const getMeta = (card) => {
    const title = (card.dataset.title || card.querySelector("h3")?.textContent || "Service").trim();
    const number = (card.dataset.number || card.querySelector(".number")?.textContent || "").trim();
    return { title, number };
  };

  let headerState = readHeaderState();
  let callHistory = readHistory();
  updateHeaderCounters(headerState);
  renderHistory(callHistory);

  if (likeButton) {
    likeButton.addEventListener("click", () => {
      headerState.likes += 1;
      saveHeaderState(headerState);
      updateHeaderCounters(headerState);
    });
  }

  if (copyHeaderButton) {
    copyHeaderButton.addEventListener("click", async () => {
      const copied = await copyToClipboard("EMERGENCY-HELP-2025");
      headerState.copies += 1;
      saveHeaderState(headerState);
      updateHeaderCounters(headerState);
      alert(copied ? "Referral code copied! (EMERGENCY-HELP-2025)" : "Couldn't copy automatically. Please copy manually.");
    });
  }

  document.querySelectorAll(".service-card").forEach((card) => {
    const heartButton = card.querySelector('[aria-label="Favorite"]');
    if (heartButton) {
      heartButton.addEventListener("click", () => {
        headerState.likes += 1;
        saveHeaderState(headerState);
        updateHeaderCounters(headerState);
      });
    }

    const copyBtn = card.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const { number } = getMeta(card);
        const ok = await copyToClipboard(number);
        headerState.copies += 1;
        saveHeaderState(headerState);
        updateHeaderCounters(headerState);
        alert(ok ? `Hotline ${number} copied!` : "Couldn't copy automatically. Please copy the number manually.");
      });
    }

    const callBtn = card.querySelector(".call-btn");
    if (callBtn) {
      callBtn.addEventListener("click", () => {
        if (headerState.coins < 20) {
          alert("Not enough coins to place a call. You need at least 20 coins.");
          return;
        }
        const { title, number } = getMeta(card);
        alert(`Calling ${title} (${number})`);
        headerState.coins -= 20;
        if (headerState.coins < 0) headerState.coins = 0;
        saveHeaderState(headerState);
        updateHeaderCounters(headerState);

        const entry = { title, number, time: nowTime() };
        callHistory.push(entry);
        saveHistory(callHistory);
        renderHistory(callHistory);
      });
    }
  });

  if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", () => {
      if (!confirm("Clear all call history?")) return;
      callHistory = [];
      saveHistory(callHistory);
      renderHistory(callHistory);
    });
  }
});
