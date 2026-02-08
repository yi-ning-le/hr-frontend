"use client";

import { useCallback, useState, useRef } from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Configure PDF.js worker using a more robust method for Vite
// This ensures the worker version matches the library version exactly
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  } catch (e) {
    console.error("PDF worker init failed", e);
  }
}

interface PdfPreviewProps {
  pdfUrl: string;
  className?: string;
  showToolbar?: boolean;
  initialScale?: number;
  maxHeight?: string;
  onFullscreen?: () => void;
}

export function PdfPreview({
  pdfUrl,
  className,
  showToolbar = true,
  initialScale = 1.0,
  maxHeight = "600px",
  onFullscreen,
}: PdfPreviewProps) {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(initialScale);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver(containerRef);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
      setError(null);
    },
    [],
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF Load Error:", error);
    setError(error);
    setLoading(false);
  }, []);

  const adjustPage = useCallback(
    (delta: number) => {
      setPageNumber((prev) =>
        Math.min(Math.max(1, prev + delta), numPages || prev + delta),
      );
    },
    [numPages],
  );

  const adjustScale = useCallback((delta: number) => {
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 3));
  }, []);

  const pageWidth = containerWidth
    ? Math.min(containerWidth - 48, 800) * scale
    : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur-sm">
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => adjustPage(-1)}
              disabled={pageNumber <= 1 || loading}
              aria-label={t("common.previous") || "Previous Page"}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              {loading ? "..." : `${pageNumber} / ${numPages || "?"}`}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => adjustPage(1)}
              disabled={pageNumber >= (numPages || 1) || loading}
              aria-label={t("common.next") || "Next Page"}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => adjustScale(-0.25)}
              disabled={scale <= 0.5 || loading}
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs min-w-[60px]"
              onClick={() => setScale(1)}
              disabled={loading}
              aria-label="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => adjustScale(0.25)}
              disabled={scale >= 3 || loading}
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {onFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onFullscreen}
                disabled={loading}
                aria-label={
                  t("recruitment.jobs.detail.fullscreen") || "Fullscreen"
                }
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-auto flex items-start justify-center p-4"
        style={{ maxHeight }}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive/50" />
            <div className="text-center space-y-1">
              <p className="font-medium">{t("pdf.loadError")}</p>
            </div>
          </div>
        ) : (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">{t("pdf.loading")}</p>
              </div>
            }
            noData={
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                <FileText className="h-12 w-12 opacity-20" />
                <p className="text-sm">{t("pdf.noFile")}</p>
              </div>
            }
            className="flex justify-center"
          >
            {!loading && numPages && (
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                loading={<Loader2 className="h-6 w-6 animate-spin" />}
                className="shadow-lg rounded-sm overflow-hidden"
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}
          </Document>
        )}
      </div>
    </div>
  );
}
