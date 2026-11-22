// Window Controls & Settings — Spicetify Extension
// Custom window controls (Minimize, Maximize/Restore, Close, and optional PiP Miniplayer) with Profile Menu Settings.
(function WindowControlsExtension() {
  const EXTENSION_ID = "window-controls";
  const CONFIG_KEY = "window-controls:config";
  const DESKTOP_WINDOW_STATE_SERVICE = "spotify.desktop.window_state_esperanto.proto.DesktopWindowState";

  // Default configuration: standard icons enabled, PiP disabled by default
  const DEFAULT_CONFIG = {
    showMinimize: true,
    showMaximize: true,
    showClose: true,
    showPip: false,
    autoMinimizeOnPip: true,
    closeToTray: true,
    flushRight: true
  };

  function loadConfig() {
    try {
      const raw = Spicetify.LocalStorage.get(CONFIG_KEY);
      if (raw) {
        return Object.assign({}, DEFAULT_CONFIG, JSON.parse(raw));
      }
    } catch (e) {
      console.warn(`[${EXTENSION_ID}] Failed to parse stored config:`, e);
    }
    return Object.assign({}, DEFAULT_CONFIG);
  }

  function saveConfig(cfg) {
    try {
      Spicetify.LocalStorage.set(CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.error(`[${EXTENSION_ID}] Failed to save config:`, e);
    }
  }

  let config = loadConfig();

  // Crisp Fluent / Windows 11 icons and Lucid-Lyrics Spotify Cogwheel
  const ICONS = {
    minimize: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M14 8.5v1H2v-1h12z"/>
    </svg>`,
    maximize: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/>
    </svg>`,
    restore: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M3 5v8h8V5H3zm7 7H4V6h6v6z"/>
      <path d="M5 3h8v8h-1V4H5V3z"/>
    </svg>`,
    close: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M3.2 2.5 2.5 3.2 7.3 8l-4.8 4.8.7.7 4.8-4.8 4.8 4.8.7-.7L8.7 8l4.8-4.8-.7-.7L8 7.3 3.2 2.5z"/>
    </svg>`,
    miniplayer: `<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M16 2.45c0-.8-.65-1.45-1.45-1.45H1.45C.65 1 0 1.65 0 2.45v11.1C0 14.35.65 15 1.45 15h5.557v-1.5H1.5v-11h13V7H16z"/>
      <path d="M15.25 9.007a.75.75 0 0 1 .75.75v4.493a.75.75 0 0 1-.75.75H9.325a.75.75 0 0 1-.75-.75V9.757a.75.75 0 0 1 .75-.75z"/>
    </svg>`,
    settings: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252Zm0 1.5a9.135 9.135 0 0 0-1.354.117l-.109.977A2.886 2.886 0 0 1 6.525 7.17l-.898-.394a8.293 8.293 0 0 0-1.348 2.317l.798.587a2.881 2.881 0 0 1 0 4.643l-.799.588c.32.842.776 1.626 1.348 2.322l.905-.397a2.882 2.882 0 0 1 4.017 2.318l.11.984c.889.15 1.798.15 2.687 0l.11-.984a2.881 2.881 0 0 1 4.018-2.322l.905.396a8.296 8.296 0 0 0 1.347-2.318l-.798-.588a2.881 2.881 0 0 1 0-4.643l.796-.587a8.293 8.293 0 0 0-1.348-2.317l-.896.393a2.884 2.884 0 0 1-4.023-2.324l-.11-.976a8.988 8.988 0 0 0-1.333-.117ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" fill="currentColor"/></svg>`
  };

  function getTransport() {
    return (
      Spicetify.Platform?.ControlMessageAPI?._updateUiClient?.transport ||
      Spicetify.Platform?.Registry?.resolve?.("EsperantoTransport") ||
      null
    );
  }

  // Set window state: 1 = NORMAL, 2 = MAXIMIZED, 3 = MINIMIZED, 4 = HIDDEN (Tray)
  function setWindowState(state) {
    const transport = getTransport();
    if (transport?.callSingle) {
      transport.callSingle({
        service: DESKTOP_WINDOW_STATE_SERVICE,
        method: "SetWindowState",
        payload: new Uint8Array([8, state])
      }).catch(err => console.error(`[${EXTENSION_ID}] setWindowState error:`, err));
    }
  }

  function isWindowMaximized() {
    return (
      window.outerWidth >= (window.screen.availWidth - 10) &&
      window.outerHeight >= (window.screen.availHeight - 10)
    );
  }

  function toggleMaximize() {
    if (isWindowMaximized()) {
      setWindowState(1); // Normal / Restore
    } else {
      setWindowState(2); // Maximize
    }
    setTimeout(updateMaximizeIcon, 150);
  }

  function minimizeWindow() {
    setWindowState(3); // Minimized
  }

  function handleClose() {
    if (config.closeToTray) {
      setWindowState(4); // Hidden to System Tray
    } else {
      closeWindow();
    }
  }

  function closeWindow() {
    const transport = getTransport();
    if (transport?.callSingle) {
      transport.callSingle({
        service: DESKTOP_WINDOW_STATE_SERVICE,
        method: "CloseWindow",
        payload: new Uint8Array(0)
      }).catch(() => fallbackClose());
    } else {
      fallbackClose();
    }
  }

  function fallbackClose() {
    if (Spicetify.CosmosAsync?.post) {
      Spicetify.CosmosAsync.post("sp://desktop/v1/shutdown", {}).catch(() => window.close());
    } else {
      window.close();
    }
  }

  function toggleMiniplayer() {
    const isPipOpen = Boolean(window.documentPictureInPicture?.window);
    const spicyBtn = document.getElementById("SpicyLyrics_PopupLyricsButton");
    const nativeBtn = document.querySelector('[data-testid="pip-toggle-button"]');
    const targetBtn = spicyBtn || nativeBtn;

    if (isPipOpen) {
      if (targetBtn) targetBtn.click();
    } else {
      if (targetBtn) {
        targetBtn.click();
      } else if (Spicetify.Platform?.History?.push) {
        Spicetify.Platform.History.push("/launch-miniplayer");
      }
      if (config.autoMinimizeOnPip) {
        setTimeout(() => setWindowState(3), 150);
      }
    }
  }

  function hideNativeControls() {
    try {
      const updateUi = Spicetify.Platform?.ControlMessageAPI?._updateUiClient;
      if (updateUi?.setButtonsVisibility) {
        updateUi.setButtonsVisibility({ showButtons: false });
      }
      if (Spicetify.Platform?.NativeAPI?.setWindowButtonsVisibility) {
        Spicetify.Platform.NativeAPI.setWindowButtonsVisibility(false);
      }
    } catch (e) {
      // Not fatal
    }
  }

  function updateMaximizeIcon() {
    const maxBtn = document.querySelector(`.${EXTENSION_ID}-btn.maximize`);
    if (!maxBtn) return;
    const maximized = isWindowMaximized();
    maxBtn.innerHTML = maximized ? ICONS.restore : ICONS.maximize;
    const title = maximized ? "Restore Down" : "Maximize";
    maxBtn.title = title;
    maxBtn.setAttribute("aria-label", title);
  }

  function injectStyles() {
    const styleId = `${EXTENSION_ID}-styles`;
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      ${config.flushRight ? `
      /* Titlebar spacer removal */
      .Root__globalNav .jZZUhUAqjBxjeJnb4GIK,
      .main-globalNav-navItemsContainer .jZZUhUAqjBxjeJnb4GIK,
      .jZZUhUAqjBxjeJnb4GIK {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        flex-shrink: 1 !important;
      }
      ` : ""}

      .main-globalNav-contentRight {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex-shrink: 0 !important;
        gap: 4px !important;
        margin-inline-end: 0 !important;
        margin-right: 0 !important;
      }

      .window-controls-container {
        display: inline-flex !important;
        align-items: center !important;
        gap: 2px !important;
        margin-left: 6px !important;
        height: 100% !important;
        -webkit-app-region: no-drag !important;
        z-index: 99999 !important;
        flex-shrink: 0 !important;
      }

      .window-controls-divider {
        width: 1px !important;
        height: 14px !important;
        background-color: var(--spice-highlight, rgba(255, 255, 255, 0.2)) !important;
        margin: 0 4px !important;
        -webkit-app-region: no-drag !important;
      }

      .window-control-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 28px !important;
        height: 28px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        outline: none !important;
        background: transparent !important;
        color: var(--spice-subtext, rgba(255, 255, 255, 0.7)) !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        transition: background-color 0.15s ease, color 0.15s ease, transform 0.08s ease !important;
        -webkit-app-region: no-drag !important;
      }

      .window-control-btn svg {
        pointer-events: none !important;
      }

      .window-control-btn:hover {
        background-color: var(--spice-highlight, rgba(255, 255, 255, 0.15)) !important;
        color: var(--spice-text, #ffffff) !important;
      }

      .window-control-btn:active {
        transform: scale(0.92) !important;
      }

      .window-control-btn.close:hover {
        background-color: #e81123 !important;
        color: #ffffff !important;
      }

      /* Settings Modal Styling */
      .wc-settings-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 8px 4px;
        font-family: var(--font-family, sans-serif);
      }

      .wc-setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .wc-setting-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .wc-setting-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .wc-setting-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--spice-text, #fff);
      }

      .wc-setting-desc {
        font-size: 0.8rem;
        color: var(--spice-subtext, rgba(255, 255, 255, 0.6));
      }

      .wc-switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }

      .wc-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .wc-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(255, 255, 255, 0.2);
        transition: 0.2s;
        border-radius: 24px;
      }

      .wc-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.2s;
        border-radius: 50%;
      }

      .wc-switch input:checked + .wc-slider {
        background-color: #1db954;
      }

      .wc-switch input:checked + .wc-slider:before {
        transform: translateX(20px);
      }
    `;
  }

  function createButton(type, label, iconHtml, onClick) {
    const btn = document.createElement("button");
    btn.className = `window-control-btn ${type} ${EXTENSION_ID}-btn`;
    btn.title = label;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = iconHtml;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      onClick();
    });

    if (Spicetify.Tippy) {
      Spicetify.Tippy(btn, {
        content: label,
        ...Spicetify.TippyProps
      });
    }

    return btn;
  }

  function getTargetContainer() {
    return (
      document.querySelector(".main-globalNav-contentRight") ||
      document.querySelector(".main-topBar-topbarContentRight") ||
      document.querySelector(".main-topBar-container") ||
      document.querySelector(".Root__globalNav")
    );
  }

  function mountControls() {
    const existing = document.querySelector(`.${EXTENSION_ID}`);
    if (existing) existing.remove();

    const targetContainer = getTargetContainer();
    if (!targetContainer) return false;

    injectStyles();
    hideNativeControls();

    const container = document.createElement("div");
    container.className = `window-controls-container ${EXTENSION_ID}`;

    const divider = document.createElement("div");
    divider.className = "window-controls-divider";
    container.appendChild(divider);

    // Optional PiP Miniplayer (disabled by default)
    if (config.showPip) {
      const pipBtn = createButton("miniplayer", "Popup Player (PiP)", ICONS.miniplayer, toggleMiniplayer);
      container.appendChild(pipBtn);
    }

    // Standard Minimize Button
    if (config.showMinimize) {
      const minBtn = createButton("minimize", "Minimize", ICONS.minimize, minimizeWindow);
      container.appendChild(minBtn);
    }

    // Standard Maximize / Restore Button
    if (config.showMaximize) {
      const isMax = isWindowMaximized();
      const maxBtn = createButton("maximize", isMax ? "Restore Down" : "Maximize", isMax ? ICONS.restore : ICONS.maximize, toggleMaximize);
      container.appendChild(maxBtn);
    }

    // Standard Close Button
    if (config.showClose) {
      const closeBtn = createButton("close", "Close", ICONS.close, handleClose);
      container.appendChild(closeBtn);
    }

    targetContainer.appendChild(container);
    updateMaximizeIcon();
    return true;
  }

  // Settings Modal (Lucid-Lyrics pattern using Spicetify.PopupModal)
  function openSettingsModal() {
    const content = document.createElement("div");
    content.className = "wc-settings-modal";

    const options = [
      {
        key: "showMinimize",
        title: "Minimize Button",
        desc: "Show the standard minimize window button in the topbar."
      },
      {
        key: "showMaximize",
        title: "Maximize / Restore Button",
        desc: "Show the standard maximize and restore window button."
      },
      {
        key: "showClose",
        title: "Close Button",
        desc: "Show the close window button."
      },
      {
        key: "showPip",
        title: "Miniplayer (PiP) Button",
        desc: "Show the Picture-in-Picture / Spicy Lyrics popup toggle button."
      },
      {
        key: "autoMinimizeOnPip",
        title: "Auto-Minimize on PiP",
        desc: "Automatically minimize the main Spotify window when launching the miniplayer."
      },
      {
        key: "closeToTray",
        title: "Close to System Tray",
        desc: "Send Spotify to the system tray notification area instead of exiting completely."
      },
      {
        key: "flushRight",
        title: "Flush Right Alignment",
        desc: "Remove the Windows titlebar spacer and align topbar items flush to the right edge."
      }
    ];

    options.forEach(opt => {
      const row = document.createElement("div");
      row.className = "wc-setting-row";

      const info = document.createElement("div");
      info.className = "wc-setting-info";

      const title = document.createElement("div");
      title.className = "wc-setting-title";
      title.textContent = opt.title;

      const desc = document.createElement("div");
      desc.className = "wc-setting-desc";
      desc.textContent = opt.desc;

      info.appendChild(title);
      info.appendChild(desc);

      const label = document.createElement("label");
      label.className = "wc-switch";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(config[opt.key]);

      const slider = document.createElement("span");
      slider.className = "wc-slider";

      input.addEventListener("change", () => {
        config[opt.key] = input.checked;
        saveConfig(config);
        mountControls(); // Live update buttons immediately!
      });

      label.appendChild(input);
      label.appendChild(slider);

      row.appendChild(info);
      row.appendChild(label);
      content.appendChild(row);
    });

    Spicetify.PopupModal.display({
      title: "Window Controls Settings",
      content: content,
      isLarge: false
    });
  }

  // Profile Menu Integration (Lucid-Lyrics style)
  function registerProfileMenu() {
    if (!Spicetify?.Menu?.Item) {
      setTimeout(registerProfileMenu, 250);
      return;
    }

    try {
      const menuItem = new Spicetify.Menu.Item(
        "Window Controls Settings",
        false,
        openSettingsModal,
        ICONS.settings
      );
      menuItem.register();
    } catch (e) {
      console.warn(`[${EXTENSION_ID}] Failed to register profile menu item:`, e);
    }
  }

  function init() {
    injectStyles();

    // Retry mounting until Spotify finishes DOM render
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (mountControls() || attempts > 60) {
        clearInterval(interval);
      }
    }, 200);

    registerProfileMenu();

    window.addEventListener("resize", () => {
      updateMaximizeIcon();
    });

    const observer = new MutationObserver(() => {
      if (!document.querySelector(`.${EXTENSION_ID}`)) {
        mountControls();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  init();
})();
