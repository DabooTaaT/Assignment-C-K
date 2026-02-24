import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/core/router/guards/RequireAuth";

jest.mock("@/features/auth/controller", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/features/auth/controller";
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const ProtectedPage = () => <div>Protected content</div>;

const renderWithRouter = (isAuthenticated: boolean) => {
  mockUseAuth.mockReturnValue({ isAuthenticated } as ReturnType<typeof useAuth>);

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("RequireAuth", () => {
  it("renders protected content when authenticated", () => {
    renderWithRouter(true);
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderWithRouter(false);
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
