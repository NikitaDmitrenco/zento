"use client";

import { useState } from "react";
import { Dictionary } from "../../i18n/get-dictionary";
import { Button } from "../ui/button";

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
    <div className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white p-1">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold text-slate-900">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= stock || isOutOfStock}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
          >
            +
          </button>
        </div>

        <span className="text-xs text-slate-500">
          {stock > 0 ? `${dict.common.inStock}: ${stock}` : dict.common.outOfStock}
        </span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        size="lg"
        className={`w-full text-sm font-semibold py-3.5 ${
          added
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}
      >
        {added ? "✓ Добавлено в корзину" : dict.common.addToCart}
      </Button>
    </div>
  );
}
