"use client";

import { useActionState, useId, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { signPetition, type SignState } from "@/lib/petition/actions";
import { usePetitionCount } from "./petition-count-context";
import { TurnstileWidget } from "./turnstile-widget";

const initial: SignState = { status: "idle" };

export function PetitionForm() {
  const t = useTranslations("petition");
  const [state, formAction] = useActionState(signPetition, initial);
  const { increment } = usePetitionCount();
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      increment();
    }
  }, [state.status, increment]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Field
          name="firstName"
          label={t("firstName")}
          placeholder={t("firstNamePlaceholder")}
          required
          uid={uid}
          autoComplete="given-name"
        />
        <Field
          name="lastName"
          label={t("lastName")}
          placeholder={t("lastNamePlaceholder")}
          required
          uid={uid}
          autoComplete="family-name"
        />
      </div>
      <Field
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        required
        type="email"
        uid={uid}
        autoComplete="email"
      />
      <Field
        name="city"
        label={t("city")}
        placeholder={t("cityPlaceholder")}
        optionalLabel={t("optionalLabel")}
        uid={uid}
        autoComplete="address-level2"
      />
      <div>
        <Label
          htmlFor={`${uid}-comment`}
          label={t("comment")}
          optionalLabel={t("optionalLabel")}
        />
        <textarea
          id={`${uid}-comment`}
          name="comment"
          rows={4}
          maxLength={1000}
          placeholder={t("commentPlaceholder")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
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

      <TurnstileWidget />

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

function Label({
  htmlFor,
  label,
  required = false,
  optionalLabel,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-widest block mb-2"
    >
      {label}
      {required && <span className="text-accent"> *</span>}
      {!required && optionalLabel && (
        <span className="font-normal normal-case text-muted">
          {" "}
          ({optionalLabel})
        </span>
      )}
    </label>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  uid,
  autoComplete,
  optionalLabel,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  uid: string;
  autoComplete?: string;
  optionalLabel?: string;
}) {
  const id = `${uid}-${name}`;
  return (
    <div>
      <Label
        htmlFor={id}
        label={label}
        required={required}
        optionalLabel={optionalLabel}
      />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
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
      className="mt-2 h-14 rounded-full bg-accent text-white font-semibold uppercase tracking-wide shadow-sm hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}
