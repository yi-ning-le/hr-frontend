import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
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

const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z
        .string()
        .min(3, t("auth.register.usernameMin"))
        .max(20, t("auth.register.usernameMax"))
        .regex(/^[a-zA-Z0-9]+$/, t("auth.register.usernamePattern")),
      email: z.string().email(t("auth.register.emailInvalid")),
      password: z
        .string()
        .min(6, t("auth.register.passwordMin"))
        .max(50, t("auth.register.passwordMax")),
      confirmPassword: z
        .string()
        .min(1, t("auth.register.confirmPasswordRequired")),
      firstName: z.string().min(1, t("auth.register.firstNameRequired")),
      lastName: z.string().min(1, t("auth.register.lastNameRequired")),
      phone: z.string().min(1, t("auth.register.phoneRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.passwordMismatch"),
      path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const registerSchema = createRegisterSchema(t);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    const result = await register(data);

    if (result.success) {
      toast.success(t("auth.register.success"), {
        description: t("auth.register.welcomeMessage"),
      });
      onSuccess?.();
      await navigate({ to: "/login", replace: true });
    } else {
      toast.error(t("auth.register.failed"), {
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
              <FormLabel>{t("auth.register.username")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.register.usernamePlaceholder")}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.firstName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.firstNamePlaceholder")}
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.lastName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.lastNamePlaceholder")}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.phone")}</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={t("auth.register.phonePlaceholder")}
                  autoComplete="tel"
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
              <FormLabel>{t("auth.register.password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.register.passwordPlaceholder")}
                    autoComplete="new-password"
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.confirmPassword")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword
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
          {t("auth.register.submit")}
        </Button>
      </form>
    </Form>
  );
}
