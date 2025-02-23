import React, { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ToolbarButtonCombo({
    tooltip,
    trigger,
    options,
}: {
    tooltip: string;
    trigger: ReactNode;
    options: ReactNode[];
}) {
    return (
        <DropdownMenu>
            {/* ✅ Tooltip now only wraps the dropdown trigger */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-auto min-w-0 rounded-full p-1" align="center">
                {options.map((option, index) => (
                    <DropdownMenuItem
                        key={`toolbar-button-combo-for-${tooltip}-${index}`}
                        className="p-2 rounded-full"
                        asChild
                    >
                        {option}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
