import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-nav">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-xl text-white">
              Cardinal <span className="text-accent">Wash</span> Studio
            </p>
            <p className="mt-2 max-w-xs text-sm text-faint">
              Modern detailing studio for drivers who expect showroom results,
              every time.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Explore
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-faint">
              <Link href="/services" className="hover:text-white">Services & Add-Ons</Link>
              <Link href="/gallery" className="hover:text-white">Car Gallery</Link>
              <Link href="/store" className="hover:text-white">Store</Link>
              <Link href="/franchise" className="hover:text-white">Franchise Us</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Visit Us
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-faint">
              <span>Taguig City, Metro Manila</span>
              <span>Open daily · 8:00 AM – 8:00 PM</span>
              <span>hello@cardinalwash.studio</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-faint md:flex-row">
          <span>© {new Date().getFullYear()} Cardinal Wash Studio. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-white">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
