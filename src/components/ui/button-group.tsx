/* eslint-disable react-refresh/only-export-components */
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

const ButtonGroupContext = React.createContext<{
  orientation: "horizontal" | "vertical";
}>({
  orientation: "horizontal",
});

function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <ButtonGroupContext.Provider
      value={{ orientation: orientation || "horizontal" }}
    >
      <div
        role="group"
        data-slot="button-group"
        data-orientation={orientation}
        className={cn(buttonGroupVariants({ orientation }), className)}
        {...props}
      />
    </ButtonGroupContext.Provider>
  );
}

function ButtonGroupItem({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  const { orientation } = React.useContext(ButtonGroupContext);

  return (
    <Comp
      data-slot="button-group-item"
      data-orientation={orientation}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "h-10 px-4 py-2",
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const { orientation } = React.useContext(ButtonGroupContext);
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
      className={cn(
        "bg-input",
        orientation === "horizontal" ? "w-px h-auto" : "h-px w-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupSeparator,
  buttonGroupVariants,
};
