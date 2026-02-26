// src/features/home/components/ServiceSection.tsx
import type { Service } from "@/features/home/interface";
import { ServiceCard } from "@/features/home/components/ServiceCard";

interface ServiceSectionProps {
  services: Service[];
}

export const ServiceSection = ({ services }: ServiceSectionProps) => (
  <section id="services" className="bg-[#dbeafe] py-8 px-5">
    <h2 className="text-[#3e7ced] text-center mb-8 text-[28px] font-bold uppercase">
      SERVICE
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-[1200px] mx-auto">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  </section>
);
