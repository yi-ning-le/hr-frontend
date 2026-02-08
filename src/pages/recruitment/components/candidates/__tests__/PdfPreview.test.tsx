// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PdfPreview } from "../PdfPreview";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-pdf
vi.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
  Document: ({
    children,
    onLoadSuccess,
    file,
  }: {
    children?: React.ReactNode;
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    file: string;
  }) => {
    // Simulate async load success
    setTimeout(() => {
      if (onLoadSuccess) onLoadSuccess({ numPages: 5 });
    }, 10);
    return (
      <div data-testid="pdf-document" data-file={file}>
        {children}
      </div>
    );
  },
  Page: ({ pageNumber }: { pageNumber: number }) => {
    return <div data-testid="pdf-page">Page {pageNumber}</div>;
  },
}));

// Mock ResizeObserver
vi.stubGlobal(
  "ResizeObserver",
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof globalThis.ResizeObserver,
);

describe("PdfPreview", () => {
  const defaultProps = {
    pdfUrl: "http://example.com/test.pdf",
    onFullscreen: vi.fn(),
  };

  it("renders pages after loading", async () => {
    render(<PdfPreview {...defaultProps} />);

    // Wait for the simulated load
    await screen.findByTestId("pdf-document");
    expect(await screen.findByText("Page 1")).toBeInTheDocument();

    // Toolbar should show page count
    expect(await screen.findByText("1 / 5")).toBeInTheDocument();
  });

  it("navigates between pages", async () => {
    render(<PdfPreview {...defaultProps} />);

    await screen.findByText("Page 1");
    // Wait for loading to finish
    await screen.findByText("1 / 5");

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(await screen.findByText("Page 2")).toBeInTheDocument();
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  it("zooms in and out", async () => {
    const { container } = render(
      <PdfPreview {...defaultProps} showToolbar={true} />,
    );
    // Wait for loading to finish (indicated by page count)
    await screen.findByText("1 / 5");

    // Click Zoom In
    const zoomInIcon = container.querySelector(".lucide-zoom-in");
    expect(zoomInIcon).toBeInTheDocument();
    fireEvent.click(zoomInIcon!.closest("button")!);

    // Scale starts at 1.0 (100%), +0.25 -> 125%
    expect(screen.getByText("125%")).toBeInTheDocument();

    // Click Zoom Out
    const zoomOutIcon = container.querySelector(".lucide-zoom-out");
    expect(zoomOutIcon).toBeInTheDocument();
    fireEvent.click(zoomOutIcon!.closest("button")!);

    // Back to 100%
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calls onFullscreen when button clicked", async () => {
    const { container } = render(<PdfPreview {...defaultProps} />);
    // Wait for loading to finish
    await screen.findByText("1 / 5");

    const fullscreenIcon = container.querySelector(".lucide-maximize-2");
    expect(fullscreenIcon).toBeInTheDocument();
    fireEvent.click(fullscreenIcon!.closest("button")!);

    expect(defaultProps.onFullscreen).toHaveBeenCalled();
  });

  it("resets page number when url changes", async () => {
    const { rerender } = render(<PdfPreview {...defaultProps} />);

    // Wait for initial load
    await screen.findByText("1 / 5");

    // Navigate to page 2
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(await screen.findByText("2 / 5")).toBeInTheDocument();

    // Change URL
    rerender(
      <PdfPreview
        key="http://example.com/other.pdf"
        {...defaultProps}
        pdfUrl="http://example.com/other.pdf"
      />,
    );

    // Page number should reset to 1
    // Wait for the new document to load
    await screen.findByText("1 / 5");
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
  });
});
