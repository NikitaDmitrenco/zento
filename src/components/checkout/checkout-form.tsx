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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      // Clear local storage cart
      localStorage.removeItem("zento_cart");

      // Redirect to success page
      router.push(`/${locale}/checkout/success?orderId=${data.orderId}`);
    } catch {
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

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
          {dict.checkout.contactInfo}
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

        <Input
          label={dict.checkout.phone}
          type="tel"
          required
          placeholder="+373 60 123456"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />

        <Input
          label={dict.checkout.address}
          type="text"
          required
          placeholder="г. Кишинев, ул. Штефан чел Маре, д. 1"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <span>🛡️</span> {dict.product.securePayment}
          </div>
          <p>
            Оплата осуществляется наличными или картой при получении заказа. Комиссия 0%.
          </p>
        </div>
      </div>

      {/* Summary Sidebar */}
      <Card className="p-6 space-y-6">
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

        <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900">{dict.cart.total}</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formattedSubtotal} <span className="text-xs font-medium text-slate-500">{dict.common.currency}</span>
          </span>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          size="lg"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 text-sm"
        >
          {dict.checkout.placeOrder} →
        </Button>
      </Card>

    </form>
  );
}
