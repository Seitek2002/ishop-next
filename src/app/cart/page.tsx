"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Cart from "@/pages/Cart";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  );
}
