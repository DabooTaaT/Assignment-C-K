import { useState } from "react";

const NAV_ITEMS = [
  { label: "HOME", sectionId: "hero" },
  { label: "PRODUCT", sectionId: "products" },
  { label: "ABOUT US", sectionId: "services" },
  { label: "CONTACT US", sectionId: "footer" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header>
      {/* Top bar */}
      <div className="bg-[#4096ff] text-white px-5 py-4 flex justify-between items-center text-sm uppercase">
        <div>NAME PAGE</div>
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
              {item.label}
            </button>
            {i < NAV_ITEMS.length - 1 && <span className="mx-2.5">|</span>}
          </span>
        ))}
      </nav>
    </header>
  );
};
