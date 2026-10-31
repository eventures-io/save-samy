import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <article className="mx-auto max-w-2xl px-4 sm:px-6 py-16 prose-samy">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
        {t("title")}
      </h1>
      <Section title={t("editor")} body={t("editorBody")} />
      <Section title={t("hosting")} body={t("hostingBody")} />
      <Section title={t("contact")} body={t("contactBody")} />
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
