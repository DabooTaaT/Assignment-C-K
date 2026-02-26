import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { Service } from "../../interface";

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection = ({ services }: ServicesSectionProps) => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <section className="bg-white border-t border-slate-200 py-20 px-6">
      <div className="max-w-[1248px] mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-slate-800 mb-10 relative after:content-[''] after:block after:w-[60px] after:h-1 after:bg-blue-600 after:mx-auto after:mt-3 after:rounded">
          {t("services.sectionTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              data-testid="service-card"
              className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-[200px] bg-slate-100 flex items-center justify-center border-b border-slate-200">
                <svg
                  className="w-12 h-12 fill-slate-400 transition-all duration-300 group-hover:fill-blue-600 group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow">
                  {service.description}
                </p>
                <Button
                  variant="outlined"
                  fullWidth
                  className="uppercase tracking-wide text-sm font-semibold"
                >
                  {t("services.learnMore")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
