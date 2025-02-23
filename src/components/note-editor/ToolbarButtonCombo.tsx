import React, { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ToolbarButton from "@/components/note-editor/ToolbarButton";

export default function ToolbarButtonCombo({
    tooltip,
    trigger,
    options,
}: {
    tooltip: string;
    trigger: ReactNode;
    options: { icon: ReactNode; isActive: boolean; onClick: () => void }[];
}) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* ✅ Wrap ToolbarButton inside DropdownMenuTrigger properly */}
                    <DropdownMenuTrigger className="outline-0" asChild>
                        <button>
                            <ToolbarButton icon={trigger} isActive={options.some((opt) => opt.isActive)} />
                        </button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-auto min-w-0 rounded-full p-1" align="center">
                {options.map((option, index) => (
                    <DropdownMenuItem className="w-auto min-w-0 rounded-full p-0 mb-1 last:mb-0" key={index} asChild>
                        <button onClick={option.onClick}>
                            <ToolbarButton icon={option.icon} isActive={option.isActive} />
                        </button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
