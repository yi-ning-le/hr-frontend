import { Link } from "@tanstack/react-router";
import { LoginForm } from "./LoginForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAuthStore } from "@/stores/useAuthStore";

export function LoginPage() {
  const { isLoading } = useAuthStore();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">欢迎回来</h1>
      </div>

      <LoginForm />

      <SocialLoginButtons disabled={isLoading} />

      <p className="text-center text-sm text-muted-foreground">
        还没有账号?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          立即注册
        </Link>
      </p>
    </div>
  );
}
