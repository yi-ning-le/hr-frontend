import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/useAuthStore";
import { LoginForm } from "./LoginForm";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function LoginPage() {
  const { t } = useTranslation();
  const { isLoading } = useAuthStore();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("auth.login.welcomeTitle")}
        </h1>
      </div>

      <LoginForm />

      <SocialLoginButtons disabled={isLoading} />

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          {t("auth.login.register")}
        </Link>
      </p>
    </div>
  );
}
