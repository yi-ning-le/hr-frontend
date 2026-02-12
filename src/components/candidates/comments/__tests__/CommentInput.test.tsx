import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommentInput } from "../CommentInput";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe("CommentInput", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it("renders textarea and submit button", () => {
    render(<CommentInput onSubmit={mockOnSubmit} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /recruitment\.candidates\.comments\.submit/,
      }),
    ).toBeInTheDocument();
  });

  it("submit button is disabled when textarea is empty", () => {
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    expect(button).toBeDisabled();
  });

  it("submit button is disabled when textarea contains only whitespace", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    await user.type(screen.getByRole("textbox"), "   ");

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    expect(button).toBeDisabled();
  });

  it("submit button is enabled when textarea has content", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    await user.type(screen.getByRole("textbox"), "A comment");

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    expect(button).toBeEnabled();
  });

  it("calls onSubmit with content and clears textarea on success", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "My new comment");

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("My new comment");
    });

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });

  it("does not clear textarea on submission error", async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Will fail");

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("Will fail");
    });

    await waitFor(() => {
      expect(textarea).toHaveValue("Will fail");
    });
  });

  it("shows loading state during submission", async () => {
    let resolveSubmit: () => void;
    mockOnSubmit.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    await user.type(screen.getByRole("textbox"), "Loading test");

    const button = screen.getByRole("button", {
      name: /recruitment\.candidates\.comments\.submit/,
    });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("recruitment.candidates.comments.saving"),
      ).toBeInTheDocument();
    });

    resolveSubmit!();

    await waitFor(() => {
      expect(
        screen.getByText("recruitment.candidates.comments.submit"),
      ).toBeInTheDocument();
    });
  });

  it("submits on Ctrl+Enter keyboard shortcut", async () => {
    const user = userEvent.setup();
    render(<CommentInput onSubmit={mockOnSubmit} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Keyboard submit");
    await user.keyboard("{Control>}{Enter}{/Control}");

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("Keyboard submit");
    });
  });

  it("uses initialValue prop when provided", () => {
    render(
      <CommentInput onSubmit={mockOnSubmit} initialValue="Prefilled text" />,
    );

    expect(screen.getByRole("textbox")).toHaveValue("Prefilled text");
  });

  it("uses custom placeholder when provided", () => {
    render(
      <CommentInput onSubmit={mockOnSubmit} placeholder="Custom placeholder" />,
    );

    expect(
      screen.getByPlaceholderText("Custom placeholder"),
    ).toBeInTheDocument();
  });
});
