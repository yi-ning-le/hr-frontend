// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CandidateStatusDialog } from "../CandidateStatusDialog";
import type { CandidateStatusDefinition } from "@/types/candidate";

// Mock translation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string) => defaultValue,
  }),
}));

// Mock react-hook-form
const mockReset = vi.fn();
const mockHandleSubmit = vi.fn((fn: () => void) => (e: React.FormEvent) => {
  e?.preventDefault();
  fn();
});
const mockControl = { _stub: "control" };

vi.mock("react-hook-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hook-form")>();
  return {
    ...actual,
    useForm: () => ({
      reset: mockReset,
      handleSubmit: mockHandleSubmit,
      control: mockControl,
      formState: { errors: {} },
    }),
    Controller: ({
      render,
      name,
    }: {
      render: (props: unknown) => React.ReactElement;
      name: string;
    }) =>
      render({
        field: {
          name,
          value: "MOCKED_VALUE",
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
      }),
  };
});

// Mock UI components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
  }) => (open ? <div role="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTrigger: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <div onClick={onClick}>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

vi.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormField: ({
    render,
  }: {
    render: (props: { field: unknown }) => React.ReactNode;
  }) => render({ field: {} }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FormMessage: () => <div></div>,
}));

describe("CandidateStatusDialog", () => {
  it("renders correctly in create mode", () => {
    mockReset.mockClear();
    render(
      <CandidateStatusDialog mode="create" open={true} onSubmit={vi.fn()} />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Status")).toBeInTheDocument();

    // Check if reset was called with default values for create mode
    expect(mockReset).toHaveBeenCalledWith({ name: "", color: "#000000" });
  });

  it("calls form.reset with status data when in edit mode", async () => {
    mockReset.mockClear();
    const mockStatus: CandidateStatusDefinition = {
      id: "1",
      slug: "test",
      name: "Test Status",
      type: "custom",
      color: "#ff0000",
      sort_order: 1,
    };

    render(
      <CandidateStatusDialog
        mode="edit"
        status={mockStatus}
        open={true}
        onSubmit={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith({
        name: "Test Status",
        color: "#ff0000",
      });
    });

    expect(screen.getByText("Edit Status")).toBeInTheDocument();
  });
});
