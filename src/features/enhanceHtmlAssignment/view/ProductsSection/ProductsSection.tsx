import { useTranslation } from "react-i18next";
import type { Product } from "../../interface";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <section className="max-w-[1248px] mx-auto px-6 pb-16">
      <h2 className="text-center text-3xl font-extrabold text-slate-800 mt-20 mb-10 relative after:content-[''] after:block after:w-[60px] after:h-1 after:bg-blue-600 after:mx-auto after:mt-3 after:rounded">
        {t("products.sectionTitle")}
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            data-testid="product-card"
            className="bg-white rounded-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[220px] shadow-sm border border-slate-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
          >
            <div className="w-full md:w-[45%] h-[180px] md:h-full bg-slate-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
              <svg className="w-12 h-12 fill-slate-400" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>

            <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {product.title}
              </h3>
              <p className="text-[15px] text-slate-500">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
