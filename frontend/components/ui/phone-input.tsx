"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PhoneCountry = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "MA", name: "Maroc", dialCode: "+212", flag: "🇲🇦" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "DZ", name: "Algérie", dialCode: "+213", flag: "🇩🇿" },
  { code: "TN", name: "Tunisie", dialCode: "+216", flag: "🇹🇳" },
  { code: "ES", name: "Espagne", dialCode: "+34", flag: "🇪🇸" },
  { code: "BE", name: "Belgique", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", dialCode: "+41", flag: "🇨🇭" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "CI", name: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "SN", name: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { code: "AE", name: "Émirats arabes unis", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Arabie saoudite", dialCode: "+966", flag: "🇸🇦" },
  { code: "GB", name: "Royaume-Uni", dialCode: "+44", flag: "🇬🇧" },
  { code: "US", name: "États-Unis", dialCode: "+1", flag: "🇺🇸" },
];

const DEFAULT_COUNTRY = PHONE_COUNTRIES[0];

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

  return { country: DEFAULT_COUNTRY, national: trimmed.replace(/^\+/, "") };
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
  const { country, national } = splitValue(value);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next =
      PHONE_COUNTRIES.find((item) => item.code === event.target.value) ??
      DEFAULT_COUNTRY;
    onChange(national ? `${next.dialCode} ${national}` : next.dialCode);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNational = event.target.value;
    onChange(nextNational ? `${country.dialCode} ${nextNational}` : "");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <select
        aria-label="Indicatif pays"
        value={country.code}
        onChange={handleCountryChange}
        className="h-11 shrink-0 rounded-md border border-wl-border bg-transparent px-2 text-sm text-wl-text shadow-xs outline-none focus-visible:border-wl-blue focus-visible:ring-[3px] focus-visible:ring-wl-blue/25"
      >
        {PHONE_COUNTRIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.flag} {item.dialCode}
          </option>
        ))}
      </select>
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
