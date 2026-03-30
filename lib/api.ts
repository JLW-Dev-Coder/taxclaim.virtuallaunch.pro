const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.virtuallaunch.pro';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface Session {
  account_id: string;
  email: string;
  name?: string;
  pro_id?: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    return await apiFetch<Session>('/v1/auth/session');
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await apiFetch<void>('/v1/auth/logout', { method: 'POST' });
}

// ── Tax Pro ───────────────────────────────────────────────────────────────────

export interface TaxPro {
  pro_id: string;
  account_id: string;
  slug: string;
  firm_name: string;
  display_name?: string;
  welcome_message?: string;
  logo_url?: string;
  subscription_status?: string;
  submission_count?: number;
}

export async function getProBySlug(slug: string): Promise<TaxPro | null> {
  try {
    return await apiFetch<TaxPro>(`/v1/tcvlp/pro/by-slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getPro(pro_id: string): Promise<TaxPro | null> {
  try {
    return await apiFetch<TaxPro>(`/v1/tcvlp/pro/${encodeURIComponent(pro_id)}`);
  } catch {
    return null;
  }
}

// ── Mailing Address ───────────────────────────────────────────────────────────

export interface MailingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  full?: string;
}

export async function getMailingAddress(state: string): Promise<MailingAddress> {
  return apiFetch<MailingAddress>(`/v1/tcvlp/mailing-address?state=${encodeURIComponent(state)}`);
}

// ── Transcript ────────────────────────────────────────────────────────────────

export interface TranscriptTransaction {
  date: string;
  code: string;
  amount: number;
  description: string;
}

export interface TranscriptResult {
  total_penalty_amount: number;
  tax_years: number[];
  transactions: TranscriptTransaction[];
}

export async function uploadTranscript(formData: FormData): Promise<TranscriptResult> {
  const res = await fetch(`${API_BASE}/v1/tcvlp/transcript/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Upload failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<TranscriptResult>;
}

// ── Form 843 ──────────────────────────────────────────────────────────────────

export interface Form843Data {
  pro_id: string;
  full_name: string;
  email?: string;
  state: string;
  tax_year: number;
  penalty_type: string;
  penalty_amount: number;
  mailing_address: MailingAddress;
}

export interface Form843Result {
  submission_id: string;
  fields: Record<string, string>;
  kwong_citation: string;
  claim_basis: string;
  mailing_address: MailingAddress;
  deadline_notice: string;
}

export async function generateForm843(data: Form843Data): Promise<Form843Result> {
  return apiFetch<Form843Result>('/v1/tcvlp/forms/843/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitForm843(submission_id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/v1/tcvlp/forms/843/submit', {
    method: 'POST',
    body: JSON.stringify({ submission_id }),
  });
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export interface CheckoutSession {
  session_url: string;
}

export async function createCheckout(
  account_id: string,
  platform: string = 'tcvlp'
): Promise<CheckoutSession> {
  return apiFetch<CheckoutSession>('/v1/checkout/sessions', {
    method: 'POST',
    body: JSON.stringify({ account_id, platform }),
  });
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export interface OnboardingData {
  firm_name: string;
  display_name?: string;
  welcome_message?: string;
  slug?: string;
}

export async function tcvlpOnboarding(data: OnboardingData): Promise<TaxPro> {
  return apiFetch<TaxPro>('/v1/tcvlp/onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Support ───────────────────────────────────────────────────────────────────

export interface SupportTicket {
  ticket_id: string;
  subject: string;
  status: string;
  created_at: string;
}

export async function getTicketsByAccount(account_id: string): Promise<SupportTicket[]> {
  return apiFetch<SupportTicket[]>(`/v1/support/tickets/by-account/${encodeURIComponent(account_id)}`);
}
