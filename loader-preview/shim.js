/*
 * Calibration Loader hero preview shim — JUCE bridge replacement for the marketing iframe.
 *
 * Loaded as a plain (non-module) script BEFORE plugin.html's own scripts run, so
 * window.__JUCE__ is already in place when the loader bootstraps. Adapted from
 * wizard_n_plugins/src/plugin/WebUI/preview.html, trimmed to what the demo needs,
 * and pre-seeded with a 7.1.4 + 4-subwoofer routing (12 input / 15 output channels).
 *
 * Sibling file: ./index.html — a frozen snapshot of plugin.html with a
 * <script src="shim.js"></script> tag injected immediately after <head>.
 */
(function () {
  "use strict";

  /* Advertised JUCE entry points for the WebView bootstrap. Calibration delete / prepare
   * natives are omitted here: trash controls are hidden in the marketing iframe (`injectOverrideStylesOnce`)
   * and those code paths are irrelevant to the landing-page demo. */
  var NATIVE_NAMES = [
    "loadConfig", "setVolume", "setBypass", "getState", "login", "cancelAuth", "retryAuth", "logout",
    "userActivity", "openUrl", "selectLicense", "refreshLicenses", "getLicenses",
    "getCrashConsent", "setCrashConsent", "setGainLimit", "setAutoBypassRendering", "setShowExtraChannels",
    "setMeterFullscreen",
    "setDim", "setDimAmount", "setUserEQState", "setZoom",
    "getCalibrations", "selectCalibration", "unloadCalibration", "launchWizard",
    "getLocalCalibrations", "loadLocalCalibration",
    "uiPointerTrace"
  ];

  /* ── Speaker layout: 7.1.4 + 4 subwoofers ─────────────────────────────────── */

  var INPUT_NAMES = [
    "L", "R", "C", "LFE",
    "Ls", "Rs", "Lrs", "Rrs",
    "Tfl", "Tfr", "Tbl", "Tbr"
  ];

  /* per-input "this row sits on the height row" hint (drives meter strip layout) */
  var INPUT_HEIGHT_HINTS = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];

  /* per-input LFE flag — only the dedicated LFE feed */
  var INPUT_IS_LFE = [
    false, false, false, true,
    false, false, false, false,
    false, false, false, false
  ];

  /* outputs: same mains/surrounds/heights, single LFE input split to 4 subs */
  var OUTPUT_NAMES = [
    "L", "R", "C",
    "Sub 1", "Sub 2", "Sub 3", "Sub 4",
    "Ls", "Rs", "Lrs", "Rrs",
    "Tfl", "Tfr", "Tbl", "Tbr"
  ];

  var CAL_ID_STEREO = "demo-stereo";

  /* Mix room stereo: 2 in (L/R), 8 out (L/R + six subs) */
  var STEREO_MIX_INPUT_NAMES = ["L", "R"];
  var STEREO_MIX_OUTPUT_NAMES = ["L", "R", "Sub 1", "Sub 2", "Sub 3", "Sub 4", "Sub 5", "Sub 6"];
  var STEREO_MIX_HEIGHT_HINTS = [0, 0];
  var STEREO_MIX_IS_LFE = [false, false];

  function applyMeterLayout714() {
    seed.meterInputNames = INPUT_NAMES.slice();
    seed.meterOutputNames = OUTPUT_NAMES.slice();
    seed.meterCfgInputCount = INPUT_NAMES.length;
    seed.meterCfgOutputCount = OUTPUT_NAMES.length;
    seed.meterInputHeightHints = INPUT_HEIGHT_HINTS.slice();
    seed.meterInputIsLfe = INPUT_IS_LFE.slice();
    seed.routingText =
      "[Demo \u00b7 7.1.4 with 4 subs]\n" +
      "Main bed L/R/C, surround Ls/Rs, rear Lrs/Rrs, heights Tfl/Tfr/Tbl/Tbr \u2014 single LFE input distributed to 4 subwoofers.";
    seed.routingTitle = "Active Routes";
    seed.meterInputNoSignal = [];
  }

  function applyMeterLayoutStereoMixRoom() {
    seed.meterInputNames = STEREO_MIX_INPUT_NAMES.slice();
    seed.meterOutputNames = STEREO_MIX_OUTPUT_NAMES.slice();
    seed.meterCfgInputCount = STEREO_MIX_INPUT_NAMES.length;
    seed.meterCfgOutputCount = STEREO_MIX_OUTPUT_NAMES.length;
    seed.meterInputHeightHints = STEREO_MIX_HEIGHT_HINTS.slice();
    seed.meterInputIsLfe = STEREO_MIX_IS_LFE.slice();
    seed.routingText =
      "[Demo \u00b7 Mix room stereo]\n" +
      "Stereo L/R in \u2014 L/R mains plus six subwoofer outputs.";
    seed.routingTitle = "Active Routes (stereo)";
    seed.meterInputNoSignal = [];
  }

  function applyMeterLayoutForCalibrationId(calId) {
    if (calId === CAL_ID_STEREO) applyMeterLayoutStereoMixRoom();
    else applyMeterLayout714();
  }

  var seed = {
    authState: "authenticated",
    authEmail: "demo@umamiaudio.com",
    configLoaded: true,
    configFileName: "Studio_A_7.1.4 with 4 subs.npz",
    configFilePath: "C:\\Demo\\Studio_A_7.1.4 with 4 subs.npz",
    volume: 0.78,
    bypass: false,
    hostId: "reaper",
    autoBypassRendering: true,
    showExtraChannels: false,
    meterFullscreen: false,
    gainLimit: true,
    dim: false,
    dimAmountDb: -24,
    zoom: 1,
    routingText:
      "[Demo \u00b7 7.1.4 with 4 subs]\n" +
      "Main bed L/R/C, surround Ls/Rs, rear Lrs/Rrs, heights Tfl/Tfr/Tbl/Tbr \u2014 single LFE input distributed to 4 subwoofers.",
    routingTitle: "Active Routes",
    buildInfo: "",
    hostSampleRate: 48000,
    /* Lowercase key — matches plugin's `_licenseStatusInfo[_licenseStatus]` map → green dot + "License active". */
    licenseStatus: "valid",
    licenseId: 1,
    computerName: "STUDIO-A",
    computerId: "demo-machine-id",
    installerVersionPlatform: "",
    /* intentionally omit appVersion — otherwise plugin schedules installer-version.json fetch and may show "Update available" */

    meterInputNames: INPUT_NAMES.slice(),
    meterOutputNames: OUTPUT_NAMES.slice(),
    meterCfgInputCount: INPUT_NAMES.length,
    meterCfgOutputCount: OUTPUT_NAMES.length,
    meterInputHeightHints: INPUT_HEIGHT_HINTS.slice(),
    meterInputIsLfe: INPUT_IS_LFE.slice(),

    defaultLicenses: {
      licenses: [
        {
          id: 1,
          tier: "perfect_soup",
          licenseType: "perpetual",
          extraSupports: 0,
          isActive: true,
          isExpired: false,
          isUsable: true,
          maxGroups: 8,
          maxSupports: 4,
          expiresAt: "",
          activatedOn: "This machine",
          activatedComputerId: "demo-machine-id"
        }
      ],
      selectedLicenseId: 1,
      computerName: "STUDIO-A",
      computerId: "demo-machine-id"
    },

    defaultRemoteCalibrations: {
      calibrations: [
        {
          calibration_id: "demo-7-1-4-4subs",
          name: "Studio A \u00b7 7.1.4 with 4 subs",
          status: "completed",
          created_at: "2026-04-02T10:00:00.000Z"
        },
        {
          calibration_id: "demo-stereo",
          name: "Mix room \u00b7 stereo",
          status: "completed",
          created_at: "2026-03-10T12:00:00.000Z"
        }
      ]
    },

    localCalsStored: [],
    meterInputNoSignal: [],
    meterTick: 0
  };

  var win = window;
  var listeners = [];
  var meterTimer = null;

  function emitComplete(promiseId, result) {
    var pl = { promiseId: promiseId, result: (result !== undefined ? result : null) };
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](pl); } catch (e) { /* ignore */ }
    }
  }

  function snapshot() {
    return {
      authState: seed.authState,
      authEmail: seed.authEmail,
      configLoaded: seed.configLoaded,
      configFileName: seed.configFileName,
      configFilePath: seed.configFilePath,
      volume: seed.volume,
      bypass: seed.bypass,
      hostId: seed.hostId,
      autoBypassRendering: seed.autoBypassRendering,
      showExtraChannels: seed.showExtraChannels,
      meterFullscreen: seed.meterFullscreen,
      gainLimit: seed.gainLimit,
      dim: seed.dim,
      dimAmountDb: seed.dimAmountDb,
      zoom: seed.zoom,
      routingText: seed.routingText,
      routingTitle: seed.routingTitle,
      buildInfo: seed.buildInfo,
      hostSampleRate: seed.hostSampleRate,
      licenseStatus: seed.licenseStatus,
      licenseId: seed.licenseId,
      computerName: seed.computerName,
      computerId: seed.computerId,
      installerVersionPlatform: seed.installerVersionPlatform,
      appVersion: seed.appVersion,
      meterInputNames: seed.meterInputNames.slice(),
      meterOutputNames: seed.meterOutputNames.slice(),
      meterCfgInputCount: seed.meterCfgInputCount,
      meterCfgOutputCount: seed.meterCfgOutputCount,
      meterInputHeightHints: seed.meterInputHeightHints.slice(),
      meterInputIsLfe: seed.meterInputIsLfe ? seed.meterInputIsLfe.slice() : []
    };
  }

  function meterCount(arr) {
    var n = (arr && arr.length) ? arr.length : 8;
    return Math.max(1, Math.min(n, 32));
  }

  function meterStart() {
    if (meterTimer != null) return;
    meterTimer = setInterval(function () {
      seed.meterTick++;
      var nIn = meterCount(seed.meterInputNames);
      var nOut = meterCount(seed.meterOutputNames);
      var ins = [];
      var outs = [];
      var t = seed.meterTick * 0.09;
      for (var ii = 0; ii < nIn; ii++) {
        var silent = seed.meterInputNoSignal && ii < seed.meterInputNoSignal.length && !!seed.meterInputNoSignal[ii];
        ins.push(silent ? 0 : Math.min(1, Math.abs(Math.sin(t + ii * 0.37)) * 0.18 + Math.random() * 0.05 + 0.04));
      }
      for (var oo = 0; oo < nOut; oo++) {
        outs.push(Math.min(1, Math.abs(Math.cos(t + oo * 0.31)) * 0.20 + Math.random() * 0.05 + 0.05));
      }
      if (win.nativeBridge && win.nativeBridge.onMeterData) {
        win.nativeBridge.onMeterData({ in: ins, out: outs });
      }
    }, 80);
  }

  function pushState() {
    if (!(win.nativeBridge && win.nativeBridge.onState)) return;
    win.nativeBridge.onState(JSON.parse(JSON.stringify(snapshot())));
    meterStart();
  }

  win.__JUCE__ = {
    backend: {
      addEventListener: function (name, fn) {
        if (name === "__juce__complete") listeners.push(fn);
      },
      emitEvent: function (name, ev) {
        if (name !== "__juce__invoke" || !ev) return;
        var pid = ev.resultId;
        var pname = ev.name;
        var pm = ev.params || [];
        function done(z) { emitComplete(pid, (z !== undefined ? z : null)); }
        try {
          if (pname === "getCrashConsent") { done({ hasBeenAsked: true, consent: false, isBetaTester: false, pendingReports: 0 }); return; }
          if (pname === "setCrashConsent" || pname === "userActivity" || pname === "uiPointerTrace") { done(null); return; }
          if (pname === "openUrl") { done(null); return; }
          if (pname === "getState") { pushState(); done(null); return; }
          if (pname === "getLicenses" || pname === "refreshLicenses") {
            win.nativeBridge.onLicenseList(JSON.parse(JSON.stringify(seed.defaultLicenses)));
            pushState(); done(null); return;
          }
          if (pname === "selectLicense") {
            seed.licenseId = pm[0] != null ? Number(pm[0]) : seed.licenseId;
            seed.licenseStatus = seed.licenseId > 0 ? "valid" : "no_license";
            seed.defaultLicenses.selectedLicenseId = seed.licenseId;
            win.nativeBridge.onLicenseList(JSON.parse(JSON.stringify(seed.defaultLicenses)));
            pushState(); done(null); return;
          }
          if (pname === "getCalibrations") {
            win.nativeBridge.onCalibrationList(JSON.parse(JSON.stringify(seed.defaultRemoteCalibrations)));
            done(null); return;
          }
          if (pname === "getLocalCalibrations") {
            win.nativeBridge.onLocalCalibrationList({
              calibrations: seed.localCalsStored.slice(),
              currentConfig: seed.configLoaded ? (seed.configFileName || "") : "",
              currentConfigPath: seed.configLoaded ? (seed.configFilePath || "") : "",
              currentConfigName: seed.configLoaded
                ? (seed.configFileName || "").replace(/\.(npz|soup-recipe)$/i, "").replace(/_/g, " ")
                : ""
            });
            done(null); return;
          }
          if (pname === "logout") {
            seed.authState = "offline"; seed.authEmail = ""; seed.licenseStatus = ""; seed.licenseId = -1;
            pushState(); done(null); return;
          }
          if (pname === "login") { pushState(); done(null); return; }
          if (pname === "cancelAuth") {
            if (win.nativeBridge && win.nativeBridge.onAuthStateChanged) {
              win.nativeBridge.onAuthStateChanged({ state: "idle" });
            }
            done(null); return;
          }
          if (pname === "setVolume") { seed.volume = typeof pm[0] === "number" ? pm[0] : parseFloat(pm[0]); pushState(); done(null); return; }
          if (pname === "setBypass") { seed.bypass = !!pm[0]; pushState(); done(null); return; }
          if (pname === "setGainLimit") { seed.gainLimit = !!pm[0]; pushState(); done(null); return; }
          if (pname === "setAutoBypassRendering") { done(null); return; }
          if (pname === "setShowExtraChannels") { seed.showExtraChannels = !!pm[0]; pushState(); done(null); return; }
          if (pname === "setMeterFullscreen") { seed.meterFullscreen = !!pm[0]; pushState(); done(null); return; }
          if (pname === "setDim") { seed.dim = !!pm[0]; pushState(); done(null); return; }
          if (pname === "setDimAmount") { seed.dimAmountDb = typeof pm[0] === "number" ? pm[0] : parseFloat(pm[0]); pushState(); done(null); return; }
          if (pname === "setZoom") { seed.zoom = typeof pm[0] === "number" ? pm[0] : parseFloat(pm[0]); pushState(); done(null); return; }
          if (pname === "setUserEQState") { pushState(); done(null); return; }
          if (pname === "loadConfig" || pname === "launchWizard") { done(null); return; }
          if (pname === "unloadCalibration") {
            seed.configLoaded = false; seed.configFileName = ""; seed.configFilePath = "";
            applyMeterLayout714();
            pushState(); done(null); return;
          }
          if (pname === "selectCalibration") {
            /* selectDropdownItem (plugin.html) pre-emits an indeterminate "download"
               phase synchronously before calling native; if we don't override it the
               user sees a brief "Downloading…" banner. Synchronously swap to the
               generic "load" phase (banner reads "Loading calibration…"), then after
               a short beat clear with "idle" + push the loaded state. */
            var calId = pm[0] != null ? String(pm[0]) : "";
            var cname = pm[1] != null ? String(pm[1]) : "";
            if (calId && win.nativeBridge && win.nativeBridge.onCalibrationTransferProgress) {
              win.nativeBridge.onCalibrationTransferProgress({
                calibrationId: calId,
                phase: "load",
                indeterminate: true
              });
            }
            setTimeout(function () {
              if (cname) seed.configFileName = cname;
              seed.configLoaded = true;
              applyMeterLayoutForCalibrationId(calId);
              if (calId && win.nativeBridge && win.nativeBridge.onCalibrationTransferProgress) {
                win.nativeBridge.onCalibrationTransferProgress({
                  calibrationId: calId,
                  phase: "idle"
                });
              }
              pushState();
            }, 700);
            done(null); return;
          }
          done(null);
        } catch (err) { done(null); }
      }
    },
    initialisationData: { __juce__functions: NATIVE_NAMES }
  };

  /* ── Marketing-iframe-only UI tweaks ───────────────────────────────────────
   * Run after plugin's inline `<script>` has defined its top-level `var` globals
   * (which become `window` properties). DOMContentLoaded fires after the inline
   * script block at the end of <body> finishes parsing and executing. */
  var STYLE_ID = "__landing-preview-overrides__";
  function injectOverrideStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      /* 1. Header "Update available" pill — never show in marketing iframe. */
      "#header-update-pill { display: none !important; }\n" +
      /* 2. Calibration dropdown "+ Create new calibration..." entry. */
      ".config-dropdown-item.action-item { display: none !important; }\n" +
      /* 3. Settings: UI Zoom row when locked. */
      ".settings-row.landing-preview-zoom-locked { opacity: 0.55 !important; }\n" +
      ".settings-row.landing-preview-zoom-locked .zoom-select:disabled { opacity: 1; cursor: not-allowed !important; }\n" +
      /* 3b. Settings: Show extra channels in meter — locked in preview. */
      ".settings-row.landing-preview-extra-channels-locked { opacity: 0.55 !important; }\n" +
      ".settings-row.landing-preview-extra-channels-locked label.toggle { cursor: not-allowed !important; }\n" +
      /* 4. Settings logout button — visually disabled (logic also no-op'd below). */
      ".settings-logout { opacity: 0.5 !important; cursor: not-allowed !important; pointer-events: none !important; }\n";
    (document.head || document.documentElement).appendChild(style);
  }

  /* Keep only the "Dolby Atmos Music" factory target preset (`atmos_music`). */
  function filterEqListeningTargetsToAtmos() {
    var arr = win.USER_EQ_FACTORY_LISTENING_TARGETS;
    if (!Array.isArray(arr)) return;
    win.USER_EQ_FACTORY_LISTENING_TARGETS = arr.filter(function (t) {
      return t && String(t.key || "") === "atmos_music";
    });
  }

  /* Auto bypass: interactive toggle updates demo `seed` only — no `callNative` bridge
   * invoke and no Reaper/FL setup dialogs (`handleAutoBypassRenderingChange`). */
  function wirePreviewAutoBypassNoHost() {
    win.handleAutoBypassRenderingChange = function () {
      var el = document.getElementById("auto-bypass-rendering-toggle");
      if (!el) return;
      seed.autoBypassRendering = !!el.checked;
      pushState();
    };
  }

  /* UI zoom + extra meter channels: frozen in the marketing iframe (handlers no-op; controls disabled). */
  function lockZoomAndExtraChannelsForPreview() {
    win.handleZoomChange = function () { /* UI zoom locked in landing preview */ };

    var demExtra = !!seed.showExtraChannels;
    win.handleShowExtraChannelsChange = function () {
      var el = document.getElementById("show-extra-channels-toggle");
      if (el) el.checked = demExtra;
    };

    var xc = document.getElementById("show-extra-channels-toggle");
    if (xc) {
      xc.disabled = true;
      xc.checked = demExtra;
      var xcRow = xc.closest(".settings-row");
      if (xcRow) xcRow.classList.add("landing-preview-extra-channels-locked");
    }

    var zs = document.getElementById("zoom-select");
    if (zs) {
      zs.disabled = true;
      var zRow = zs.closest(".settings-row");
      if (zRow) zRow.classList.add("landing-preview-zoom-locked");
    }
  }

  /* Disable the logout button (and the openUrl/launchWizard side-effects can stay
   * harmlessly stubbed in the shim): there's no real auth state to leave. */
  function disableLogoutControl() {
    win.handleLogout = function () { /* logout disabled in landing-page preview */ };
    var btn = document.querySelector(".settings-logout");
    if (btn) {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("title", "Disabled in preview");
      btn.removeAttribute("onclick");
    }
  }

  /* Suppress installer-version check entirely (belt and suspenders — the seed
   * already omits appVersion so the check should never schedule, but a stray
   * pushState elsewhere could still wake it). */
  function suppressUpdatePillLogic() {
    try {
      win.showPluginUpdateAvailable = function () {};
      win.scheduleInstallerVersionCheckPlugin = function () {};
    } catch (e) { /* ignore */ }
  }

  function applyLandingPreviewOverrides() {
    injectOverrideStylesOnce();
    suppressUpdatePillLogic();
    filterEqListeningTargetsToAtmos();
    disableLogoutControl();
    wirePreviewAutoBypassNoHost();
    lockZoomAndExtraChannelsForPreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLandingPreviewOverrides);
  } else {
    applyLandingPreviewOverrides();
  }
  /* `load` runs after every inline script + resources — safety net in case the
   * EQ globals weren't yet assigned at DOMContentLoaded for some reason. */
  win.addEventListener("load", applyLandingPreviewOverrides);
})();
