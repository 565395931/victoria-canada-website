const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const FIELD_LIMITS = {
  name: 120,
  company: 160,
  email: 254,
  phone: 100,
  requestType: 160,
  details: 6000
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

function clean(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function normalizeSubmission(payload) {
  return Object.fromEntries(
    Object.entries(FIELD_LIMITS).map(([field, limit]) => [field, clean(payload[field], limit)])
  );
}

function validateSubmission(data) {
  if (!data.name || !data.company || !data.email || !data.details) {
    return "Please complete all required fields.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid business email.";
  }
  return "";
}

async function submitContactForm(request, env) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, message: "Unsupported request format." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 50000) {
    return json({ ok: false, message: "Request is too large." }, 413);
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ ok: false, message: "Request origin is not allowed." }, 403);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request data." }, 400);
  }

  const data = normalizeSubmission(payload);

  const validationError = validateSubmission(data);
  if (validationError) {
    return json({ ok: false, message: validationError }, 400);
  }

  const requestType = data.requestType || "General enquiry";
  const subject = `Website request: ${requestType} - ${data.company}`.slice(0, 240);
  const text = [
    "A new enquiry was submitted through the VICTORIA website.",
    "",
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone / messaging: ${data.phone || "Not provided"}`,
    `Request type: ${requestType}`,
    "",
    "Project details:",
    data.details
  ].join("\n");

  const html = `
    <h2>New VICTORIA website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Company:</strong> ${escapeHtml(data.company)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone / messaging:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
    <p><strong>Request type:</strong> ${escapeHtml(requestType)}</p>
    <h3>Project details</h3>
    <p>${escapeHtml(data.details).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const result = await env.EMAIL.send({
      to: "lyneshou79@gmail.com",
      from: { email: "website@victoria-gateway.com", name: "VICTORIA Website" },
      replyTo: { email: data.email, name: data.name },
      subject,
      text,
      html
    });
    console.log("Contact notification sent", result.messageId);
    return json({ ok: true, message: "Your request has been sent to VICTORIA." });
  } catch (error) {
    console.error("Contact notification failed", error?.code || "UNKNOWN", error?.message || error);
    return json({ ok: false, message: "We could not send your request right now. Please try again later." }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ ok: false, message: "Method not allowed." }, 405);
      }
      return submitContactForm(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
