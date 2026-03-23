addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // Simple session auth check
  const sessionToken = request.headers.get("Authorization");
  const isAuthenticated = sessionToken && sessionToken.startsWith("Bearer ");
  if (!isAuthenticated) {
    return jsonResponse({ error: "unauthorized", ok: false }, 401);
  }

  try {
    if (request.method === "POST") {
      const payload = await request.json();

      switch (pathname) {
        case "/reviews/submit":
          return submitReview(payload);
        case "/payments/checkout":
          return createCheckout(payload);
        case "/forms/843/generate":
          return generate843(payload);
        case "/landing-page/create":
          return generateLandingUrl(payload);
        case "/landing-page/onboarding":
          return submitOnboarding(payload);
        case "/support/ticket":
          return submitSupport(payload);
        case "/support/status":
          return checkSupportStatus(payload);
        case "/forms/843/submit":
          return submitTaxpayer843(payload);
        default:
          return jsonResponse({ error: "not_found", ok: false }, 404);
      }
    } else if (request.method === "GET") {
      if (pathname === "/reviews") {
        const eventId = searchParams.get("eventId");
        const proId = searchParams.get("proId");
        if (!eventId || !proId) {
          return jsonResponse({ error: "validation_failed", ok: false }, 400);
        }
        return getReviews({ eventId, proId });
      }
      return jsonResponse({ error: "not_found", ok: false }, 404);
    } else {
      return jsonResponse({ error: "method_not_allowed", ok: false }, 405);
    }
  } catch (err) {
    return jsonResponse(
      { error: "server_error", message: err.message, ok: false },
      500
    );
  }
}

// -------------------- Reviews --------------------

function submitReview(payload) {
  if (!payload.eventId || !payload.reviewerName || !payload.rating || !payload.comments) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "submitted"
  });
}

function getReviews(payload) {
  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "retrieved"
  });
}

// -------------------- Payments --------------------

async function createCheckout(payload) {
  const { eventId, proId, amount, currency, paymentMethod } = payload;

  if (!eventId || !proId) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  const paymentLinks = {
    "pro_123": "https://buy.stripe.com/test_abc123",
    "pro_456": "https://buy.stripe.com/test_def456"
  };

  const checkoutUrl = paymentLinks[proId];

  if (!checkoutUrl) {
    return jsonResponse({ error: "no_payment_link_found", ok: false }, 404);
  }

  return jsonResponse({
    eventId,
    ok: true,
    status: "checkout_created",
    checkoutUrl
  });
}

// -------------------- Form 843 --------------------

function generate843(payload) {
  if (!payload.eventId || !payload.taxpayerId || !payload.penalties || !payload.interest) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "generated"
  });
}

function submitTaxpayer843(payload) {
  if (
    !payload.eventId ||
    !payload.taxpayerId ||
    !payload.penalties ||
    !payload.interest ||
    !payload.filingData
  ) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "submitted"
  });
}

// -------------------- Landing Page --------------------

function submitOnboarding(payload) {
  if (
    !payload.eventId ||
    !payload.proId ||
    !payload.logo ||
    !payload.companyName ||
    !payload.welcomeMessage
  ) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "submitted"
  });
}

function generateLandingUrl(payload) {
  const {
    eventId,
    proId,
    branding,
    welcomeMessage,
    logo,
    companyName
  } = payload;

  if (!eventId || !proId || !branding || !welcomeMessage) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  const id = crypto.randomUUID();

  const params = new URLSearchParams({
    eventId,
    proId,
    branding,
    welcomeMessage,
    logo: logo || "",
    companyName: companyName || ""
  });

  const landingPageUrl =
    `https://taxclaim.virtuallaunch.pro/landing.html?id=${id}&${params.toString()}`;

  return jsonResponse({
    eventId,
    ok: true,
    status: "url_generated",
    landingPageUrl
  });
}

// -------------------- Support --------------------

function submitSupport(payload) {
  if (!payload.eventId || !payload.clientId || !payload.issueDescription) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "submitted"
  });
}

function checkSupportStatus(payload) {
  if (!payload.eventId || !payload.clientReferenceNumber) {
    return jsonResponse({ error: "validation_failed", ok: false }, 400);
  }

  return jsonResponse({
    eventId: payload.eventId,
    ok: true,
    status: "checked"
  });
}

// -------------------- Helper --------------------

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}