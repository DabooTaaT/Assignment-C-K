import { useState } from "react";
import { useTranslation } from "react-i18next";

const NAV_ITEMS = [
  { key: "home" as const, sectionId: "hero" },
  { key: "product" as const, sectionId: "products" },
  { key: "aboutUs" as const, sectionId: "services" },
  { key: "contactUs" as const, sectionId: "footer" },
];

export const Header = () => {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#4096ff] text-white px-5 py-4 flex justify-between items-center text-sm uppercase">
        <div>{t("nav.siteName")}</div>
        <button
          className="md:hidden text-xl cursor-pointer bg-transparent border-none text-white"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Nav bar */}
      <nav
        className={`bg-[#3e7ced] text-white px-5 py-2.5 text-xs uppercase ${
          menuOpen ? "block" : "hidden md:block"
        }`}
      >
        {NAV_ITEMS.map((item, i) => (
          <span key={item.sectionId}>
            <button
              onClick={() => scrollTo(item.sectionId)}
              className="bg-transparent border-none text-white cursor-pointer hover:underline"
            >
              {t(`nav.${item.key}`)}
            </button>
            {i < NAV_ITEMS.length - 1 && <span className="mx-2.5">|</span>}
          </span>
        ))}
      </nav>
    </header>
  );
};
