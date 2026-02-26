// src/features/home/components/HeroSection.test.tsx
import { render } from "@testing-library/react";
import { HeroSection } from "@/features/home/components/HeroSection";

describe("HeroSection", () => {
  it("renders with the correct section id", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("#hero")).toBeInTheDocument();
  });

  it("renders the placeholder image icon", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
