import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Featured from "@/components/home/Featured";
import ProjectIndex from "@/components/home/ProjectIndex";
import StackLoop from "@/components/home/StackLoop";
import Path from "@/components/home/Path";
import OffDuty from "@/components/home/OffDuty";
import Contact from "@/components/home/Contact";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Hero locale={lang} dict={dict} />
      <Manifesto dict={dict} />
      <Featured locale={lang} dict={dict} />
      <ProjectIndex locale={lang} dict={dict} />
      <StackLoop label={dict.stack.label} />
      <Path locale={lang} dict={dict} />
      <OffDuty locale={lang} dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
