import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <article className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
        {t("title")}
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">{t("intro")}</p>
      <Section title={t("dataTitle")} body={t("dataBody")} />
      <Section title={t("basisTitle")} body={t("basisBody")} />
      <Section title={t("purposeTitle")} body={t("purposeBody")} />
      <Section title={t("retentionTitle")} body={t("retentionBody")} />
      <Section title={t("rightsTitle")} body={t("rightsBody")} />
    </article>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-8">
      <h2 className="font-semibold text-xl mb-2">{title}</h2>
      <p className="text-muted leading-relaxed">{body}</p>
    </section>
  );
}
