import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";

const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t("auth.login.usernameRequired")),
    password: z.string().min(1, t("auth.login.passwordRequired")),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const loginSchema = createLoginSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const result = await login(data.username, data.password);

    if (result.success) {
      toast.success(t("auth.login.success"), {
        description: t("auth.login.welcomeBack"),
      });
      onSuccess?.();
      // Remove router.invalidate() as it might cause race conditions or unnecessary revalidations
      // during navigation. The target route's beforeLoad will handle auth checks.
      await navigate({ to: "/", replace: true });
    } else {
      toast.error(t("auth.login.failed"), {
        description: result.error,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.login.username")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.login.usernamePlaceholder")}
                  autoComplete="username"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("auth.login.password")}</FormLabel>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? t("auth.login.hidePassword")
                        : t("auth.login.showPassword")}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {t("auth.login.submit")}
        </Button>
      </form>
    </Form>
  );
}
