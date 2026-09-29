"use client";

import { useMemo, useState, FormEvent } from "react";
import type { Product } from "@/lib/db/schema";

export default function StoreCart({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const items = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, qty]) => {
          const product = products.find((p) => p.id === productId)!;
          return { product, qty };
        }),
    [cart, products]
  );

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  function updateQty(productId: string, delta: number) {
    setCart((prev) => {
      const next = Math.max(0, (prev[productId] ?? 0) + delta);
      return { ...prev, [productId]: next };
    });
  }

  async function handleCheckout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: form.get("customerName"),
      phone: form.get("phone"),
      email: form.get("email"),
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      setCart({});
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-success/30 bg-success-tint p-8 text-center">
        <h3 className="font-display text-2xl text-white">Order Placed!</h3>
        <p className="mt-2 text-muted">
          We&rsquo;ll reach out to confirm pickup or delivery and payment details.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-md border border-border px-5 py-2 text-sm font-medium text-white hover:border-white"
        >
          Shop Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="flex flex-col rounded-xl border border-border bg-panel p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-faint">
              {p.category}
            </span>
            <h3 className="mt-1 font-medium text-white">{p.name}</h3>
            <p className="mt-2 font-display text-xl text-accent">
              ₱{p.price.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-faint">
              {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : "Out of stock"}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQty(p.id, -1)}
                className="h-8 w-8 rounded-md border border-border text-white hover:border-white"
              >
                −
              </button>
              <span className="w-6 text-center text-white">{cart[p.id] ?? 0}</span>
              <button
                type="button"
                onClick={() => updateQty(p.id, 1)}
                disabled={p.stockQuantity <= 0}
                className="h-8 w-8 rounded-md border border-border text-white hover:border-white disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleCheckout}
        className="h-fit space-y-4 rounded-xl border border-border bg-panel p-6"
      >
        <h3 className="font-display text-xl text-white">Your Order</h3>
        {items.length === 0 ? (
          <p className="text-sm text-faint">Your cart is empty.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-muted">
                <span>
                  {i.product.name} × {i.qty}
                </span>
                <span>₱{(i.product.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-white">
              <span>Total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <input
          name="customerName"
          placeholder="Full Name"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-2.5 text-white outline-none focus:border-accent"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-2.5 text-white outline-none focus:border-accent"
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="w-full rounded-md border border-border bg-panel-2 px-4 py-2.5 text-white outline-none focus:border-accent"
        />

        {status === "error" && (
          <p className="rounded-md border border-danger/30 bg-danger-tint px-3 py-2 text-xs text-danger">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={items.length === 0 || status === "submitting"}
          className="w-full rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent/90 disabled:opacity-40"
        >
          {status === "submitting" ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
