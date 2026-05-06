type OptionValue = string | undefined;

export function FilterSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
  className,
}: {
  label: string;
  value: OptionValue;
  options: string[];
  placeholder: string;
  onChange: (value: string | undefined) => void;
  className: string;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        className={className}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
