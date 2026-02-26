import { render, screen } from "@testing-library/react";
import { ProductSection } from "@/features/home/components/ProductSection";

const mockProducts = [
  { id: "1", name: "Product A", detail: "Detail A", imageUrl: "" },
  { id: "2", name: "Product B", detail: "Detail B", imageUrl: "" },
];

describe("ProductSection", () => {
  it("renders the PRODUCT title", () => {
    render(<ProductSection products={mockProducts} />);
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
  });

  it("renders all product cards", () => {
    render(<ProductSection products={mockProducts} />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("has the correct section id for scroll navigation", () => {
    const { container } = render(<ProductSection products={mockProducts} />);
    expect(container.querySelector("#products")).toBeInTheDocument();
  });
});
