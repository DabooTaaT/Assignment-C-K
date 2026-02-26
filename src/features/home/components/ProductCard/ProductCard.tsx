import type { Product } from "@/features/home/interface";

const ImagePlaceholder = () => (
  <svg className="w-8 h-8 fill-[#555]" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <div className="flex h-[180px] md:h-[200px] bg-white border border-[#ddd] shadow-sm">
    <div className="bg-[#8c8c8c] w-1/2 flex justify-center items-center">
      <ImagePlaceholder />
    </div>
    <div className="p-5 w-1/2">
      <h3 className="text-lg text-[#333] mb-1">{product.name}</h3>
      <p className="text-sm text-[#4096ff]">{product.detail}</p>
    </div>
  </div>
);
