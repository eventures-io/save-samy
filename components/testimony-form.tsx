"use client";

import { useActionState, useId, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { submitTestimony, type TestimonyState } from "@/lib/testimony/actions";

const initial: TestimonyState = { status: "idle" };

export function TestimonyForm() {
  const t = useTranslations("testimonials");
  const [state, formAction] = useActionState(submitTestimony, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="firstName"
          label={t("firstName")}
          required
          uid={uid}
          autoComplete="given-name"
        />
        <Field
          name="lastName"
          label={t("lastName")}
          required
          uid={uid}
          autoComplete="family-name"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="email"
          label={t("email")}
          required
          type="email"
          uid={uid}
          autoComplete="email"
        />
        <Field
          name="city"
          label={t("city")}
          uid={uid}
          autoComplete="address-level2"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-text`} className="text-sm font-medium block mb-1">
          {t("text")} <span className="text-accent">*</span>
        </label>
        <textarea
          id={`${uid}-text`}
          name="text"
          rows={6}
          required
          minLength={20}
          maxLength={2000}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <p className="mt-1 text-xs text-muted">{t("textHelp")}</p>
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          name="consentRgpd"
          type="checkbox"
          required
          value="true"
          className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent/40"
        />
        <span>{t("consentRgpd")}</span>
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input
          name="consentDisplay"
          type="checkbox"
          value="true"
          className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent/40"
        />
        <span>{t("consentDisplay")}</span>
      </label>

      <SubmitButton />

      {state.status === "success" && (
        <p
          role="status"
          className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
        >
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  uid,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  uid: string;
  autoComplete?: string;
}) {
  const id = `${uid}-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium block mb-1">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </div>
  );
}

function SubmitButton() {
  const t = useTranslations("testimonials");
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 h-12 rounded-full bg-accent text-white font-medium shadow-sm hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}
