import { Button } from "@/components/ui/Button";
import type { Service } from "@/features/home/interface";

const ImagePlaceholder = () => (
  <svg className="w-8 h-8 fill-[#555]" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => (
  <div className="flex flex-col bg-white border border-[#c9defc] shadow-sm">
    <div className="bg-[#8c8c8c] h-[150px] md:h-[180px] flex justify-center items-center">
      <ImagePlaceholder />
    </div>
    <div className="p-5 flex-1">
      <h3 className="text-lg text-[#333] mb-1">{service.name}</h3>
      <p className="text-sm text-[#4096ff]">{service.detail}</p>
    </div>
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#4096ff",
        borderRadius: 0,
        textTransform: "uppercase",
        "&:hover": { backgroundColor: "#3e7ced" },
      }}
    >
      MORE
    </Button>
  </div>
);
