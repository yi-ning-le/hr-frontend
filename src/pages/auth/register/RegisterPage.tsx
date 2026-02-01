import { Link } from "@tanstack/react-router";
import { RegisterForm } from "./RegisterForm";

export function RegisterPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">创建账号</h1>
        <p className="text-muted-foreground text-sm">
          填写以下信息注册新账号
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        已有账号?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          立即登录
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        注册即表示您同意我们的{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          服务条款
        </a>{" "}
        和{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          隐私政策
        </a>
      </p>
    </div>
  );
}
