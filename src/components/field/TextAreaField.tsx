import type {FC} from "react";

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const TextAreaField: FC<TextAreaFieldProps> = ({
                                                   label,
                                                   value,
                                                   onChange,
                                               }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium opacity-80">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);

export default TextAreaField;