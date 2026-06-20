// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// "About" dan "Contact" sekarang halaman terpisah (route), "Projects" tetap anchor di homepage
const NAV_LINKS = [
  { href: "#projects", label: "Projects", type: "hash" as const },
  { href: "/about", label: "About", type: "route" as const },
  { href: "/contact", label: "Contact", type: "route" as const },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();

  // Deteksi section mana yang sedang aktif di viewport (hanya relevan di homepage)
  useEffect(() => {
    if (pathname !== "/") return;

    const hashLinks = NAV_LINKS.filter((link) => link.type === "hash" && link.href.startsWith("#"));
    const sections = hashLinks.map((link) => document.querySelector(link.href)).filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (link: (typeof NAV_LINKS)[number]) => {
    if (link.type === "route") return pathname === link.href;
    return pathname === "/" && activeSection === link.href;
  };

  return (
    <nav className="relative w-full flex justify-between items-center py-6 px-8 md:px-16 bg-white text-neutral-900 z-50">
      <Link href="/" className="text-xl font-medium tracking-wide" onClick={() => setIsOpen(false)}>
        Akbarrbni
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-900">
        {NAV_LINKS.map((link) => {
          const isActive = isLinkActive(link);
          return (
            <Link key={link.href} href={link.href} className="group relative font-medium hover:text-black transition-colors py-1">
              {link.label}
              <span className={`absolute left-0 -bottom-0.5 h-[1.5px] w-full bg-neutral-900 transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </Link>
          );
        })}
      </div>

      {/* Hamburger button (mobile only) */}
      <button onClick={() => setIsOpen((prev) => !prev)} aria-label="Toggle menu" aria-expanded={isOpen} className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-[6px] z-50">
        <motion.span className="block w-6 h-[2px] bg-neutral-900 origin-center" animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} />
        <motion.span className="block w-6 h-[2px] bg-neutral-900" animate={isOpen ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.2, ease: "easeInOut" }} />
        <motion.span className="block w-6 h-[2px] bg-neutral-900 origin-center" animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} />
      </button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 top-0 md:hidden bg-white flex flex-col justify-center items-center gap-8 z-40"
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = isLinkActive(link);
              return (
                <motion.div
                  key={link.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: isOpen ? 0.15 + i * 0.08 : 0,
                    ease: "easeOut",
                  }}
                >
                  <Link href={link.href} onClick={() => setIsOpen(false)} className="relative text-3xl font-medium tracking-wide hover:text-black transition-colors">
                    {link.label}
                    <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-neutral-900 transition-transform duration-300 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
