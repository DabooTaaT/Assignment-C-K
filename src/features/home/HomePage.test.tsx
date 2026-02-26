import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { HomePage } from "@/features/home/HomePage";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";

const mockData = {
  products: [
    { id: "1", name: "Product A", detail: "Detail A", imageUrl: "" },
  ],
  services: [
    { id: "1", name: "Service A", detail: "Detail A", imageUrl: "" },
  ],
};

const mocks = [
  {
    request: { query: GET_HOME_PAGE_DATA },
    result: { data: mockData },
  },
];

const renderHomePage = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <HomePage />
    </MockedProvider>
  );

describe("HomePage", () => {
  it("shows loading state initially", () => {
    renderHomePage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders hero, products, and services after data loads", async () => {
    const { container } = renderHomePage();
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });
    expect(screen.getByText("PRODUCT")).toBeInTheDocument();
    expect(screen.getByText("SERVICE")).toBeInTheDocument();
    expect(screen.getByText("Service A")).toBeInTheDocument();
    expect(container.querySelector("#hero")).toBeInTheDocument();
  });
});
