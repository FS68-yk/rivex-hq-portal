import { getStore } from "@netlify/blobs";

const STORE_NAME = "rivex-portal";
const LATEST_KEY = "questionnaires/jim-kok/latest";
const SUBMISSION_PREFIX = "questionnaires/jim-kok/submissions";
const RESPONDENT_ID = "jim-kok";
const RESPONDENT_NAME = "Jim Kok";
const MAX_ANSWER_SIZE = 240000;

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}

function questionnaireStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function clampNumber(value, min = 0, max = 9999) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(Math.max(Math.round(number), min), max);
}

function normalizeAnswers(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}

function buildSnapshot(payload) {
  const updatedAt = payload.updatedAt || new Date().toISOString();
  const submittedAt = payload.status === "submitted"
    ? (payload.submittedAt || updatedAt)
    : null;

  return {
    version: 1,
    respondentId: RESPONDENT_ID,
    respondentName: RESPONDENT_NAME,
    questionnaireId: "rivex-jim-alignment-form-v1",
    status: payload.status === "submitted" ? "submitted" : "draft",
    currentIndex: clampNumber(payload.currentIndex, 0, 32),
    answeredCount: clampNumber(payload.answeredCount, 0, 32),
    totalQuestions: clampNumber(payload.totalQuestions || 32, 1, 200),
    answers: normalizeAnswers(payload.answers),
    report: typeof payload.report === "string" ? payload.report.trim() : "",
    source: typeof payload.source === "string" ? payload.source.trim() : "",
    updatedAt,
    submittedAt
  };
}

export default async (request) => {
  if (request.method === "OPTIONS") {
    return json(204, {});
  }

  const store = questionnaireStore();

  if (request.method === "GET") {
    try {
      const snapshot = await store.get(LATEST_KEY, { type: "json", consistency: "strong" });
      return json(200, {
        ok: true,
        snapshot: snapshot || null
      });
    } catch (error) {
      return json(500, {
        ok: false,
        error: "Unable to read questionnaire state"
      });
    }
  }

  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json(400, { ok: false, error: "Invalid JSON payload" });
  }

  if (payload.respondentId && payload.respondentId !== RESPONDENT_ID) {
    return json(400, { ok: false, error: "Unsupported respondent" });
  }

  const snapshot = buildSnapshot(payload);
  const serializedAnswers = JSON.stringify(snapshot.answers);
  const serializedReport = snapshot.report || "";

  if (serializedAnswers.length > MAX_ANSWER_SIZE || serializedReport.length > MAX_ANSWER_SIZE) {
    return json(413, { ok: false, error: "Questionnaire payload is too large" });
  }

  try {
    await store.setJSON(LATEST_KEY, snapshot, {
      metadata: {
        status: snapshot.status,
        answeredCount: snapshot.answeredCount,
        updatedAt: snapshot.updatedAt,
        submittedAt: snapshot.submittedAt || ""
      }
    });

    if (snapshot.status === "submitted" && snapshot.submittedAt) {
      const submissionKey = `${SUBMISSION_PREFIX}/${snapshot.submittedAt.replaceAll(":", "-")}`;
      await store.setJSON(submissionKey, snapshot, {
        metadata: {
          status: snapshot.status,
          answeredCount: snapshot.answeredCount,
          submittedAt: snapshot.submittedAt
        }
      });
    }

    return json(200, {
      ok: true,
      snapshot
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: "Unable to save questionnaire state"
    });
  }
};
