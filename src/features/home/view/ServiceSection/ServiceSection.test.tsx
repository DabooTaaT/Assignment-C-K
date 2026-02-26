// src/features/home/components/ServiceSection.test.tsx
import { render, screen } from "@testing-library/react";
import { ServiceSection } from "@/features/home/view/ServiceSection";

const mockServices = [
  { id: "1", name: "Service A", detail: "Detail A", imageUrl: "" },
  { id: "2", name: "Service B", detail: "Detail B", imageUrl: "" },
];

describe("ServiceSection", () => {
  it("renders the SERVICE title", () => {
    render(<ServiceSection services={mockServices} />);
    expect(screen.getByText("SERVICE")).toBeInTheDocument();
  });

  it("renders all service cards", () => {
    render(<ServiceSection services={mockServices} />);
    expect(screen.getByText("Service A")).toBeInTheDocument();
    expect(screen.getByText("Service B")).toBeInTheDocument();
  });

  it("has the correct section id for scroll navigation", () => {
    const { container } = render(<ServiceSection services={mockServices} />);
    expect(container.querySelector("#services")).toBeInTheDocument();
  });

  it("has the light blue background", () => {
    const { container } = render(<ServiceSection services={mockServices} />);
    const section = container.querySelector("#services");
    expect(section).toHaveClass("bg-[#dbeafe]");
  });
});
