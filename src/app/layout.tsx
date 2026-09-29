import type { Metadata } from "next";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";

// Fonts are self-hosted via @fontsource rather than next/font/google: this
// sandbox's network allowlist covers npm but not fonts.googleapis.com, and
// self-hosting also avoids a runtime dependency on Google's CDN in
// production. The font-family names below ("Bebas Neue", "Inter") come
// straight from those packages' @font-face rules.

export const metadata: Metadata = {
  title: {
    default: "Cardinal Wash Studio",
    template: "%s | Cardinal Wash Studio",
  },
  description:
    "Modern detailing studio for drivers who expect showroom results, every time. Car wash, PPF, ceramic and graphene coating in Taguig City.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
