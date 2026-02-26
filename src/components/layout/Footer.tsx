import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer id="footer" className="bg-[#4096ff] text-white text-center py-4 text-xs">
      {t("footer.copyright")}
    </footer>
  );
};
