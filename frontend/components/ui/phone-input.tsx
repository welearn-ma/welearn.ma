"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  DEFAULT_PHONE_COUNTRY,
  flagUrl,
  PHONE_COUNTRIES,
  type PhoneCountry,
} from "@/lib/phone-countries";

const SORTED_BY_DIAL_CODE_LENGTH = [...PHONE_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
);

function splitValue(value: string): {
  country: PhoneCountry;
  national: string;
} {
  const trimmed = value.trim();

  for (const country of SORTED_BY_DIAL_CODE_LENGTH) {
    if (trimmed.startsWith(country.dialCode)) {
      return {
        country,
        national: trimmed.slice(country.dialCode.length).trim(),
      };
    }
  }

  return {
    country: DEFAULT_PHONE_COUNTRY,
    national: trimmed.replace(/^\+/, ""),
  };
}

function FlagIcon({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <span
        className={cn(
          "inline-flex h-3.5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-wl-gray-light text-[8px] font-semibold text-wl-text-tertiary",
          className,
        )}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={flagUrl(code)}
      alt=""
      width={20}
      height={14}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] object-cover", className)}
    />
  );
}

type PhoneInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

export function PhoneInput({
  id,
  value,
  onChange,
  required,
  className,
  ...rest
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const { country, national } = splitValue(value);

  const selectCountry = (next: PhoneCountry) => {
    onChange(national ? `${next.dialCode} ${national}` : next.dialCode);
    setOpen(false);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNational = event.target.value;
    onChange(nextNational ? `${country.dialCode} ${nextNational}` : "");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Indicatif pays"
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-wl-border bg-transparent px-2.5 text-sm text-wl-text shadow-xs outline-none focus-visible:border-wl-blue focus-visible:ring-[3px] focus-visible:ring-wl-blue/25"
          >
            <FlagIcon code={country.code} />
            <span className="tabular-nums">{country.dialCode}</span>
            <ChevronDown className="h-3.5 w-3.5 text-wl-text-tertiary" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <Command
            filter={(itemValue, search) =>
              itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
            }
          >
            <CommandInput placeholder="Rechercher un pays..." />
            <CommandList>
              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
              <CommandGroup>
                {PHONE_COUNTRIES.map((item) => (
                  <CommandItem
                    key={item.code}
                    value={`${item.name} ${item.dialCode} ${item.code}`}
                    onSelect={() => selectCountry(item)}
                  >
                    <FlagIcon code={item.code} />
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="text-wl-text-tertiary tabular-nums">
                      {item.dialCode}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        item.code === country.code
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        value={national}
        onChange={handleNumberChange}
        required={required}
        className="h-11 w-full min-w-0 rounded-md border border-wl-border bg-transparent px-3 py-1 text-base text-wl-text shadow-xs outline-none placeholder:text-wl-text-tertiary focus-visible:border-wl-blue focus-visible:ring-[3px] focus-visible:ring-wl-blue/25 md:text-sm"
        {...rest}
      />
    </div>
  );
}
