"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

const TestimonySchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(150),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  text: z.string().trim().min(20).max(2000),
  consentRgpd: z.coerce.boolean().refine((v) => v === true),
  consentDisplay: z.coerce.boolean().optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type TestimonyState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const ipAttempts = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 3;

function rateLimit(ipHash: string): boolean {
  const now = Date.now();
  const entry = ipAttempts.get(ipHash);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipAttempts.set(ipHash, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "save-samy-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function submitTestimony(
  _prev: TestimonyState,
  formData: FormData,
): Promise<TestimonyState> {
  const t = await getTranslations("testimonials");
  const locale = (await getLocale()) as "fr" | "nl";

  const parsed = TestimonySchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    city: formData.get("city") ?? "",
    text: formData.get("text"),
    consentRgpd: formData.get("consentRgpd"),
    consentDisplay: formData.get("consentDisplay"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: t("errorGeneric") };
  }
  if (parsed.data.website) {
    // honeypot filled → silently accept, do not persist
    return { status: "success", message: t("success") };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const ipHash = hashIp(ip);

  if (!rateLimit(ipHash)) {
    return { status: "error", message: t("errorRateLimit") };
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return { status: "error", message: t("errorGeneric") };
  }

  const { error } = await supabase.from("testimonies").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    text: parsed.data.text,
    locale,
    consent_rgpd: parsed.data.consentRgpd,
    consent_display: parsed.data.consentDisplay ?? false,
    ip_hash: ipHash,
    user_agent: hdrs.get("user-agent")?.slice(0, 300) ?? null,
  });

  if (error) {
    return { status: "error", message: t("errorGeneric") };
  }

  return { status: "success", message: t("success") };
}

export type PublishedTestimony = {
  id: string;
  firstName: string;
  city: string | null;
  text: string;
  createdAt: string;
};

export async function getPublishedTestimonies(): Promise<PublishedTestimony[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return [];
  const { data } = await supabase
    .from("testimonies_public")
    .select("id, first_name, city, text, created_at")
    .order("created_at", { ascending: false })
    .limit(60);
  return (data ?? []).map((r) => ({
    id: r.id,
    firstName: r.first_name,
    city: r.city,
    text: r.text,
    createdAt: r.created_at,
  }));
}
