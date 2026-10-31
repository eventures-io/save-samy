"use client";

import { useActionState, useId, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { signPetition, type SignState } from "@/lib/petition/actions";

const initial: SignState = { status: "idle" };

export function PetitionForm() {
  const t = useTranslations("petition");
  const [state, formAction] = useActionState(signPetition, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field name="firstName" label={t("firstName")} required uid={uid} autoComplete="given-name" />
      <Field name="lastName" label={t("lastName")} required uid={uid} autoComplete="family-name" />
      <Field name="email" label={t("email")} required type="email" uid={uid} autoComplete="email" />
      <Field name="city" label={t("city")} uid={uid} autoComplete="address-level2" />
      <div>
        <label htmlFor={`${uid}-comment`} className="text-sm font-medium block mb-1">
          {t("comment")}
        </label>
        <textarea
          id={`${uid}-comment`}
          name="comment"
          rows={3}
          maxLength={1000}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="text-sm text-muted leading-relaxed">{t("consentNote")}</p>

      <SubmitButton />

      {state.status === "success" && (
        <p role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
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
  const t = useTranslations("petition");
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
