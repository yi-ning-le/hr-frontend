import { format } from "date-fns";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ColumnDef<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface CandidateTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  actionLabel: string;
  actionVariant?: "default" | "outline";
  onAction: (row: T) => void;
}

export function CandidateTable<T extends { id: string }>({
  data,
  columns,
  actionLabel,
  actionVariant = "default",
  onAction,
}: CandidateTableProps<T>) {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header} className={col.className}>
              {col.header}
            </TableHead>
          ))}
          <TableHead className="text-right">
            {t("common.actions", "Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.header} className={col.className}>
                {col.cell(row)}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-2">
              <Button
                variant={actionVariant}
                size="sm"
                onClick={() => onAction(row)}
                className="cursor-pointer"
              >
                {actionLabel}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd");
}
