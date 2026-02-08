import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RegisterForm } from "./RegisterForm";

export function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("auth.register.createAccount")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.register.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          {t("auth.register.login")}
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        {t("auth.register.termsPrefix")}{" "}
        <button
          type="button"
          className="underline underline-offset-4 hover:text-primary"
          onClick={() => {}}
        >
          {t("auth.register.termsOfService")}
        </button>{" "}
        {t("auth.register.and")}{" "}
        <button
          type="button"
          className="underline underline-offset-4 hover:text-primary"
          onClick={() => {}}
        >
          {t("auth.register.privacyPolicy")}
        </button>
      </p>
    </div>
  );
}
