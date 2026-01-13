import type {FC} from "react";

interface SectionProps {
    title: string;
    color: string;
    children: React.ReactNode;
}
const Section: FC<SectionProps> = ({ title, color, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-1.5 h-6 rounded-full ${color}`} />
            <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {children}
    </div>
);

export default Section;