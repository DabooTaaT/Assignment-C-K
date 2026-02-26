import { useTranslation } from "react-i18next";
import type { Product } from "@/features/home/interface";
import { ProductCard } from "@/features/home/view/ProductCard";

interface ProductSectionProps {
  products: Product[];
}

export const ProductSection = ({ products }: ProductSectionProps) => {
  const { t } = useTranslation("home");
  return (
    <section id="products" className="bg-[#dbeafe] py-8 px-5">
      <h2 className="text-[#3e7ced] text-center my-10 text-[28px] font-bold uppercase">
        {t("sections.product")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1200px] mx-auto mb-12 px-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
