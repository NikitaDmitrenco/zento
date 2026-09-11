"use client";

import { useState } from "react";
import { Dictionary } from "../../i18n/get-dictionary";
import { Button } from "../ui/button";

const stepper =
  "w-11 h-full inline-flex items-center justify-center text-ink-2 hover:text-ink hover:bg-paper-2 " +
  "disabled:opacity-30 disabled:hover:bg-transparent transition-colors duration-180 cursor-pointer text-lg leading-none";

export function ProductActions({
  productId,
  stock,
  dict,
}: {
  productId: string;
  stock: number;
  dict: Dictionary;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = stock <= 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Add item to localStorage cart state
    try {
      const stored = localStorage.getItem("zento_cart");
      const cartItems: { id: string; quantity: number }[] = stored ? JSON.parse(stored) : [];

      const existingIdx = cartItems.findIndex((item) => item.id === productId);
      if (existingIdx >= 0) {
        cartItems[existingIdx].quantity = Math.min(
          stock,
          cartItems[existingIdx].quantity + quantity
        );
      } else {
        cartItems.push({ id: productId, quantity });
      }

      localStorage.setItem("zento_cart", JSON.stringify(cartItems));
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      {/* Quantity stepper */}
      <div className="inline-flex items-stretch h-13 border border-line rounded-sm bg-surface divide-x divide-line self-start">
        <button onClick={handleDecrease} disabled={quantity <= 1 || isOutOfStock} className={stepper} aria-label="−">
          −
        </button>
        <span className="data w-14 inline-flex items-center justify-center text-[15px] font-medium text-ink" aria-live="polite">
          {String(quantity).padStart(2, "0")}
        </span>
        <button onClick={handleIncrease} disabled={quantity >= stock || isOutOfStock} className={stepper} aria-label="+">
          +
        </button>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        size="lg"
        className={`flex-1 ${added ? "bg-ok hover:bg-ok" : ""}`}
      >
        {added ? "✓ Добавлено в корзину" : dict.common.addToCart}
        {!added && <span className="arrow" aria-hidden="true">→</span>}
      </Button>
    </div>
  );
}
