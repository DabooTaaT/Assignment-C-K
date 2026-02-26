import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import type { ReactNode } from "react";
import { useHome } from "@/features/home/hooks/controller";
import { GET_HOME_PAGE_DATA } from "@/features/home/services/queries";

const mockData = {
  products: [
    { id: "1", name: "P1", detail: "D1", imageUrl: "" },
  ],
  services: [
    { id: "1", name: "S1", detail: "D1", imageUrl: "" },
  ],
};

const mocks = [
  {
    request: { query: GET_HOME_PAGE_DATA },
    result: { data: mockData },
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider mocks={mocks}>
    {children}
  </MockedProvider>
);

describe("useHome", () => {
  it("returns loading true initially", () => {
    const { result } = renderHook(() => useHome(), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  it("returns products and services after loading", async () => {
    const { result } = renderHook(() => useHome(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual(mockData.products);
    expect(result.current.services).toEqual(mockData.services);
  });
});
