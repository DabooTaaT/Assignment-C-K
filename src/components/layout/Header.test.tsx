import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("renders the site name", () => {
    render(<Header />);
    expect(screen.getByText("NAME PAGE")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Header />);
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
    expect(screen.getByText("ABOUT US")).toBeInTheDocument();
    expect(screen.getByText("CONTACT US")).toBeInTheDocument();
  });

  it("renders the hamburger menu icon", () => {
    render(<Header />);
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });
});
