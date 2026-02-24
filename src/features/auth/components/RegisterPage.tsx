import { useTranslation } from "react-i18next";

export const RegisterPage = () => {
  const { t } = useTranslation("auth");
  return (
    <div>
      <h1>{t("registerTitle")}</h1>
    </div>
  );
};
