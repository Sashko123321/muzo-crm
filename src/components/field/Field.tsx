import type {FC} from "react";

interface FieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    inputClass: string;
    type?: React.HTMLInputTypeAttribute;
}
const Field: FC<FieldProps> = ({ label, value, onChange, inputClass, type = "text" }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium opacity-80">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={inputClass}
        />
    </div>
);

export default Field;