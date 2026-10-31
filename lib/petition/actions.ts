"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

const SignSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(150),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
  // honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SignState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const ipAttempts = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

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

export async function signPetition(
  _prev: SignState,
  formData: FormData,
): Promise<SignState> {
  const t = await getTranslations("petition");
  const locale = (await getLocale()) as "fr" | "nl";

  const parsed = SignSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    city: formData.get("city") ?? "",
    comment: formData.get("comment") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: t("errorGeneric") };
  }
  if (parsed.data.website) {
    // honeypot filled → silently accept but don't persist
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

  const { error } = await supabase.from("signatures").insert({
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    email: parsed.data.email,
    city: parsed.data.city || null,
    comment: parsed.data.comment || null,
    consent_rgpd: true,
    consent_display: true,
    locale,
    ip_hash: ipHash,
    user_agent: hdrs.get("user-agent")?.slice(0, 300) ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: t("errorDuplicate") };
    }
    return { status: "error", message: t("errorGeneric") };
  }

  return { status: "success", message: t("success") };
}

export type PetitionStats = {
  count: number;
  recent: { firstName: string; city: string | null; createdAt: string }[];
};

export async function getPetitionStats(): Promise<PetitionStats> {
  const supabase = getSupabaseServer();
  if (!supabase) return { count: 0, recent: [] };

  const [{ data: countData }, { data: recentData }] = await Promise.all([
    supabase.rpc("signatures_count"),
    supabase
      .from("signatures_public")
      .select("first_name, city, created_at")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    count: typeof countData === "number" ? countData : 0,
    recent: (recentData ?? []).map((r) => ({
      firstName: r.first_name,
      city: r.city,
      createdAt: r.created_at,
    })),
  };
}
