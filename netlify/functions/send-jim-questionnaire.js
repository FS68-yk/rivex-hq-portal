const DEFAULT_RECIPIENT = "yik@moce.io";
const MAX_REPORT_LENGTH = 160000;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(payload)
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function allowedRecipients() {
  const configured = process.env.REPORT_TO_EMAILS || DEFAULT_RECIPIENT;
  return configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { ok: false, error: "Invalid JSON payload" });
  }

  const report = String(payload.report || "").trim();
  const recipient = String(payload.recipient || DEFAULT_RECIPIENT).trim().toLowerCase();
  const recipients = allowedRecipients();

  if (!report) {
    return json(400, { ok: false, error: "Missing report content" });
  }

  if (report.length > MAX_REPORT_LENGTH) {
    return json(413, { ok: false, error: "Report is too large to email safely" });
  }

  if (!recipients.includes(recipient)) {
    return json(403, { ok: false, error: "Recipient is not allowed" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "RIVEX <onboarding@resend.dev>";

  if (!resendApiKey) {
    return json(500, {
      ok: false,
      error: "Missing RESEND_API_KEY environment variable"
    });
  }

  const submittedAt = payload.submittedAt || new Date().toISOString();
  const subject = `RIVEX / Jim Strategic Alignment Form - ${submittedAt.slice(0, 10)}`;
  const source = payload.source ? `\n\nSource page: ${payload.source}` : "";
  const text = `${report}${source}`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.55;">
      <h2>RIVEX / Jim Strategic Alignment Form</h2>
      <p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>
      ${payload.source ? `<p><strong>Source page:</strong> ${escapeHtml(payload.source)}</p>` : ""}
      <pre style="white-space: pre-wrap; background: #f6f7f9; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">${escapeHtml(report)}</pre>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject,
        text,
        html
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json(response.status, {
        ok: false,
        error: result.message || result.error || "Resend email request failed"
      });
    }

    return json(200, {
      ok: true,
      id: result.id || null,
      recipient
    });
  } catch (error) {
    return json(502, {
      ok: false,
      error: "Unable to reach email provider"
    });
  }
};
