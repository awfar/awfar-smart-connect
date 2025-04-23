
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
  disableCreate?: boolean;
  onCreateNew?: () => void;
  createNewLabel?: string;
  isLoading?: boolean;
  onSearch?: (term: string) => void;
  onOpen?: () => void;
}

export function Autocomplete({
  options = [],
  value,
  onValueChange,
  placeholder = "Select...",
  emptyMessage = "No results found",
  className,
  name,
  disabled = false,
  disableCreate = true,
  onCreateNew,
  createNewLabel = "إضافة جديد",
  isLoading = false,
  onSearch,
  onOpen,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Create a safe copy of options that's always an array
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onValueChange(currentValue === value ? "" : currentValue);
      setOpen(false);
    },
    [value, onValueChange]
  );

  // Safely find the selected option, with null checks
  const selectedOption = React.useMemo(() => {
    if (!value || !safeOptions.length) return null;
    return safeOptions.find((option) => option.value === value) || null;
  }, [safeOptions, value]);

  // Safe label for display
  const displayLabel = selectedOption ? selectedOption.label : "";

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return safeOptions;
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [safeOptions, searchTerm]);

  // Handle popover open
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setSearchTerm("");
      if (onOpen) onOpen();
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled || isLoading}
          data-name={name}
        >
          {isLoading ? "جاري التحميل..." : displayLabel || placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="بحث..." 
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="py-6 text-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">جاري التحميل...</p>
              </div>
            ) : emptyMessage}
            {!disableCreate && searchTerm && !isLoading && (
              <Button 
                variant="ghost" 
                className="flex w-full items-center justify-start mt-2"
                onClick={() => {
                  if (onCreateNew) {
                    onCreateNew();
                  }
                  setOpen(false);
                }}
              >
                <PlusCircle className="ml-2 h-4 w-4" />
                {createNewLabel} &quot;{searchTerm}&quot;
              </Button>
            )}
          </CommandEmpty>
          {filteredOptions.length > 0 && (
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
