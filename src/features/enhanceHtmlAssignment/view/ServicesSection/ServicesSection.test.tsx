import { render, screen } from "@testing-library/react";
import { ServicesSection } from "./ServicesSection";
import type { Service } from "../../interface";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "services.sectionTitle": "Our Services",
        "services.learnMore": "Learn More",
      };
      return map[key] ?? key;
    },
  }),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

const services: Service[] = [
  { id: "1", title: "Consulting", description: "Expert advice." },
  { id: "2", title: "Development", description: "Custom solutions." },
];

describe("ServicesSection", () => {
  it("renders section title", () => {
    render(<ServicesSection services={services} />);
    expect(screen.getByText("Our Services")).toBeInTheDocument();
  });

  it("renders all service cards with Learn More buttons", () => {
    render(<ServicesSection services={services} />);
    expect(screen.getByText("Consulting")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    const buttons = screen.getAllByText("Learn More");
    expect(buttons).toHaveLength(2);
  });
});
