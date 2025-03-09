import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    tooltip?: string;
    isActive: boolean;
    onClick?: () => void;
    text?: string;
    squareDrop?: boolean;
    disabled?: boolean;
    isTriggerType?: boolean;
}

const ToolbarButton = ({
    icon,
    tooltip,
    isActive,
    onClick,
    text,
    squareDrop,
    disabled = false,
    isTriggerType = false,
}: ToolbarButtonProps) => {
    return (
        <>
            {tooltip ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            disabled={disabled}
                            {...(onClick ? { onClick } : {})}
                            className={`pointer-events-auto disabled:cursor-not-allowed p-2 rounded-full disabled:text-gray-400
                            ${isTriggerType ? "bg-gray-100" : ""}
                            ${isActive ? "bg-gray-300" : "hover:bg-gray-300"}`}
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
                    disabled={disabled}
                    {...(onClick ? { onClick } : {})}
                    className={`pointer-events-auto p-2 disabled:cursor-not-allowed h-full w-full disabled:text-gray-400
                    ${isTriggerType ? "bg-gray-100" : ""} 
                    ${isActive ? "bg-gray-300" : "hover:bg-gray-300"} 
                    ${squareDrop ? "rounded-md" : "rounded-full"}`}
                >
                    <div className="h-full w-full flex items-center justify-start gap-x-3">
                        {icon}
                        {text && <span>{text}</span>}
                    </div>
                </button>
            )}
        </>
    );
};

export default ToolbarButton;
