import { useState } from "react";
import { useTranslation } from "react-i18next";

const navKeys = ["home", "product", "aboutUs", "contactUs"] as const;

export const Header = () => {
  const { t } = useTranslation("enhanceHtml");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-xl font-extrabold uppercase tracking-wide bg-gradient-to-br from-blue-600 to-violet-500 bg-clip-text text-transparent">
          {t("header.logo")}
        </span>

        <button
          className="md:hidden text-slate-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav className="hidden md:flex gap-8">
          {navKeys.map((key) => (
            <a
              key={key}
              href="#"
              className="text-slate-500 text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
            >
              {t(`header.nav.${key}`)}
            </a>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 px-6 pb-4">
          {navKeys.map((key) => (
            <a
              key={key}
              href="#"
              className="block py-2 text-slate-500 text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors"
            >
              {t(`header.nav.${key}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
