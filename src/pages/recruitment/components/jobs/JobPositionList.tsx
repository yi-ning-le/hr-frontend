"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { MoreHorizontal, Pencil, Trash2, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import type { JobPosition } from "@/types/job"

interface JobPositionListProps {
  jobs: JobPosition[]
  candidateCounts?: Record<string, number>
  onEdit: (job: JobPosition) => void
  onDelete?: (jobId: string) => void
  onView?: (job: JobPosition) => void
  onStatusToggle?: (job: JobPosition) => void
}

export function JobPositionList({
  jobs,
  candidateCounts = {},
  onEdit,
  onDelete,
  onView,
  onStatusToggle
}: JobPositionListProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Derive unique departments
  const departments = Array.from(new Set(jobs.map(job => job.department)))

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("recruitment.jobs.table.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-fit sm:min-w-[160px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder={t("recruitment.jobs.department")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("recruitment.jobs.table.allDepartments")}</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-fit sm:min-w-[130px]">
              <SelectValue placeholder={t("recruitment.jobs.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("recruitment.jobs.table.allStatus")}</SelectItem>
              <SelectItem value="OPEN">{t("recruitment.jobs.statusOptions.open")}</SelectItem>
              <SelectItem value="CLOSED">{t("recruitment.jobs.statusOptions.closed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("recruitment.jobs.name")}</TableHead>
              <TableHead>{t("recruitment.jobs.department")}</TableHead>
              <TableHead>{t("recruitment.jobs.headCount")}</TableHead>
              <TableHead>{t("recruitment.jobs.openDate")}</TableHead>
              <TableHead>{t("recruitment.jobs.status")}</TableHead>
              <TableHead>{t("recruitment.jobs.quickAction")}</TableHead>
              <TableHead>{t("recruitment.jobs.note")}</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {t("recruitment.jobs.table.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView?.(job)}
                >
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>
                    {job.headCount}
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {t("recruitment.jobs.candidateCount", { count: candidateCounts[job.id] || 0 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                      {job.status === "OPEN" ? t("recruitment.jobs.statusOptions.open") : t("recruitment.jobs.statusOptions.closed")}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={job.status === "OPEN"}
                        onCheckedChange={() => onStatusToggle?.(job)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {job.status === "OPEN" ? t("recruitment.jobs.table.statusOn") : t("recruitment.jobs.table.statusOff")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={job.note}>
                    {job.note || "-"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("recruitment.jobs.table.openMenu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(job)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(job.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground">
        {t("recruitment.jobs.table.resultsCount", { count: filteredJobs.length })}
      </div>
    </div>
  )
}
