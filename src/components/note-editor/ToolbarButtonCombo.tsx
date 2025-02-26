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
                {/* ✅ Ensure Tooltip doesn't interfere with dropdown */}
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <ToolbarButton icon={trigger} isActive={options.some((opt) => opt.isActive)} />
                        </div>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-auto min-w-0 rounded-full p-1" align="center">
                {options.map((option, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="w-auto min-w-0 rounded-full p-0 mb-1 last:mb-0"
                        onSelect={(e) => {
                            e.preventDefault(); // ✅ Prevent dropdown from closing immediately
                            option.onClick();
                        }}
                    >
                        <ToolbarButton icon={option.icon} isActive={option.isActive} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
