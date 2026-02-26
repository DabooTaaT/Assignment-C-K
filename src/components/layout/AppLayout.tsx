import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/core/middleware/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const AppLayout = () => (
  <ErrorBoundary>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  </ErrorBoundary>
);
