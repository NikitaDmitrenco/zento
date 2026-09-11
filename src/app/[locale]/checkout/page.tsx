import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { CheckoutForm } from "../../../components/checkout/checkout-form";
import { SectionHead } from "../../../components/ui/section-head";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: dict.checkout.title,
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className="container-x pt-10 sm:pt-14 pb-8 space-y-10">
      <SectionHead as="h1" index="—" title={dict.checkout.title} />

      <CheckoutForm locale={locale as Locale} dict={dict} />
    </main>
  );
}
