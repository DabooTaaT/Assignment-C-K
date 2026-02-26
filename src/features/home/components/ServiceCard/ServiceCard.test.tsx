import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/features/home/components/ServiceCard";

const mockService = {
  id: "1",
  name: "Test Service",
  detail: "Test service detail",
  imageUrl: "",
};

describe("ServiceCard", () => {
  it("renders service name", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Test Service")).toBeInTheDocument();
  });

  it("renders service detail", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Test service detail")).toBeInTheDocument();
  });

  it("renders the MORE button", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });
});
