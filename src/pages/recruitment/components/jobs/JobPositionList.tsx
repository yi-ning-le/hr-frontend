"use client"

import { useState } from "react"
import { format } from "date-fns"
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
  onEdit: (job: JobPosition) => void
  onDelete?: (jobId: string) => void
  onView?: (job: JobPosition) => void
  onStatusToggle?: (job: JobPosition) => void
}

export function JobPositionList({
  jobs,
  onEdit,
  onDelete,
  onView,
  onStatusToggle
}: JobPositionListProps) {
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
            placeholder="搜索职位名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[140px]">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder="部门" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有部门</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="OPEN">招聘中</SelectItem>
              <SelectItem value="CLOSED">已关闭</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>职位名称</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>需求人数</TableHead>
              <TableHead>启动日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>快速操作</TableHead>
              <TableHead>备注</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  没有找到符合条件的职位
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
                      {/* Mock pipeline stats */}
                      {Math.floor(Math.random() * 5)} 候选人
                    </span>
                  </TableCell>
                  <TableCell>
                    {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                      {job.status === "OPEN" ? "招聘中" : "已关闭"}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={job.status === "OPEN"}
                        onCheckedChange={() => onStatusToggle?.(job)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {job.status === "OPEN" ? "开启" : "关闭"}
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
                          <span className="sr-only">打开菜单</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(job)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(job.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
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
        共找到 {filteredJobs.length} 个职位
      </div>
    </div>
  )
}
