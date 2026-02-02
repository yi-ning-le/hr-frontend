import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormLabel } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ExpandableTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title: string;
  className?: string;
}

export function ExpandableTextarea({
  value,
  onChange,
  placeholder,
  title,
  className
}: ExpandableTextareaProps) {
  const { t } = useTranslation()
  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <FormLabel>{title}</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsFullScreen(true)}
          title={t("recruitment.jobs.form.expandableTextarea.fullscreenEdit")}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <FormControl>
        <Textarea
          placeholder={placeholder}
          className={cn("resize-none", className)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {t("recruitment.jobs.form.expandableTextarea.editTitle", { title })}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-1">
            <Textarea
              className="min-h-full resize-none border-0 focus-visible:ring-0 text-base"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setIsFullScreen(false)}>
              {t("recruitment.jobs.form.expandableTextarea.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
