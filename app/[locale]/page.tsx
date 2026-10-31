import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { StorySection } from "@/components/story-section";
import { WhySection } from "@/components/why-section";
import { PetitionSection } from "@/components/petition-section";
import { ShareSection } from "@/components/share-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StorySection />
      <WhySection />
      <PetitionSection />
      <ShareSection />
    </>
  );
}
