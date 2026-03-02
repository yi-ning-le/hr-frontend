import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PersonOption {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
}

interface PersonComboboxProps {
  options: PersonOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export function PersonCombobox({
  options,
  value,
  onChange,
  placeholder = "Select person…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  disabled = false,
}: PersonComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedPerson = options.find((p) => p.id === value);
  const displayLabel = selectedPerson
    ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span
            className={cn(
              "truncate min-w-0",
              !selectedPerson && "text-muted-foreground",
            )}
          >
            {displayLabel}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((person) => (
                <CommandItem
                  key={person.id}
                  value={`${person.firstName} ${person.lastName}`}
                  onSelect={() => {
                    onChange(person.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === person.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate min-w-0">
                    {person.firstName} {person.lastName}
                  </span>
                  {person.department && (
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">
                      {person.department}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
