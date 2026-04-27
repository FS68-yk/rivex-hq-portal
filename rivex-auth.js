(function () {
  const AUTH_KEY = "rivex-portal-auth-v1";
  const SHARED_ASSET_VERSION = "20260427b";
  const EXPORT_PAGES = new Set([
    "index.html",
    "rivex-group-operating-map.html",
    "rivex-development-blueprint.html",
    "rivex-department-task-system.html",
    "rivex-jim-kok-role.html",
    "rivex-admin-dashboard.html"
  ]);
  const INVITES = {
    MOCE86: {
      role: "standard",
      label: "MOCE 普通访问"
    },
    "JIM-MOCE": {
      role: "jim",
      label: "Jim 专属访问"
    },
    ADMIN86: {
      role: "admin",
      label: "Admin 后台访问"
    }
  };

  function normalizeCode(code) {
    return String(code || "").trim().toUpperCase();
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !["standard", "jim", "admin"].includes(session.role)) return null;
      return session;
    } catch (error) {
      return null;
    }
  }

  function writeSession(session) {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      return false;
    }
  }

  function signIn(code) {
    const invite = INVITES[normalizeCode(code)];
    if (!invite) return null;

    const session = {
      ...invite,
      issuedAt: new Date().toISOString()
    };

    return writeSession(session) ? session : null;
  }

  function clearSession() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      // The static preview should keep working even if storage is unavailable.
    }
  }

  function currentFileName() {
    const last = window.location.pathname.split("/").pop() || "index.html";
    return decodeURIComponent(last) || "index.html";
  }

  function loginUrl(reason) {
    const params = new URLSearchParams();
    params.set("return", window.location.href);
    if (reason) params.set("reason", reason);
    return `login.html?${params.toString()}`;
  }

  function requireRole(requiredRole) {
    if (currentFileName() === "login.html") return true;

    const session = readSession();
    if (!session) {
      window.location.replace(loginUrl("login_required"));
      return false;
    }

    if (requiredRole === "jim" && !["jim", "admin"].includes(session.role)) {
      window.location.replace("index.html?access=standard");
      return false;
    }

    if (requiredRole === "admin" && session.role !== "admin") {
      window.location.replace("index.html?access=standard");
      return false;
    }

    return true;
  }

  function hasJimAccess() {
    return ["jim", "admin"].includes(readSession()?.role);
  }

  function hasAdminAccess() {
    return readSession()?.role === "admin";
  }

  function injectVideoBackground() {
    if (!document.getElementById("rivex-video-background-css")) {
      const link = document.createElement("link");
      link.id = "rivex-video-background-css";
      link.rel = "stylesheet";
      link.href = `rivex-video-background.css?v=${SHARED_ASSET_VERSION}`;
      document.head.appendChild(link);
    }

    if (!document.body) return;

    document.body.classList.add("has-rivex-video-bg");

    if (document.getElementById("rivexVideoBackground")) return;

    const layer = document.createElement("div");
    layer.id = "rivexVideoBackground";
    layer.className = "rivex-video-background";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <video class="rivex-bg-video" autoplay muted loop playsinline preload="auto">
        <source src="assets/background.mp4?v=${SHARED_ASSET_VERSION}" type="video/mp4">
      </video>
      <div class="rivex-bg-mask"></div>
    `;

    document.body.prepend(layer);

    const video = layer.querySelector("video");
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
    }
    const playAttempt = video?.play?.();
    if (playAttempt?.catch) playAttempt.catch(() => {});

    window.addEventListener("load", () => {
      if (video && video.paused) {
        const retry = video.play();
        if (retry?.catch) retry.catch(() => {});
      }
    }, { once: true });
  }

  function injectExportTools() {
    if (!EXPORT_PAGES.has(currentFileName())) return;

    if (!document.getElementById("rivex-export-css")) {
      const styleLink = document.createElement("link");
      styleLink.id = "rivex-export-css";
      styleLink.rel = "stylesheet";
      styleLink.href = `rivex-export.css?v=${SHARED_ASSET_VERSION}`;
      document.head.appendChild(styleLink);
    }

    if (!document.getElementById("rivex-export-script")) {
      const script = document.createElement("script");
      script.id = "rivex-export-script";
      script.src = `rivex-export.js?v=${SHARED_ASSET_VERSION}`;
      document.head.appendChild(script);
    }
  }

  function applyRoleView() {
    const session = readSession();
    const role = session?.role || "guest";
    document.documentElement.dataset.authRole = role;
    if (document.body) document.body.dataset.authRole = role;

    document.querySelectorAll("[data-auth-label]").forEach((node) => {
      node.textContent = session?.label || "未登录";
    });

    if (!["jim", "admin"].includes(role)) {
      document.querySelectorAll("[data-jim-only], .jim-highlight").forEach((node) => {
        node.remove();
      });
    }

    if (role !== "admin") {
      document.querySelectorAll("[data-admin-only]").forEach((node) => {
        node.remove();
      });
    }
  }

  function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        clearSession();
        window.location.href = "login.html?logout=1";
      }, true);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectVideoBackground();
    applyRoleView();
    bindLogout();
    injectExportTools();
  });

  window.RivexAuth = {
    signIn,
    getSession: readSession,
    clearSession,
    requireRole,
    hasJimAccess,
    hasAdminAccess,
    isAuthenticated: () => Boolean(readSession())
  };
})();
