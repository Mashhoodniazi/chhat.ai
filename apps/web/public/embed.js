(function () {
  "use strict";

  var config = window.ChatbotConfig || {};
  var botId = config.botId;
  var apiKey = config.apiKey;
  var botName = config.botName || "Assistant";
  var primaryColor = config.primaryColor || "#4f46e5";
  var position = config.position || "bottom-right";
  var greetingMessage = config.greetingMessage || null;
  var placeholder = config.placeholder || "Ask a question...";
  var suggestedQuestions = Array.isArray(config.suggestedQuestions)
    ? config.suggestedQuestions.filter(function(q) { return typeof q === "string" && q.trim(); })
    : [];

  if (!botId || !apiKey) {
    console.warn("[ChatBot AI] Missing botId or apiKey in ChatbotConfig.");
    return;
  }

  var scriptEl = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var origin = scriptEl.src
    ? new URL(scriptEl.src).origin
    : window.location.origin;

  var conversationId = null;
  var isOpen = false;
  var isRight = position !== "bottom-left";
  var hPos = isRight ? "right" : "left";

  function hexToRgba(hex, alpha) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "rgba(79,70,229," + alpha + ")";
    return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + alpha + ")";
  }

  var shadowColor = hexToRgba(primaryColor, 0.4);
  var shadowColorHover = hexToRgba(primaryColor, 0.5);

  var styles = `
    #cb-widget-root, #cb-widget-root * {
      box-sizing: border-box !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      -webkit-font-smoothing: antialiased;
    }
    #cb-toggle {
      all: unset;
      position: fixed !important; bottom: 24px !important; ${hPos}: 24px !important; z-index: 2147483647 !important;
      width: 56px !important; height: 56px !important; border-radius: 50% !important;
      background: ${primaryColor} !important; cursor: pointer !important;
      box-shadow: 0 4px 20px ${shadowColor} !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
      pointer-events: auto !important;
    }
    #cb-toggle:hover { transform: scale(1.08) !important; box-shadow: 0 6px 24px ${shadowColorHover} !important; }
    #cb-toggle svg { width: 26px !important; height: 26px !important; fill: white !important; }
    #cb-window {
      position: fixed !important; bottom: 92px !important; ${hPos}: 24px !important; z-index: 2147483646 !important;
      width: 380px !important; max-width: calc(100vw - 48px) !important;
      height: 540px !important; max-height: calc(100vh - 120px) !important;
      background: #fff !important; border-radius: 16px !important;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15) !important;
      display: flex !important; flex-direction: column !important;
      overflow: hidden !important; transition: opacity 0.2s, transform 0.2s !important;
      pointer-events: auto !important;
    }
    #cb-window.cb-hidden { opacity: 0 !important; transform: translateY(12px) scale(0.97) !important; pointer-events: none !important; }
    #cb-header {
      background: ${primaryColor} !important; padding: 16px 20px !important;
      display: flex !important; align-items: center !important; gap: 12px !important; flex-shrink: 0 !important;
    }
    #cb-header-avatar {
      width: 36px !important; height: 36px !important; border-radius: 50% !important;
      background: rgba(255,255,255,0.2) !important;
      display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important;
    }
    #cb-header-avatar svg { width: 20px !important; height: 20px !important; fill: white !important; }
    #cb-header-text { flex: 1 !important; min-width: 0 !important; }
    #cb-header-name { font-size: 15px !important; font-weight: 600 !important; color: white !important; }
    #cb-header-status { font-size: 12px !important; color: rgba(255,255,255,0.7) !important; display: flex !important; align-items: center !important; gap: 5px !important; }
    #cb-status-dot { width: 7px !important; height: 7px !important; border-radius: 50% !important; background: #6ee7b7 !important; }
    #cb-messages {
      flex: 1 !important; overflow-y: auto !important; padding: 16px !important;
      display: flex !important; flex-direction: column !important; gap: 12px !important;
      scrollbar-width: thin !important; scrollbar-color: #e5e7eb transparent !important;
    }
    #cb-messages::-webkit-scrollbar { width: 5px !important; }
    #cb-messages::-webkit-scrollbar-thumb { background: #e5e7eb !important; border-radius: 10px !important; }
    .cb-msg { display: flex !important; gap: 8px !important; max-width: 90% !important; animation: cbFadeIn 0.2s ease !important; }
    .cb-msg.cb-user { margin-left: auto !important; flex-direction: row-reverse !important; }
    .cb-bubble {
      padding: 10px 14px !important; border-radius: 14px !important; font-size: 14px !important; line-height: 1.5 !important;
      word-wrap: break-word !important; white-space: pre-wrap !important;
    }
    .cb-msg.cb-bot .cb-bubble { background: #f3f4f6 !important; color: #1f2937 !important; border-bottom-left-radius: 4px !important; }
    .cb-msg.cb-user .cb-bubble { background: ${primaryColor} !important; color: white !important; border-bottom-right-radius: 4px !important; }
    .cb-avatar {
      width: 28px !important; height: 28px !important; border-radius: 50% !important; flex-shrink: 0 !important;
      background: #e0e7ff !important; display: flex !important; align-items: center !important; justify-content: center !important;
      margin-top: 2px !important;
    }
    .cb-avatar svg { width: 16px !important; height: 16px !important; fill: ${primaryColor} !important; }
    .cb-typing { display: flex !important; gap: 4px !important; align-items: center !important; padding: 12px 14px !important; }
    .cb-typing span {
      width: 7px !important; height: 7px !important; border-radius: 50% !important; background: #9ca3af !important;
      animation: cbBounce 1.2s infinite !important;
    }
    .cb-typing span:nth-child(2) { animation-delay: 0.2s !important; }
    .cb-typing span:nth-child(3) { animation-delay: 0.4s !important; }
    #cb-footer { padding: 12px 16px !important; border-top: 1px solid #f3f4f6 !important; flex-shrink: 0 !important; background: #fff !important; }
    #cb-form { display: flex !important; gap: 8px !important; align-items: flex-end !important; }
    #cb-input {
      all: unset !important;
      display: block !important;
      flex: 1 !important;
      border: 1.5px solid #e5e7eb !important; border-radius: 10px !important;
      padding: 10px 14px !important; font-size: 14px !important;
      resize: none !important; overflow-y: auto !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      line-height: 1.4 !important; max-height: 100px !important; min-height: 40px !important;
      transition: border-color 0.15s !important;
      background: #ffffff !important; color: #111827 !important;
      pointer-events: auto !important;
      -webkit-user-select: text !important;
      user-select: text !important;
      cursor: text !important;
      box-sizing: border-box !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
    }
    #cb-input:focus { border-color: ${primaryColor} !important; outline: none !important; }
    #cb-input::placeholder { color: #9ca3af !important; }
    #cb-input:disabled { background: #f9fafb !important; color: #9ca3af !important; cursor: not-allowed !important; }
    #cb-send {
      all: unset !important;
      width: 40px !important; height: 40px !important; border-radius: 10px !important;
      background: ${primaryColor} !important; cursor: pointer !important; flex-shrink: 0 !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      transition: background 0.15s !important; pointer-events: auto !important;
    }
    #cb-send:hover { background: ${primaryColor} !important; opacity: 0.88 !important; }
    #cb-send:disabled { opacity: 0.5 !important; cursor: not-allowed !important; pointer-events: none !important; }
    #cb-send svg { width: 18px !important; height: 18px !important; fill: white !important; }
    #cb-powered { text-align: center !important; font-size: 11px !important; color: #9ca3af !important; padding: 6px 0 2px !important; }
    #cb-suggestions { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; padding: 4px 16px 12px !important; }
    .cb-suggestion-btn {
      all: unset !important;
      border: 1.5px solid ${primaryColor} !important; color: ${primaryColor} !important;
      border-radius: 20px !important; padding: 6px 14px !important;
      font-size: 13px !important; line-height: 1.4 !important;
      cursor: pointer !important; pointer-events: auto !important;
      transition: background 0.15s !important; white-space: nowrap !important;
    }
    .cb-suggestion-btn:hover { background: ${hexToRgba(primaryColor, 0.08)} !important; }
    @keyframes cbFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes cbBounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
  `;

  var styleTag = document.createElement("style");
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  var root = document.createElement("div");
  root.id = "cb-widget-root";
  document.body.appendChild(root);

  var iconChat = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  var iconClose = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  var iconBot = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H4a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M5 21l1.5-4.5h11L19 21H5z"/></svg>';
  var iconSend = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';

  var toggleBtn = document.createElement("button");
  toggleBtn.id = "cb-toggle";
  toggleBtn.innerHTML = iconChat;
  toggleBtn.setAttribute("aria-label", "Open chat");
  root.appendChild(toggleBtn);

  var chatWindow = document.createElement("div");
  chatWindow.id = "cb-window";
  chatWindow.classList.add("cb-hidden");
  chatWindow.setAttribute("aria-hidden", "true");
  chatWindow.innerHTML = `
    <div id="cb-header">
      <div id="cb-header-avatar">${iconBot}</div>
      <div id="cb-header-text">
        <div id="cb-header-name">${botName}</div>
        <div id="cb-header-status">
          <span id="cb-status-dot"></span>
          Online
        </div>
      </div>
    </div>
    <div id="cb-messages" role="log" aria-live="polite"></div>
    <div id="cb-footer">
      <form id="cb-form" autocomplete="off">
        <textarea
          id="cb-input"
          placeholder="${placeholder}"
          rows="1"
          aria-label="Message input"
        ></textarea>
        <button type="submit" id="cb-send" aria-label="Send message">${iconSend}</button>
      </form>
      <div id="cb-powered">Powered by Chaat.ai</div>
    </div>
  `;
  root.appendChild(chatWindow);

  var messagesEl = document.getElementById("cb-messages");
  var inputEl = document.getElementById("cb-input");
  var formEl = document.getElementById("cb-form");
  var sendBtn = document.getElementById("cb-send");

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle("cb-hidden", !isOpen);
    chatWindow.setAttribute("aria-hidden", isOpen ? "false" : "true");
    toggleBtn.innerHTML = isOpen ? iconClose : iconChat;
    toggleBtn.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    if (isOpen && messagesEl.children.length === 0) {
      var greeting = greetingMessage || ("Hey! I\u2019m " + botName + ". What can I help you with today?");
      addBotMessage(greeting);
      if (suggestedQuestions.length > 0) {
        addSuggestionPills(suggestedQuestions);
      }
    }
    if (isOpen) {
      setTimeout(function () {
        if (inputEl) {
          inputEl.removeAttribute("disabled");
          inputEl.focus();
        }
      }, 150);
    }
  }

  function addBotMessage(text) {
    var msg = document.createElement("div");
    msg.className = "cb-msg cb-bot";
    msg.innerHTML = `<div class="cb-avatar">${iconBot}</div><div class="cb-bubble"></div>`;
    var bubble = msg.querySelector(".cb-bubble");
    bubble.textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
    return bubble;
  }

  function addUserMessage(text) {
    var msg = document.createElement("div");
    msg.className = "cb-msg cb-user";
    msg.innerHTML = '<div class="cb-bubble"></div>';
    msg.querySelector(".cb-bubble").textContent = text;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function addTypingIndicator() {
    var msg = document.createElement("div");
    msg.className = "cb-msg cb-bot";
    msg.id = "cb-typing-indicator";
    msg.innerHTML = `<div class="cb-avatar">${iconBot}</div><div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    var el = document.getElementById("cb-typing-indicator");
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addSuggestionPills(questions) {
    var container = document.createElement("div");
    container.id = "cb-suggestions";
    questions.forEach(function(q) {
      var btn = document.createElement("button");
      btn.className = "cb-suggestion-btn";
      btn.textContent = q;
      btn.addEventListener("click", function() {
        var el = document.getElementById("cb-suggestions");
        if (el) el.remove();
        inputEl.value = q;
        inputEl.style.height = "auto";
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
        formEl.dispatchEvent(new Event("submit"));
      });
      container.appendChild(btn);
    });
    messagesEl.appendChild(container);
    scrollToBottom();
  }

  function setInputDisabled(disabled) {
    inputEl.disabled = disabled;
    sendBtn.disabled = disabled;
  }

  async function sendMessage(message) {
    var suggestionsEl = document.getElementById("cb-suggestions");
    if (suggestionsEl) suggestionsEl.remove();
    addUserMessage(message);
    setInputDisabled(true);
    addTypingIndicator();

    try {
      var res = await fetch(origin + "/api/chat/" + botId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          apiKey: apiKey,
          conversationId: conversationId,
        }),
      });

      if (!res.ok) {
        removeTypingIndicator();
        addBotMessage("Sorry, I encountered an error. Please try again.");
        return;
      }

      removeTypingIndicator();
      var bubble = addBotMessage("");
      var fullText = "";

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split("\n");
        buffer = lines.pop();

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line.startsWith("data: ")) continue;
          var data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            var parsed = JSON.parse(data);
            if (parsed.conversationId) {
              conversationId = parsed.conversationId;
            }
            if (parsed.text) {
              fullText += parsed.text;
              bubble.textContent = fullText;
              scrollToBottom();
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      removeTypingIndicator();
      addBotMessage("Sorry, something went wrong. Please check your connection and try again.");
    } finally {
      setInputDisabled(false);
      inputEl.focus();
    }
  }

  toggleBtn.addEventListener("click", toggleChat);

  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = inputEl.value.trim();
    if (!msg) return;
    inputEl.value = "";
    inputEl.style.height = "auto";
    sendMessage(msg);
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.dispatchEvent(new Event("submit"));
    }
  });

  inputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });
})();
