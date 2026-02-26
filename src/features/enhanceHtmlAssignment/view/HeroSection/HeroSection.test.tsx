import { render } from "@testing-library/react";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders the hero section with image placeholder", () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
