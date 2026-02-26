import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/features/home/components/ProductCard";

const mockProduct = {
  id: "1",
  name: "Test Product",
  detail: "Test detail text",
  imageUrl: "",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product detail", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test detail text")).toBeInTheDocument();
  });

  it("renders as a horizontal card layout", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    // The card should have a flex row layout
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("flex");
  });
});
