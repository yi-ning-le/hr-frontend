import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import {
  Calendar,
  dateFnsLocalizer,
  type View,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useResolveCandidateStatus } from "@/hooks/useCandidateStatuses";
import type { Candidate } from "@/types/candidate";
import type { Interview } from "@/types/recruitment.d";

const locales = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface InterviewCalendarProps {
  interviews: Interview[];
  candidates: Map<string, Candidate>;
  onPreviewResume: (candidate: Candidate) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    interview: Interview;
    candidate?: Candidate;
  };
}

export function InterviewCalendar({
  interviews,
  candidates,
  onPreviewResume,
}: InterviewCalendarProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { resolveStatus } = useResolveCandidateStatus();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const events: CalendarEvent[] = useMemo(() => {
    return interviews.map((interview) => {
      const candidate = candidates.get(interview.candidateId);
      const startTime = new Date(interview.scheduledTime);
      // Use scheduledEndTime if available, otherwise assume 1 hour duration
      const endTime = interview.scheduledEndTime
        ? new Date(interview.scheduledEndTime)
        : new Date(startTime.getTime() + 60 * 60 * 1000);

      return {
        id: interview.id,
        title: candidate?.name || "Unknown",
        start: startTime,
        end: endTime,
        resource: {
          interview,
          candidate,
        },
      };
    });
  }, [interviews, candidates]);

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate({
      to: "/interviews/$interviewId",
      params: { interviewId: event.id },
    });
  };

  const eventStyleGetter = (
    event: CalendarEvent,
    _start: Date,
    _end: Date,
    _isSelected: boolean,
  ) => {
    const status = event.resource.interview.status;
    let backgroundColor = "#3b82f6"; // blue-500
    let borderColor = "#2563eb"; // blue-600

    if (status === "COMPLETED") {
      backgroundColor = "#6b7280"; // gray-500
      borderColor = "#4b5563"; // gray-600
    } else if (status !== "PENDING") {
      backgroundColor = "#ef4444"; // red-500
      borderColor = "#dc2626"; // red-600
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    // Prefer snapshot status, fallback to current candidate status
    const statusDef = resolveStatus(
      event.resource.interview,
      event.resource.candidate,
    );

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="h-full w-full flex items-center gap-1 px-1 overflow-hidden">
            <span className="text-xs font-medium truncate">
              {format(event.start, "HH:mm")}
            </span>
            <span className="text-xs truncate">{event.title}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4" align="start">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                {event.resource.candidate?.name || "Unknown"}
              </h4>
              <div className="flex flex-col gap-1 items-end">
                <Badge
                  variant={
                    event.resource.interview.status === "PENDING"
                      ? "default"
                      : event.resource.interview.status === "COMPLETED"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {event.resource.interview.status}
                </Badge>
                {statusDef && (
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: statusDef.color,
                      color: statusDef.color,
                    }}
                    className="text-[10px] px-1.5 h-5"
                  >
                    {statusDef.name}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {event.resource.candidate?.appliedJobTitle || "Unknown Position"}
            </div>

            <div className="text-xs text-muted-foreground">
              {format(event.start, "PPP p")} - {format(event.end, "p")}
            </div>

            {event.resource.candidate?.resumeUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  event.resource.candidate &&
                    onPreviewResume(event.resource.candidate);
                }}
              >
                {t("recruitment.candidates.detail.viewResume", "View Resume")}
              </Button>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px] bg-background border rounded-lg shadow-sm p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent,
        }}
        culture={i18n.language}
        messages={{
          today: t("recruitment.calendar.today", "Today"),
          previous: t("recruitment.calendar.previous", "Back"),
          next: t("recruitment.calendar.next", "Next"),
          month: t("recruitment.calendar.month", "Month"),
          week: t("recruitment.calendar.week", "Week"),
          day: t("recruitment.calendar.day", "Day"),
          agenda: t("recruitment.calendar.agenda", "Agenda"),
          date: t("recruitment.calendar.date", "Date"),
          time: t("recruitment.calendar.time", "Time"),
          event: t("recruitment.calendar.event", "Event"),
          noEventsInRange: t(
            "recruitment.calendar.noEventsInRange",
            "No interviews in this range",
          ),
        }}
      />
    </div>
  );
}
