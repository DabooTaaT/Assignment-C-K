import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "footer.copyright": "© 2026 BrandName. All rights reserved.",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("Footer", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText("© 2026 BrandName. All rights reserved.")
    ).toBeInTheDocument();
  });
});
