import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialLoginButtonsProps {
  className?: string;
  disabled?: boolean;
}

export function SocialLoginButtons({
  className,
  disabled,
}: SocialLoginButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("auth.social.orContinueWith")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          className="h-11"
          onClick={() => console.log("WeChat login - coming soon")}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z" />
            <path d="M23.997 14.545c0-3.2-3.138-5.816-7.008-5.816-3.92 0-7.058 2.616-7.058 5.816 0 3.202 3.138 5.816 7.058 5.816a8.07 8.07 0 0 0 2.274-.324.67.67 0 0 1 .563.078l1.508.883a.262.262 0 0 0 .132.043c.13 0 .233-.108.233-.236 0-.058-.023-.116-.039-.172l-.31-1.176a.468.468 0 0 1 .168-.528c1.49-1.076 2.479-2.68 2.479-4.384zm-9.396-1.058a.93.93 0 0 1-.933-.929c0-.514.418-.931.933-.931s.932.417.932.931a.93.93 0 0 1-.932.93zm4.778 0a.93.93 0 0 1-.933-.929c0-.514.418-.931.933-.931s.932.417.932.931a.93.93 0 0 1-.932.93z" />
          </svg>
          <span className="sr-only">{t("auth.social.wechat")}</span>
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          className="h-11"
          onClick={() => console.log("DingTalk login - coming soon")}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.957l-1.41-.367c.133-.107.267-.213.4-.32.733-.587 1.5-1.2 1.5-2.2 0-.467-.167-.867-.5-1.2-.267-.267-.633-.467-1.1-.6.1-.2.167-.4.167-.633 0-.8-.6-1.4-1.367-1.567-.3-.067-.6-.033-.9.033.033-.133.067-.3.067-.467 0-.9-.7-1.633-1.567-1.633-.467 0-.9.2-1.2.533-.267.3-.433.7-.433 1.133 0 .067 0 .133.033.2-.333-.133-.7-.2-1.067-.2-.833 0-1.533.367-1.9.967h-.033c-.1 0-.2.033-.3.033-.867 0-1.567.733-1.567 1.633s.7 1.633 1.567 1.633c.1 0 .2-.033.3-.033.033.067.067.133.1.2-.233.367-.367.8-.367 1.267 0 .633.233 1.2.633 1.633.4.433.933.7 1.533.767l.033.033c-.033.1-.067.2-.067.333 0 .5.267.933.667 1.167v.133c0 .233 0 .833 1.367 1.367l.833.333 1.167-3.433c.133-.4.367-.767.667-1.067l4.667-4.733.1-.1.033-.1c-.833 1.233-1.933 2.2-3.133 3l.1-.1z" />
          </svg>
          <span className="sr-only">{t("auth.social.dingtalk")}</span>
        </Button>

        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          className="h-11"
          onClick={() => console.log("Feishu login - coming soon")}
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="sr-only">{t("auth.social.feishu")}</span>
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t("auth.social.comingSoon")}
      </p>
    </div>
  );
}
