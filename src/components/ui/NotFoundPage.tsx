import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/router/routes";

export const NotFoundPage = () => {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">{t("notFound")}</p>
        <Link to={ROUTES.HOME} className="mt-4 inline-block text-primary underline">
          {t("back")}
        </Link>
      </div>
    </div>
  );
};
