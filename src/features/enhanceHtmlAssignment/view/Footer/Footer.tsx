import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation("enhanceHtml");

  return (
    <footer className="bg-slate-900 text-slate-400 text-center py-8 px-6 text-sm font-medium">
      {t("footer.copyright")}
    </footer>
  );
};
