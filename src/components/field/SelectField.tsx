interface SelectFieldProps<T extends string> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: { value: T; label: string }[];
}

const SelectField = <T extends string>({
                                           label,
                                           value,
                                           onChange,
                                           options,
                                       }: SelectFieldProps<T>) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export default SelectField;