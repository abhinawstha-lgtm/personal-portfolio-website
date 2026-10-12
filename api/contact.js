const ALLOWED_ORIGINS = new Set([
  "https://www.abhinavshrestha15.com.np",
  "https://abhinavshrestha15.com.np",
  "https://personal-portfolio-website-45f1.vercel.app",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const LIMITS = {
  fullName: 120,
  email: 254,
  businessName: 160,
  website: 500,
  businessDescription: 3000,
  challenge: 3000,
  service: 120,
  message: 5000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status = 200, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function clean(value, limit) {
  return String(value ?? "").trim().replace(/\u0000/g, "").slice(0, limit);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function row(label, value) {
  if (!value) return "";
  return `<tr><th style="padding:10px 14px;text-align:left;vertical-align:top;border-bottom:1px solid #dbe5f2;color:#0b1f3a;width:190px">${label}</th><td style="padding:10px 14px;border-bottom:1px solid #dbe5f2;color:#243b5a;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`;
}

function textLine(label, value) {
  return value ? `${label}:\n${value}\n` : "";
}

export const config = {
  maxDuration: 15,
};

export default {
  async fetch(request) {
    const origin = request.headers.get("origin") || "";

    if (request.method === "OPTIONS") {
      if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        },
      });
    }

    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json({ error: "Please submit the website form." }, 415, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "The form data could not be read." }, 400, origin);
    }

    if (clean(body.websiteCheck, 200)) {
      return json({ success: true, id: "accepted" }, 200, origin);
    }

    const data = Object.fromEntries(
      Object.entries(LIMITS).map(([key, limit]) => [key, clean(body[key], limit)]),
    );

    if (!data.fullName || !EMAIL_PATTERN.test(data.email)) {
      return json({ error: "Please enter your name and a valid email address." }, 400, origin);
    }
    if (data.businessDescription.length < 10 || data.challenge.length < 20) {
      return json({ error: "Please add a little more detail about your business and marketing challenge." }, 400, origin);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL || "abhinawstha@gmail.com";
    const from = process.env.CONTACT_FROM_EMAIL || "Abhinav Shrestha Website <onboarding@resend.dev>";
    if (!apiKey) {
      console.error("Contact form configuration is incomplete: RESEND_API_KEY is missing.");
      return json({ error: "Email delivery is temporarily unavailable. Please email directly instead." }, 503, origin);
    }

    const submissionId = /^[a-zA-Z0-9_-]{8,80}$/.test(String(body.submissionId || ""))
      ? String(body.submissionId)
      : crypto.randomUUID();
    const safeName = data.fullName.replace(/[\r\n]/g, " ");
    const subject = `New consultation request from ${safeName}`.slice(0, 180);
    const html = `<!doctype html><html lang="en"><head><title>New consultation request</title></head><body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif"><div style="max-width:700px;margin:24px auto;background:#fff;border:1px solid #dbe5f2;border-radius:14px;overflow:hidden"><div style="background:#0b1f3a;color:#fff;padding:22px 26px"><h1 style="font-size:22px;margin:0">New consultation request</h1></div><table role="presentation" style="width:100%;border-collapse:collapse">${row("Name", data.fullName)}${row("Email", data.email)}${row("Business", data.businessName)}${row("Website", data.website)}${row("What the business does", data.businessDescription)}${row("Marketing challenge", data.challenge)}${row("Interested service", data.service)}${row("Message", data.message)}</table><p style="margin:20px 26px;color:#52677f;font-size:13px">Reply to this email to contact the sender directly.</p></div></body></html>`;
    const text = [
      "New consultation request",
      "",
      textLine("Name", data.fullName),
      textLine("Email", data.email),
      textLine("Business", data.businessName),
      textLine("Website", data.website),
      textLine("What the business does", data.businessDescription),
      textLine("Marketing challenge", data.challenge),
      textLine("Interested service", data.service),
      textLine("Message", data.message),
    ].join("\n").trim();

    let resendResponse;
    try {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `contact-${submissionId}`,
        },
        body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, html, text }),
        signal: AbortSignal.timeout(12000),
      });
    } catch (error) {
      console.error("Resend request failed:", error?.name || "unknown_error");
      return json({ error: "The message could not be sent right now. Please try again or email directly." }, 502, origin);
    }

    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok || !result.id) {
      console.error("Resend rejected contact email:", resendResponse.status, result?.name || result?.message || "unknown_error");
      return json({ error: "The message could not be delivered. Please try again or email directly." }, 502, origin);
    }

    return json({ success: true, id: result.id }, 200, origin);
  },
};
