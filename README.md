# Window Controls & Settings Spicetify Extension

A sleek, lightweight Spicetify extension that adds custom window controls (**Minimize**, **Maximize / Restore**, **Close**, and optional **PiP Miniplayer**) to Spotify's topbar, fixes topbar alignment, and provides a built-in configuration modal accessible right from your Profile menu.

![Window Controls Preview](topbar_preview.png)

## Features
- **Standard Window Controls by Default**:
  - **Minimize (`─`)**: Smoothly minimizes Spotify to the taskbar.
  - **Maximize / Restore (`🗖` / `🗗`)**: Toggles between maximized and restored window states, syncing icons dynamically with window resize.
  - **Close (`✕`)**: Closes the window or sends Spotify to the system tray (`WINDOW_STATE_HIDDEN`).
- **Profile Menu Settings (Lucid-Lyrics Style)**: Click your profile avatar in the top-right corner to open **Window Controls Settings**.
- **Live Configuration Toggles**:
  - Toggle each button individually (Minimize, Maximize, Close).
  - Optional **Popup Player (`PiP`)** toggle (disabled by default).
  - **Auto-Minimize on PiP**: Minimizes Spotify when opening the miniplayer.
  - **Close to System Tray**: Keeps Spotify running in the notification area on close.
  - **Flush Right Alignment**: Hides Spotify's default 135px Windows titlebar spacer and snaps notifications and profile avatar cleanly to the far right.

## Installation

### Via Spicetify Marketplace
Search for **Window Controls & Settings** in the in-app Spicetify Marketplace and click **Install**.

### Manual Installation
1. Copy `window-controls.js` to your Spicetify `Extensions` folder:
   - **Windows**: `%appdata%\spicetify\Extensions\`
   - **macOS / Linux**: `~/.config/spicetify/Extensions/`
2. Run:
   ```bash
   spicetify config extensions window-controls.js
   spicetify apply
   ```
