"use client";

import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
  minTime?: string;
  placeholder?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

function isTimeDisabled(
  hour: string,
  minute: string,
  minTime?: string,
): boolean {
  if (!minTime) return false;

  const [minHour, minMinute] = minTime.split(":").map(Number);
  const currentHour = Number(hour);
  const currentMinute = Number(minute);

  if (currentHour < minHour) return true;
  if (currentHour === minHour && currentMinute < minMinute) return true;
  return false;
}

function formatTime(hour: string, minute: string): string {
  return `${hour}:${minute}`;
}

export function TimePicker({
  value,
  onChange,
  disabled,
  minTime,
  placeholder = "Select time",
}: TimePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempHour, setTempHour] = useState("");
  const [tempMinute, setTempMinute] = useState("");

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const selectedHour = value?.split(":")[0] || "";
  const selectedMinute = value?.split(":")[1] || "";

  const scrollToValue = (
    ref: React.RefObject<HTMLDivElement | null>,
    value: string,
    itemHeight: number,
  ) => {
    if (ref.current && value) {
      const viewport = ref.current.querySelector(
        '[data-slot="scroll-area-viewport"]',
      );
      if (viewport) {
        const index = parseInt(value, 10);
        const targetScroll = index * itemHeight - 60;
        viewport.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (open) {
      setTempHour(selectedHour);
      setTempMinute(selectedMinute);
      setTimeout(() => {
        scrollToValue(hourRef, selectedHour, 32);
        scrollToValue(minuteRef, selectedMinute, 32);
      }, 100);
    }
  }, [open, selectedHour, selectedMinute]);

  const handleHourClick = (hour: string) => {
    if (!isTimeDisabled(hour, tempMinute || "00", minTime)) {
      setTempHour(hour);
    }
  };

  const handleMinuteClick = (minute: string) => {
    if (!isTimeDisabled(tempHour || "00", minute, minTime)) {
      setTempMinute(minute);
    }
  };

  const handleConfirm = () => {
    if (tempHour && tempMinute) {
      onChange?.(formatTime(tempHour, tempMinute));
      setOpen(false);
    }
  };

  const handleWheel = (
    e: React.WheelEvent,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    const viewport = ref.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    if (viewport) {
      viewport.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  const canConfirm = tempHour && tempMinute;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col p-2">
          <div className="flex items-center gap-2">
            <ScrollArea
              className="h-[180px] w-[60px]"
              ref={hourRef}
              onWheel={(e) => handleWheel(e, hourRef)}
            >
              <div className="flex flex-col">
                {HOURS.map((hour) => {
                  const isDisabled = isTimeDisabled(
                    hour,
                    tempMinute || "00",
                    minTime,
                  );
                  const isSelected = hour === tempHour;
                  const className = cn(
                    "flex h-8 w-full items-center justify-center rounded-sm text-sm transition-colors",
                    isSelected && "bg-primary text-primary-foreground",
                    !isSelected &&
                      !isDisabled &&
                      "cursor-pointer hover:bg-accent",
                    isDisabled && "opacity-50 bg-muted/50 select-none",
                  );

                  if (isDisabled) {
                    return (
                      <span key={hour} className={className}>
                        {hour}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleHourClick(hour)}
                      className={className}
                    >
                      {hour}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            <span className="text-lg font-bold">:</span>

            <ScrollArea
              className="h-[180px] w-[60px]"
              ref={minuteRef}
              onWheel={(e) => handleWheel(e, minuteRef)}
            >
              <div className="flex flex-col">
                {MINUTES.map((minute) => {
                  const isDisabled = isTimeDisabled(
                    tempHour || "00",
                    minute,
                    minTime,
                  );
                  const isSelected = minute === tempMinute;
                  const className = cn(
                    "flex h-8 w-full items-center justify-center rounded-sm text-sm transition-colors",
                    isSelected && "bg-primary text-primary-foreground",
                    !isSelected &&
                      !isDisabled &&
                      "cursor-pointer hover:bg-accent",
                    isDisabled && "opacity-50 bg-muted/50 select-none",
                  );

                  if (isDisabled) {
                    return (
                      <span key={minute} className={className}>
                        {minute}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleMinuteClick(minute)}
                      className={className}
                    >
                      {minute}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full mt-2"
          >
            {t("common.confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
