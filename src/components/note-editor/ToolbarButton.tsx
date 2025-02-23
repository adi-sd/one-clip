import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode; // Icon component (e.g., FaBold, FaItalic)
    tooltip?: string; // Tooltip text
    isActive: boolean;
    onClick?: () => void; // Pass click handler from parent
}

const ToolbarButton = ({ icon, tooltip, isActive, onClick }: ToolbarButtonProps) => {
    return (
        <>
            {tooltip ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            {...(onClick ? { onClick } : {})}
                            className={`p-2 rounded-full ${isActive ? "bg-gray-300" : "hover:bg-gray-300"}`}
                        >
                            {icon}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent align="center">
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            ) : (
                <button
                    {...(onClick ? { onClick } : {})}
                    className={`p-2 rounded-full ${isActive ? "bg-gray-300" : "hover:bg-gray-300"}`}
                >
                    {icon}
                </button>
            )}
        </>
    );
};

export default ToolbarButton;
