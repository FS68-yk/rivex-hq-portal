(function () {
  const pageConfigs = {
    "index.html": {
      title: "RIVEX 共建资料入口",
      fileBase: "rivex-cobuild-portal",
      description: "入口页的阅读路径、模块说明和专属讨论页入口。"
    },
    "rivex-group-operating-map.html": {
      title: "RIVEX Group 营运地图",
      fileBase: "rivex-group-operating-map",
      description: "集团营运地图、标准化、系统化、金融化和执行路径。"
    },
    "rivex-development-blueprint.html": {
      title: "RIVEX 合伙人落地协作蓝图",
      fileBase: "rivex-execution-blueprint",
      description: "蓝图、工作流、里程碑、角色与交付拆解。"
    },
    "rivex-department-task-system.html": {
      title: "RIVEX 线条里程碑任务系统",
      fileBase: "rivex-task-system",
      description: "按业务线、里程碑、依赖、人员和节奏整理的任务系统。"
    },
    "rivex-jim-kok-role.html": {
      title: "Jim 共建角色与合作方式确认",
      fileBase: "rivex-jim-role-confirmation",
      description: "面向 Jim 的角色、目标、合作方式和后续讨论内容。"
    }
  };

  const baseSkipSelectors = [
    ".rivex-export-inline",
    ".rivex-export-panel",
    ".rivex-video-background",
    "script",
    "style",
    "noscript",
    "button",
    "input",
    "textarea",
    "select",
    "option",
    "label",
    "svg",
    "canvas",
    "img",
    "video",
    "iframe",
    ".control-panel",
    ".department-filter-menu",
    ".top-actions",
    ".session-pill",
    ".brand-row",
    ".reader-path a",
    ".ghost-link",
    ".compact-action",
    ".portal-action",
    ".logout-action",
    ".logout-link",
    ".questionnaire-link",
    "[data-export-skip]"
  ];

  const inlineParentTags = new Set(["P", "LI", "SUMMARY", "A", "BUTTON", "LABEL", "H1", "H2", "H3", "H4", "H5", "H6"]);
  const currentPage = decodeURIComponent(window.location.pathname.split("/").pop() || "index.html");
  const config = pageConfigs[currentPage];

  if (!config) return;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function normalizeText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeFileBase() {
    return config.fileBase || currentPage.replace(/\.html$/i, "").replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  }

  function exportRoot() {
    return document.querySelector("main");
  }

  function sanitizeClone(root) {
    const selectors = baseSkipSelectors.join(", ");
    root.querySelectorAll(selectors).forEach((node) => node.remove());
    root.querySelectorAll("details").forEach((node) => {
      node.setAttribute("open", "");
    });
    root.querySelectorAll("[hidden]").forEach((node) => {
      node.removeAttribute("hidden");
    });
  }

  function extractText(node) {
    return normalizeText(node?.textContent || "");
  }

  function collectListItems(listNode) {
    return [...listNode.children]
      .filter((child) => child.tagName === "LI")
      .map((child) => extractText(child.cloneNode(true)))
      .filter(Boolean);
  }

  function collectTable(tableNode) {
    const rows = [...tableNode.querySelectorAll("tr")]
      .map((row) => [...row.children].map((cell) => extractText(cell)))
      .filter((row) => row.some(Boolean));

    if (!rows.length) return null;

    const [header, ...body] = rows;
    return { header, rows: body };
  }

  function collectBlocks(node, blocks) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) return;
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName;
    if (!tag) return;

    if (baseSkipSelectors.some((selector) => node.matches?.(selector))) {
      return;
    }

    if (/^H[1-6]$/.test(tag)) {
      const text = extractText(node);
      if (text) blocks.push({ type: "heading", level: Number(tag[1]), text });
      return;
    }

    if (tag === "P") {
      const text = extractText(node);
      if (text) blocks.push({ type: "paragraph", text });
      return;
    }

    if (tag === "UL" || tag === "OL") {
      const items = collectListItems(node);
      if (items.length) blocks.push({ type: "list", ordered: tag === "OL", items });
      return;
    }

    if (tag === "TABLE") {
      const table = collectTable(node);
      if (table) blocks.push({ type: "table", ...table });
      return;
    }

    if (tag === "DETAILS") {
      const summary = [...node.children].find((child) => child.tagName === "SUMMARY");
      const summaryText = extractText(summary);
      if (summaryText) blocks.push({ type: "heading", level: 4, text: summaryText });
      [...node.children].forEach((child) => {
        if (child.tagName !== "SUMMARY") collectBlocks(child, blocks);
      });
      return;
    }

    if (tag === "SUMMARY") return;

    if (["STRONG", "SPAN", "SMALL"].includes(tag) && !inlineParentTags.has(node.parentElement?.tagName || "")) {
      const text = extractText(node);
      if (text) blocks.push({ type: "paragraph", text });
      return;
    }

    [...node.children].forEach((child) => collectBlocks(child, blocks));
  }

  function compactBlocks(blocks) {
    const compacted = [];

    blocks.forEach((block) => {
      if (!block) return;

      if (block.type === "paragraph" && (!block.text || /^\W*$/.test(block.text))) return;
      if (block.type === "heading" && !block.text) return;
      if (block.type === "list" && !block.items?.length) return;
      if (block.type === "table" && !block.header?.length && !block.rows?.length) return;

      const previous = compacted[compacted.length - 1];
      if (previous && JSON.stringify(previous) === JSON.stringify(block)) return;

      compacted.push(block);
    });

    return compacted;
  }

  function buildBlocks() {
    const root = exportRoot();
    if (!root) return [];
    const clone = root.cloneNode(true);
    sanitizeClone(clone);
    const blocks = [];
    collectBlocks(clone, blocks);
    return compactBlocks(blocks);
  }

  function renderMarkdown(blocks) {
    const exportedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const lines = [
      `# ${config.title}`,
      "",
      `- Exported: ${exportedAt}`,
      `- Source: ${window.location.href}`,
      `- Purpose: ${config.description}`,
      ""
    ];

    blocks.forEach((block) => {
      if (block.type === "heading") {
        const level = Math.max(1, Math.min(6, block.level || 2));
        lines.push(`${"#".repeat(level)} ${block.text}`);
        lines.push("");
        return;
      }

      if (block.type === "paragraph") {
        lines.push(block.text);
        lines.push("");
        return;
      }

      if (block.type === "list") {
        block.items.forEach((item, index) => {
          const marker = block.ordered ? `${index + 1}.` : "-";
          lines.push(`${marker} ${item}`);
        });
        lines.push("");
        return;
      }

      if (block.type === "table") {
        const header = block.header?.length ? block.header : [];
        if (header.length) {
          lines.push(`| ${header.join(" | ")} |`);
          lines.push(`| ${header.map(() => "---").join(" | ")} |`);
        }
        block.rows.forEach((row) => {
          lines.push(`| ${row.join(" | ")} |`);
        });
        lines.push("");
      }
    });

    return normalizeText(lines.join("\n"));
  }

  function blocksToHtml(blocks) {
    return blocks.map((block) => {
      if (block.type === "heading") {
        const level = Math.max(1, Math.min(4, block.level || 2));
        return `<h${level}>${escapeHtml(block.text)}</h${level}>`;
      }

      if (block.type === "paragraph") {
        return `<p>${escapeHtml(block.text)}</p>`;
      }

      if (block.type === "list") {
        const tag = block.ordered ? "ol" : "ul";
        const items = block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        return `<${tag}>${items}</${tag}>`;
      }

      if (block.type === "table") {
        const header = block.header?.length
          ? `<thead><tr>${block.header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>`
          : "";
        const body = `<tbody>${(block.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
        return `<table>${header}${body}</table>`;
      }

      return "";
    }).join("\n");
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function setStatus(message, tone) {
    const status = document.getElementById("rivexExportStatus");
    if (!status) return;
    status.textContent = message;
    status.className = "rivex-export-status";
    if (tone) status.classList.add(`is-${tone}`);
  }

  function exportMarkdown() {
    const blocks = buildBlocks();
    if (!blocks.length) {
      setStatus("没有可导出的正文内容。", "error");
      return;
    }

    const markdown = renderMarkdown(blocks);
    const dateStamp = new Date().toISOString().slice(0, 10);
    downloadFile(markdown, `${safeFileBase()}-${dateStamp}.md`, "text/markdown;charset=utf-8");
    setStatus("Markdown 已下载，可直接给同事复用。", "success");
  }

  function openPrintPreview() {
    const blocks = buildBlocks();
    if (!blocks.length) {
      setStatus("没有可导出的正文内容。", "error");
      return;
    }

    const exportedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const printHtml = `
      <!doctype html>
      <html lang="zh-Hant">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(config.title)} - Export</title>
        <style>
          :root { color-scheme: light; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #eef2f7;
            color: #0f172a;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", Arial, sans-serif;
            line-height: 1.7;
          }
          .sheet {
            width: min(940px, calc(100% - 40px));
            margin: 24px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.14);
            padding: 48px 56px;
          }
          .meta {
            margin-bottom: 28px;
            padding-bottom: 18px;
            border-bottom: 1px solid #dbe3ef;
          }
          .meta span {
            display: block;
            color: #5b6678;
            font-size: 13px;
            margin-bottom: 6px;
          }
          h1, h2, h3, h4 {
            color: #0f172a;
            line-height: 1.25;
            margin-top: 26px;
            margin-bottom: 12px;
            break-after: avoid;
          }
          h1 { font-size: 34px; margin-top: 0; }
          h2 { font-size: 24px; }
          h3 { font-size: 19px; }
          h4 { font-size: 16px; }
          p, li, td, th {
            font-size: 14px;
            color: #1f2937;
          }
          ul, ol {
            margin: 0 0 16px 20px;
            padding: 0;
          }
          p { margin: 0 0 14px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 0 18px;
            table-layout: fixed;
          }
          th, td {
            border: 1px solid #dbe3ef;
            padding: 10px 12px;
            vertical-align: top;
            text-align: left;
          }
          th {
            background: #f8fafc;
            font-weight: 800;
          }
          .print-note {
            position: sticky;
            top: 0;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            padding: 14px 18px;
            background: rgba(15, 23, 42, 0.92);
            color: #f8fafc;
            font-size: 13px;
          }
          .print-note button {
            min-height: 38px;
            border: 0;
            border-radius: 8px;
            padding: 0 14px;
            background: linear-gradient(135deg, #e4b85c, #f4cc7a);
            color: #071017;
            font: inherit;
            font-weight: 900;
            cursor: pointer;
          }
          @media print {
            body { background: #ffffff; }
            .print-note { display: none; }
            .sheet {
              width: auto;
              margin: 0;
              box-shadow: none;
              border-radius: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-note">
          <span>这份打印版适合直接“另存为 PDF”发给同事复用。</span>
          <button type="button" onclick="window.print()">打印 / 保存 PDF</button>
        </div>
        <article class="sheet">
          <div class="meta">
            <h1>${escapeHtml(config.title)}</h1>
            <span><strong>Exported:</strong> ${escapeHtml(exportedAt)}</span>
            <span><strong>Source:</strong> ${escapeHtml(window.location.href)}</span>
            <span><strong>Purpose:</strong> ${escapeHtml(config.description)}</span>
          </div>
          ${blocksToHtml(blocks)}
        </article>
      </body>
      </html>
    `;

    const blob = new Blob([printHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const preview = window.open(url, "_blank", "noopener,noreferrer");
    if (!preview) {
      setStatus("打印预览被浏览器拦截了，请允许弹窗后重试。", "error");
      return;
    }

    setStatus("已打开打印版，可直接保存为 PDF。", "success");
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function createButton(label, action, iconPath) {
    const button = document.createElement("button");
    button.className = "rivex-export-button";
    button.type = "button";
    button.dataset.exportAction = action;
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${iconPath}
      </svg>
      <span>${label}</span>
    `;
    return button;
  }

  function findMountTarget() {
    return document.querySelector(".top-actions") || document.querySelector(".session-pill");
  }

  function mountInlineExport() {
    if (document.getElementById("rivexExportInline")) return;
    if (!exportRoot()) return;

    const mountTarget = findMountTarget();
    if (!mountTarget) return;

    const wrapper = document.createElement("div");
    wrapper.id = "rivexExportInline";
    wrapper.className = "rivex-export-inline";
    wrapper.setAttribute("data-export-skip", "true");
    wrapper.innerHTML = `
      <button class="rivex-export-trigger" id="rivexExportTrigger" type="button" aria-expanded="false" aria-controls="rivexExportPanel" title="下载当前页面资料">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3v12"></path>
          <path d="m7 10 5 5 5-5"></path>
          <path d="M5 21h14"></path>
        </svg>
        <span>导出</span>
      </button>
      <div class="rivex-export-panel" id="rivexExportPanel" aria-label="页面导出工具">
        <span class="rivex-export-panel-title">下载当前页</span>
        <p class="rivex-export-panel-copy">导出为同事可复用的 Markdown 或 PDF。</p>
        <div class="rivex-export-actions"></div>
        <div class="rivex-export-status" id="rivexExportStatus">只在需要时展开显示。</div>
      </div>
    `;

    const actionWrap = wrapper.querySelector(".rivex-export-actions");
    const mdButton = createButton("下载 MD", "markdown", '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path>');
    const pdfButton = createButton("保存 PDF", "pdf", '<path d="M6 9V2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path>');
    const trigger = wrapper.querySelector("#rivexExportTrigger");

    mdButton.addEventListener("click", exportMarkdown);
    pdfButton.addEventListener("click", openPrintPreview);

    actionWrap.append(mdButton, pdfButton);
    const logout = mountTarget.querySelector("[data-logout]");
    if (logout) {
      mountTarget.insertBefore(wrapper, logout);
    } else {
      mountTarget.appendChild(wrapper);
    }

    function closeMenu() {
      wrapper.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      const nextState = !wrapper.classList.contains("is-open");
      wrapper.classList.toggle("is-open", nextState);
      trigger.setAttribute("aria-expanded", String(nextState));
    }

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });

    wrapper.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  onReady(mountInlineExport);
})();
