import { useTranslation } from "react-i18next";

export const LoginPage = () => {
  const { t } = useTranslation("auth");
  return (
    <div>
      <h1>{t("loginTitle")}</h1>
    </div>
  );
};
