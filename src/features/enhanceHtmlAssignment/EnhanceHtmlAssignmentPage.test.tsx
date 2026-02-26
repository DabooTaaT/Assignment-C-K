import { render, screen } from "@testing-library/react";
import { EnhanceHtmlAssignmentPage } from "./EnhanceHtmlAssignmentPage";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("./hooks/controller", () => ({
  useEnhanceHtmlAssignment: () => ({
    products: [{ id: "1", title: "Widget", description: "Desc" }],
    services: [{ id: "1", title: "Consulting", description: "Desc" }],
    loading: false,
    error: undefined,
  }),
}));

jest.mock("@/components/ui/Button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

describe("EnhanceHtmlAssignmentPage", () => {
  it("renders all page sections", () => {
    const { container } = render(<EnhanceHtmlAssignmentPage />);
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelectorAll("section").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("shows loading state when loading is true", () => {
    jest.resetModules();
    jest.doMock("./hooks/controller", () => ({
      useEnhanceHtmlAssignment: () => ({
        products: [],
        services: [],
        loading: true,
        error: undefined,
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { EnhanceHtmlAssignmentPage: Page } = require("./EnhanceHtmlAssignmentPage");
    render(<Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
