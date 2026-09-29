import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
  { href: "/gallery", label: "Gallery" },
  { href: "/store", label: "Store" },
  { href: "/franchise", label: "Franchise" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-nav/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl tracking-wide text-white">
          Cardinal <span className="text-accent">Wash</span> Studio
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/book"
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
