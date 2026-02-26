import { useTranslation } from "react-i18next";
import { useEnhanceHtmlAssignment } from "./hooks/controller";
import { Header } from "./view/Header";
import { HeroSection } from "./view/HeroSection";
import { ProductsSection } from "./view/ProductsSection";
import { ServicesSection } from "./view/ServicesSection";
import { Footer } from "./view/Footer";

export const EnhanceHtmlAssignmentPage = () => {
  const { t } = useTranslation("common");
  const { products, services, loading, error } = useEnhanceHtmlAssignment();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 text-lg">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <HeroSection />
      <ProductsSection products={products} />
      <ServicesSection services={services} />
      <Footer />
    </div>
  );
};
