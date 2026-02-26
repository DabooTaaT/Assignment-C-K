import { renderHook, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import { useEnhanceHtmlAssignment } from "./controller";
import { GET_PRODUCTS, GET_SERVICES } from "../services/queries";
import type { ReactNode } from "react";

const mockProducts = [
  { id: "1", title: "Widget", description: "Desc", imageUrl: null },
];
const mockServices = [
  { id: "1", title: "Consulting", description: "Desc", imageUrl: null },
];

const mocks = [
  {
    request: { query: GET_PRODUCTS },
    result: { data: { products: mockProducts } },
  },
  {
    request: { query: GET_SERVICES },
    result: { data: { services: mockServices } },
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <MockedProvider mocks={mocks}>
    {children}
  </MockedProvider>
);

describe("useEnhanceHtmlAssignment", () => {
  it("returns products and services after loading", async () => {
    const { result } = renderHook(() => useEnhanceHtmlAssignment(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.services).toEqual(mockServices);
    expect(result.current.error).toBeUndefined();
  });
});
