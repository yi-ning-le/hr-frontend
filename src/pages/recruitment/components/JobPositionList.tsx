"use client"

import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

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
import type { JobPosition } from "@/types/job"

interface JobPositionListProps {
  jobs: JobPosition[]
  onEdit: (job: JobPosition) => void
  onDelete?: (jobId: string) => void
  onView?: (job: JobPosition) => void
}

export function JobPositionList({ jobs, onEdit, onDelete, onView }: JobPositionListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>职位名称</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>需求人数</TableHead>
            <TableHead>启动日期</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>备注</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                暂无职位数据
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onView?.(job)}
              >
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{job.headCount}</TableCell>
                <TableCell>
                  {job.openDate ? format(job.openDate, "yyyy-MM-dd") : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                    {job.status === "OPEN" ? "招聘中" : "已关闭"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={job.note}>
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
  )
}
