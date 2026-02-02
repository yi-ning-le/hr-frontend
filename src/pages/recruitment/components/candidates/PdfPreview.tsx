"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Configure PDF.js worker using a more robust method for Vite
// This ensures the worker version matches the library version exactly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPreviewProps {
  url: string;
  className?: string;
  showToolbar?: boolean;
  initialScale?: number;
  maxHeight?: string;
  onFullscreen?: () => void;
}

export function PdfPreview({
  url,
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
  const [retryKey, setRetryKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef({ top: 0, left: 0 });
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  // Reset state when URL changes to avoid stale state between candidates
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageNumber(1);
    setNumPages(null);
    setError(null);
    setLoading(true);
    setMinHeight(undefined);
    setRetryKey(0);
    setScale(initialScale);
  }, [url, initialScale]);

  // Observe container width for responsive scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);


  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF Load Error:", error);
    setError(error);
    setLoading(false);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || prev));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const resetScale = useCallback(() => {
    setScale(1);
  }, []);

  const retry = useCallback(() => {
    if (contentAreaRef.current) {
      setMinHeight(contentAreaRef.current.clientHeight);
      scrollPositionRef.current = {
        top: contentAreaRef.current.scrollTop,
        left: contentAreaRef.current.scrollLeft,
      };
    }
    setError(null);
    setLoading(true);
    setRetryKey((prev) => prev + 1);
  }, []);

  const onPageRenderSuccess = useCallback(() => {
    if (contentAreaRef.current) {
      const { top, left } = scrollPositionRef.current;
      contentAreaRef.current.scrollTo(left, top);
    }
    setMinHeight(undefined);
  }, []);

  const onPageRenderError = useCallback(() => {
    setMinHeight(undefined);
  }, []);

  // Calculate page width based on container
  const pageWidth = containerWidth ? Math.min(containerWidth - 48, 800) * scale : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden",
        className
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
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousPage();
              }}
              disabled={pageNumber <= 1 || loading}
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
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              disabled={pageNumber >= (numPages || 1) || loading}
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
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={scale <= 0.5 || loading}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs min-w-[60px]"
              onClick={(e) => {
                e.stopPropagation();
                resetScale();
              }}
              disabled={loading}
            >
              {Math.round(scale * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={scale >= 3 || loading}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onFullscreen();
                }}
                disabled={loading}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div
        ref={contentAreaRef}
        className="flex-1 overflow-auto flex items-start justify-center p-4"
        style={{ maxHeight, minHeight: minHeight ? `${minHeight}px` : undefined }}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive/50" />
            <div className="text-center space-y-1">
              <p className="font-medium">{t("pdf.loadError")}</p>
              <p className="text-xs">{t("pdf.loadErrorHint")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                retry();
              }}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              {t("pdf.retry")}
            </Button>
          </div>
        ) : (
          <Document
            key={`${url}-${retryKey}`}
            file={url}
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
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              onRenderSuccess={onPageRenderSuccess}
              onRenderError={onPageRenderError}
              loading={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              }
              className="shadow-lg rounded-sm overflow-hidden"
            />
          </Document>
        )}
      </div>
    </div>
  );
}
