import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "header.logo": "BrandName",
        "header.nav.home": "Home",
        "header.nav.product": "Product",
        "header.nav.aboutUs": "About Us",
        "header.nav.contactUs": "Contact Us",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("Header", () => {
  it("renders the logo", () => {
    render(<Header />);
    expect(screen.getByText("BrandName")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Header />);
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);
    const nav = screen.getAllByRole("navigation");
    expect(nav.length).toBeGreaterThan(0);
  });
});
