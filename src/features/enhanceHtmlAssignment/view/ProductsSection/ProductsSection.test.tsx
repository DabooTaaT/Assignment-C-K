import { render, screen } from "@testing-library/react";
import { ProductsSection } from "./ProductsSection";
import type { Product } from "../../interface";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "products.sectionTitle": "Featured Products",
      };
      return map[key] ?? key;
    },
  }),
}));

const products: Product[] = [
  { id: "1", title: "Widget A", description: "Desc A" },
  { id: "2", title: "Widget B", description: "Desc B" },
];

describe("ProductsSection", () => {
  it("renders section title", () => {
    render(<ProductsSection products={products} />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
  });

  it("renders all product cards", () => {
    render(<ProductsSection products={products} />);
    expect(screen.getByText("Widget A")).toBeInTheDocument();
    expect(screen.getByText("Widget B")).toBeInTheDocument();
    expect(screen.getByText("Desc A")).toBeInTheDocument();
    expect(screen.getByText("Desc B")).toBeInTheDocument();
  });

  it("renders no product cards when products is empty", () => {
    const { container } = render(<ProductsSection products={[]} />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-testid='product-card']")).toHaveLength(0);
  });
});
