const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/akbarrbni",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 0C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.977 6.98 1.281.058 1.689.072 4.948.072 3.257 0 3.664-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.257-.014-3.664-.073-4.947-.2-4.354-2.617-6.78-6.979-6.98C15.664.014 15.257 0 12 0zm0 5.838a6.162 6.162 0 1 1 0 12.324 6.162 6.162 0 0 1 0-12.324zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akbarrbni/",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/akbarrbni",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://behance.net/akbarrbni",
    icon: (
      <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M22 7h-7v1.5h7V7zm-11.2 5.1c.5-.6.8-1.4.8-2.4 0-2.5-1.7-3.9-4.7-3.9H0v15.3h7.3c3.5 0 5.3-1.7 5.3-4.3 0-1.9-.9-3.1-2.8-3.7zM3 9.1h3.3c1.3 0 2 .6 2 1.5s-.7 1.5-2 1.5H3V9.1zm3.7 10H3v-3.7h3.7c1.4 0 2.2.7 2.2 1.8 0 1.2-.8 1.9-2.2 1.9zM19.7 9.8c-2.7 0-4.7 1.8-4.7 4.9 0 3.2 2 4.9 4.8 4.9 2.3 0 3.9-1.2 4.4-3h-2.3c-.3.6-.9 1.1-2 1.1-1.4 0-2.1-.9-2.2-2.3h6.7c.1-.4.1-.8.1-1.3 0-2.9-1.8-4.3-4.8-4.3zm-2.3 3.6c.1-1.3.8-2.1 2.1-2.1 1.2 0 1.9.8 2 2.1h-4.1z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 py-8 border-t border-neutral-200 text-sm text-neutral-700 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
      <p>Muhammad Akbar Robbani — Bandung, Indonesia</p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        {/* Perbaikan 1: Atribut dimasukkan ke dalam tag <a> */}
        <a href="mailto:akbarrbni03@gmail.com" className="hover:text-neutral-900 transition-colors break-all sm:break-normal">
          akbarrbni03@gmail.com
        </a>

        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            /* Perbaikan 2: Atribut dimasukkan ke dalam tag <a> */
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-300 transition-colors flex items-center justify-center text-neutral-600 hover:text-neutral-900 shrink-0"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
