"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useCart from "@/hooks/use-cart";

export default function CartButton() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted ? cart.items.length : 0;

  return (
    <Link href="/panier" className="relative flex items-center justify-center w-11 h-11 bg-[#111111] text-white rounded-full hover:bg-blue-600 transition-all shadow-lg active:scale-95 group">
      <span className="text-[18px]">🛒</span>
      {isMounted && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
          {cartCount}
        </span>
      )}
    </Link>
  );
}