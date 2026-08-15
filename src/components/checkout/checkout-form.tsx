"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4 my-8">
        <h2 className="text-xl font-bold text-slate-900">{dict.cart.empty}</h2>
        <Button onClick={() => router.push(`/${locale}/catalog`)} size="md">
          {dict.cart.continueShopping}
        </Button>
      </div>
    );
  }

  const detectedCard = getCardType(cardNumber);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
      
      {/* 3D-Secure Processing Overlay */}
      {isProcessing3DS && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 mx-auto bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 animate-pulse">
              <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">3D-Secure 2.0</h4>
              <p className="text-xs text-slate-500">{dict.checkout.orderProcessing}</p>
            </div>
            <div className="flex justify-center items-center gap-3 pt-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              <span>Verified by VISA</span>
              <span>•</span>
              <span>Mastercard ID Check</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
        
        {/* Contact Info Block */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            1. {dict.checkout.contactInfo}
          </h2>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={dict.checkout.fullName}
              type="text"
              required
              placeholder="Никита Дмитренко"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              label={dict.checkout.email}
              type="email"
              required
              placeholder="nikita@zento.tech"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* Payment Method Block */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            2. {dict.checkout.paymentMethod}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card Online Option */}
            <div
              onClick={() => setPaymentMethod("CARD")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "CARD"
                  ? "border-blue-600 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "CARD" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}>
                    {paymentMethod === "CARD" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {dict.checkout.cardOnline}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {dict.checkout.cardOnlineDesc}
                    </span>
                  </div>
                </div>
                <span className="text-xl">💳</span>
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div
              onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "CASH_ON_DELIVERY"
                  ? "border-blue-600 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "CASH_ON_DELIVERY" ? "border-blue-600 bg-blue-600" : "border-slate-300"
                  }`}>
                    {paymentMethod === "CASH_ON_DELIVERY" && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      {dict.checkout.cashOnDelivery}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {dict.checkout.cashOnDeliveryDesc}
                    </span>
                  </div>
                </div>
                <span className="text-xl">💵</span>
              </div>
            </div>
          </div>

          {/* Interactive Card Form when CARD is selected */}
          {paymentMethod === "CARD" && (
            <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-2xl space-y-6">
              
              {/* Virtual Credit Card Display */}
              <div className="max-w-xs mx-auto p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-white shadow-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-9 h-7 rounded-md bg-amber-400/80 flex items-center justify-center border border-amber-300/40">
                    <div className="w-6 h-4 border border-slate-800/40 rounded-xs" />
                  </div>
                  <span className="text-xs font-black tracking-widest text-slate-300">
                    {detectedCard}
                  </span>
                </div>
                
                <div className="font-mono text-base sm:text-lg tracking-widest py-1">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                <div className="flex justify-between items-end text-[10px] uppercase font-mono text-slate-400">
                  <div>
                    <span className="block text-[8px] text-slate-500">CARDHOLDER</span>
                    <span className="font-semibold text-white tracking-wide truncate max-w-[130px] block">
                      {cardHolder || "NIKITA DMITRENCO"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500">EXPIRES</span>
                    <span className="font-semibold text-white">
                      {cardExpiry || "MM/YY"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="space-y-4">
                <Input
                  label={dict.checkout.cardNumber}
                  type="text"
                  required={paymentMethod === "CARD"}
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label={dict.checkout.cardExpiry}
                    type="text"
                    required={paymentMethod === "CARD"}
                    placeholder="08/28"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                  />
                  <Input
                    label={dict.checkout.cardCvc}
                    type="password"
                    maxLength={4}
                    required={paymentMethod === "CARD"}
                    placeholder="•••"
                    value={cardCvc}
                    onChange={handleCvcChange}
                  />
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      label={dict.checkout.cardHolder}
                      type="text"
                      placeholder="NIKITA DMITRENCO"
                      value={cardHolder}
                      onChange={handleCardHolderChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <span className="text-emerald-600 font-bold">🔒</span>
                <span>{dict.checkout.cardSecureNotice}</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Summary Sidebar */}
      <Card className="p-6 space-y-6 lg:sticky lg:top-24">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Состав заказа ({cartItems.length})
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
          {cartItems.map((item) => (
            <div key={item.id} className="pt-2 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-900 block">{item.name}</span>
                <span className="text-slate-500">{item.quantity} × {((item.price) / 100).toLocaleString(locale)} {dict.common.currency}</span>
              </div>
              <span className="font-bold text-slate-900">
                {((item.price * item.quantity) / 100).toLocaleString(locale)} {dict.common.currency}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>{dict.checkout.paymentMethod}</span>
            <span className="font-semibold text-slate-800">
              {paymentMethod === "CARD" ? "💳 Онлайн картой" : "💵 При получении"}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-slate-900">{dict.cart.total}</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formattedSubtotal} <span className="text-xs font-medium text-slate-500">{dict.common.currency}</span>
            </span>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 text-sm shadow-md"
        >
          {paymentMethod === "CARD"
            ? `${dict.checkout.payAmount} ${formattedSubtotal} ${dict.common.currency} →`
            : `${dict.checkout.placeOrder} →`}
        </Button>
      </Card>

    </form>
  );
}
