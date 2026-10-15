import { createServerFn } from "@tanstack/react-start";

const PRICE_ID = "price_1UQmRnQOJmxJjHnm6BcXhHFp";
const UNLOCK_COOKIE = "ege_unlock";
const AMOUNT = 499;

function stripeKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

function cleanOrigin(input: unknown) {
  const raw =
    input && typeof input === "object" && "origin" in input ? String((input as { origin: unknown }).origin ?? "") : "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const path = url.pathname.replace(/\/$/, "");
    if (path && !/^\/hds-[a-z0-9]+-\d+-[a-z0-9]+$/i.test(path)) return url.origin;
    return `${url.origin}${path}`;
  } catch {
    return "";
  }
}

export const payReady = createServerFn({ method: "GET" }).handler(async () => {
  return { ready: Boolean(stripeKey()) };
});

export const readUnlock = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getCookie } = await import("@tanstack/react-start/server");
    return { ok: getCookie(UNLOCK_COOKIE) === "1" };
  } catch {
    return { ok: false as const };
  }
});

export const startCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ origin: cleanOrigin(input) }))
  .handler(async ({ data }) => {
    const key = stripeKey();
    if (!key) return { url: null as string | null, ready: false as const };
    const { getRequestUrl } = await import("@tanstack/react-start/server");
    const requestUrl = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
    const origin = data.origin || requestUrl.origin;
    const fields = new URLSearchParams();
    fields.set("mode", "payment");
    fields.set("line_items[0][price]", PRICE_ID);
    fields.set("line_items[0][quantity]", "1");
    fields.set("cancel_url", `${origin}/`);
    fields.set("managed_payments[enabled]", "false");
    fields.set("metadata[app]", "every-greek-ever");
    const success = encodeURIComponent(`${origin}/unlock?session_id={CHECKOUT_SESSION_ID}`).replaceAll(
      "%7BCHECKOUT_SESSION_ID%7D",
      "{CHECKOUT_SESSION_ID}",
    );
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `${fields.toString()}&success_url=${success}`,
    });
    const payload = (await res.json()) as { url?: string };
    if (!res.ok || !payload.url) return { url: null as string | null, ready: true as const };
    return { url: payload.url, ready: true as const };
  });

export const confirmCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const sessionId =
      input && typeof input === "object" && "sessionId" in input
        ? String((input as { sessionId: unknown }).sessionId ?? "")
        : "";
    return { sessionId };
  })
  .handler(async ({ data }) => {
    if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(data.sessionId)) return { ok: false as const };
    const key = stripeKey();
    if (!key) return { ok: false as const };
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${data.sessionId}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { ok: false as const };
    const session = (await res.json()) as {
      payment_status?: string;
      amount_total?: number;
      currency?: string;
      metadata?: { app?: string };
    };
    if (
      session.payment_status !== "paid" ||
      session.amount_total !== AMOUNT ||
      session.currency !== "usd" ||
      session.metadata?.app !== "every-greek-ever"
    ) {
      return { ok: false as const };
    }
    const { getRequestUrl, setCookie } = await import("@tanstack/react-start/server");
    const url = getRequestUrl({ xForwardedProto: true });
    setCookie(UNLOCK_COOKIE, "1", {
      path: "/",
      httpOnly: true,
      secure: url.protocol === "https:",
      sameSite: "lax",
      maxAge: 34560000,
    });
    return { ok: true as const };
  });
