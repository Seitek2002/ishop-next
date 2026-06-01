"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Cart from "@/client-pages/Cart";

export default function CartPage() {
  // The cart is driven entirely by client-only data (redux + localStorage), so
  // there is nothing meaningful to server-render. Gate on mount: server and the
  // first client render both produce null (matching), avoiding a hydration
  // mismatch; the real tree renders after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  );
}
