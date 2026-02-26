import { useHome } from "@/features/home/hooks/controller";
import { HeroSection } from "@/features/home/components/HeroSection";
import { ProductSection } from "@/features/home/components/ProductSection";
import { ServiceSection } from "@/features/home/components/ServiceSection";

export const HomePage = () => {
  const { products, services, loading, error } = useHome();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">Something went wrong</div>;
  }

  return (
    <>
      <HeroSection />
      <ProductSection products={products} />
      <ServiceSection services={services} />
    </>
  );
};
