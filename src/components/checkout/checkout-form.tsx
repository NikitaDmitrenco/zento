"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Alert } from "../ui/alert";
import { EmptyState } from "../ui/empty-state";
import { Price, formatPrice } from "../ui/price";
import { demoProducts } from "../../db/data/demo-data";

interface StoredCartItem {
  id: string;
  quantity: number;
}

interface OrderItemPreview {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const tileBase = "text-left w-full border rounded-sm p-4 transition-colors duration-180 cursor-pointer";

export function CheckoutForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  // Payment method: "CASH_ON_DELIVERY" | "CARD"
  const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_DELIVERY" | "CARD">("CARD");

  // Bank card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isProcessing3DS, setIsProcessing3DS] = useState(false);

  const [cartItems, setCartItems] = useState<OrderItemPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("zento_cart");
      if (stored) {
        const raw: StoredCartItem[] = JSON.parse(stored);
        const mapped: OrderItemPreview[] = raw
          .map((item) => {
            const demo = demoProducts.find((p) => p.slug === item.id || item.id.includes(p.slug));
            if (!demo) return null;
            return {
              id: item.id,
              name: demo.name,
              price: demo.price,
              quantity: item.quantity,
            };
          })
          .filter((i): i is OrderItemPreview => i !== null);

        setCartItems(mapped);
      }
    } catch {
      // Empty
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedSubtotal = (subtotal / 100).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Card Type Detector
  const getCardType = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^220/.test(clean)) return "MIR";
    return "CARD";
  };

  // Card number input formatter (0000 0000 0000 0000)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Expiry date input formatter (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      const mm = parseInt(val.slice(0, 2), 10);
      if (mm > 12) val = "12" + val.slice(2);
      if (mm === 0) val = "01" + val.slice(2);
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setCardExpiry(val);
  };

  // CVC formatter (3-4 digits)
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvc(val);
  };

  // Cardholder name formatter (Latin letters and space)
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    setCardHolder(val);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^\d+\s()-]/g, "");
    if (val.includes("+")) {
      val = "+" + val.replace(/\+/g, "");
    }
    setCustomerPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Card validations if CARD is selected
    if (paymentMethod === "CARD") {
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 16) {
        setErrorMsg("Пожалуйста, введите корректный 16-значный номер банковской карты.");
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMsg("Пожалуйста, укажите срок действия карты в формате ММ/ГГ.");
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMsg("Пожалуйста, укажите 3-значный CVC/CVV код безопасности.");
        return;
      }
    }

    setLoading(true);
    setErrorMsg("");

    if (paymentMethod === "CARD") {
      setIsProcessing3DS(true);
      // Simulate authentic 3D-Secure bank gateway response
      await new Promise((resolve) => setTimeout(resolve, 1400));
    }

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          paymentMethod,
          items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsProcessing3DS(false);
        setErrorMsg(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      // Clear local storage cart
      localStorage.removeItem("zento_cart");

      // Redirect to success page
      router.push(`/${locale}/checkout/success?orderId=${data.orderId}&paymentMethod=${paymentMethod}`);
    } catch {
      setIsProcessing3DS(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        index="00"
        title={dict.cart.empty}
        action={
          <Button onClick={() => router.push(`/${locale}/catalog`)} variant="outline" size="md">
            {dict.cart.continueShopping}
            <span className="arrow" aria-hidden="true">→</span>
          </Button>
        }
      />
    );
  }

  const detectedCard = getCardType(cardNumber);
  const isCard = paymentMethod === "CARD";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start relative">

      {/* 3D-Secure Processing Overlay */}
      {isProcessing3DS && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4" role="status" aria-live="polite">
          <div className="bg-surface rounded-lg shadow-float p-8 max-w-sm w-full text-center space-y-5">
            <svg className="animate-spin h-6 w-6 mx-auto text-ink" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V1.5C6.2 1.5 1.5 6.2 1.5 12H4z" />
            </svg>
            <div className="space-y-1.5">
              <h4 className="text-h3 text-ink">3D-Secure 2.0</h4>
              <p className="text-small text-ink-2">{dict.checkout.orderProcessing}</p>
            </div>
            <div className="label flex justify-center items-center gap-3 pt-4 border-t border-line">
              <span>Verified by VISA</span>
              <span aria-hidden="true">•</span>
              <span>Mastercard ID Check</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="lg:col-span-8 space-y-10">

        {/* Contact Info Block */}
        <section className="border-t border-line pt-8 space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="label min-w-8">01</span>
            <h2 className="text-h3 text-ink">{dict.checkout.contactInfo}</h2>
          </div>

          {errorMsg && <Alert tone="error">{errorMsg}</Alert>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label={dict.checkout.fullName}
              type="text"
              required
              placeholder="Иван Иванов"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label={dict.checkout.email}
              type="email"
              required
              placeholder="customer@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label={dict.checkout.phone}
              type="tel"
              required
              placeholder="+373 60 123456"
              value={customerPhone}
              onChange={handlePhoneChange}
            />
            <Input
              label={dict.checkout.address}
              type="text"
              required
              placeholder="г. Кишинев, бул. Штефан чел Маре 1"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
        </section>

        {/* Payment Method Block */}
        <section className="border-t border-line pt-8 space-y-6">
          <div className="flex items-baseline gap-4">
            <span className="label min-w-8">02</span>
            <h2 className="text-h3 text-ink">{dict.checkout.paymentMethod}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label={dict.checkout.paymentMethod}>
            {/* Card Online Option */}
            <button
              type="button"
              role="radio"
              aria-checked={isCard}
              onClick={() => setPaymentMethod("CARD")}
              className={`${tileBase} ${isCard ? "border-ink bg-surface" : "border-line bg-transparent hover:border-ink-3"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-[7px] w-1.5 h-1.5 shrink-0 ${isCard ? "bg-signal" : "border border-ink-3"}`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-[15px] font-medium text-ink">{dict.checkout.cardOnline}</span>
                  <span className="block text-small text-ink-3 mt-0.5">{dict.checkout.cardOnlineDesc}</span>
                </div>
                <svg className="w-5 h-5 shrink-0 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
                  <path strokeLinecap="round" d="M2.5 10h19M6 14.5h4" />
                </svg>
              </div>
            </button>

            {/* Cash on Delivery Option */}
            <button
              type="button"
              role="radio"
              aria-checked={!isCard}
              onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
              className={`${tileBase} ${!isCard ? "border-ink bg-surface" : "border-line bg-transparent hover:border-ink-3"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-[7px] w-1.5 h-1.5 shrink-0 ${!isCard ? "bg-signal" : "border border-ink-3"}`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-[15px] font-medium text-ink">{dict.checkout.cashOnDelivery}</span>
                  <span className="block text-small text-ink-3 mt-0.5">{dict.checkout.cashOnDeliveryDesc}</span>
                </div>
                <svg className="w-5 h-5 shrink-0 text-ink-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2.5" y="6.5" width="19" height="11" rx="1.5" />
                  <circle cx="12" cy="12" r="2.5" />
                  <path strokeLinecap="round" d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
            </button>
          </div>

          {/* Interactive Card Form when CARD is selected */}
          {paymentMethod === "CARD" && (
            <div className="pt-6 border-t border-line grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 items-start">

              {/* Virtual Credit Card Display */}
              <div className="md:col-span-5">
                <div className="max-w-xs w-full aspect-[1.586] p-5 rounded-md bg-ink text-ink-inverse flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="w-2 h-2 bg-signal" aria-hidden="true" />
                    <span className="label text-ink-inverse/70">{detectedCard}</span>
                  </div>

                  <div className="data text-base sm:text-lg tracking-[0.12em] whitespace-nowrap">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex justify-between items-end gap-4">
                    <div className="min-w-0">
                      <span className="label block text-ink-inverse/50">CARDHOLDER</span>
                      <span className="data block mt-1 text-[12px] uppercase tracking-[0.06em] truncate">
                        {cardHolder || "CARDHOLDER NAME"}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="label block text-ink-inverse/50">EXPIRES</span>
                      <span className="data block mt-1 text-[12px] tracking-[0.06em]">
                        {cardExpiry || "MM/YY"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="md:col-span-7 space-y-5">
                <Input
                  label={dict.checkout.cardNumber}
                  type="text"
                  required={paymentMethod === "CARD"}
                  placeholder="4111 2222 3333 4444"
                  className="data"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <Input
                    label={dict.checkout.cardExpiry}
                    type="text"
                    required={paymentMethod === "CARD"}
                    placeholder="MM/YY"
                    className="data"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                  />
                  <Input
                    label={dict.checkout.cardCvc}
                    type="password"
                    maxLength={4}
                    required={paymentMethod === "CARD"}
                    placeholder="•••"
                    className="data"
                    value={cardCvc}
                    onChange={handleCvcChange}
                  />
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      label={dict.checkout.cardHolder}
                      type="text"
                      placeholder="CARDHOLDER NAME"
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                    />
                  </div>
                </div>

                <p className="label flex items-start gap-2 pt-1">
                  <svg className="w-3.5 h-3.5 shrink-0 mt-px text-ok" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="1.5" />
                    <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  <span>{dict.checkout.cardSecureNotice}</span>
                </p>
              </div>
            </div>
          )}

        </section>
      </div>

      {/* Summary Sidebar */}
      <Card tone="surface" className="lg:col-span-4 lg:sticky lg:top-24 p-6">
        <h3 className="label text-ink-2">
          Состав заказа ({cartItems.length})
        </h3>

        <ul className="mt-4 border-t border-line-strong divide-y divide-line max-h-60 overflow-y-auto">
          {cartItems.map((item) => (
            <li key={item.id} className="py-3 flex justify-between items-start gap-4">
              <div className="min-w-0">
                <span className="block text-small font-medium text-ink truncate">{item.name}</span>
                <span className="data block text-[12px] text-ink-3 mt-0.5">
                  {item.quantity} × {formatPrice(item.price, locale)} {dict.common.currency}
                </span>
              </div>
              <Price
                amount={item.price * item.quantity}
                currency={dict.common.currency}
                locale={locale}
                size="sm"
                className="shrink-0"
              />
            </li>
          ))}
        </ul>

        <dl className="mt-4 pt-4 border-t border-line space-y-3">
          <div className="flex justify-between items-center gap-4">
            <dt className="text-small text-ink-2">{dict.checkout.paymentMethod}</dt>
            <dd className="text-small font-medium text-ink text-right">
              {paymentMethod === "CARD" ? "Онлайн картой" : "При получении"}
            </dd>
          </div>
          <div className="flex justify-between items-baseline gap-4 pt-1">
            <dt className="text-[15px] font-medium text-ink">{dict.cart.total}</dt>
            <dd>
              <Price amount={subtotal} currency={dict.common.currency} locale={locale} size="lg" />
            </dd>
          </div>
        </dl>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full mt-6"
        >
          {paymentMethod === "CARD"
            ? `${dict.checkout.payAmount} ${formattedSubtotal} ${dict.common.currency}`
            : dict.checkout.placeOrder}
          <span className="arrow" aria-hidden="true">→</span>
        </Button>
      </Card>

    </form>
  );
}
