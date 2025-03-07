import React, { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ToolbarButton from "@/components/toolbar/ToolbarButton";
import { ToolbarButtonComboOptionType } from "@/types/toolbar";

export default function ToolbarButtonCombo({
    tooltip,
    trigger,
    options,
    triggerBg = true,
    squareDrop = false,
    disabled = false,
}: {
    tooltip: string;
    trigger: ReactNode;
    options: ToolbarButtonComboOptionType[];
    triggerBg?: boolean;
    squareDrop?: boolean;
    disabled?: boolean;
}) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="rounded-full group" disabled={disabled} asChild>
                        <div className="rounded-full">
                            <ToolbarButton
                                icon={trigger}
                                isActive={options.some((opt) => opt.isActive)}
                                disabled={disabled}
                                isTriggerType={triggerBg}
                            />
                        </div>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent align="center">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent
                className={`flex flex-col gap-y-1 w-auto min-w-0 p-1 ${squareDrop ? "rounded-md" : "rounded-full"}`}
                align="center"
            >
                {options.map((option, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="w-auto min-w-0 rounded-full p-0 mb-1 last:mb-0"
                        onSelect={(e) => {
                            e.preventDefault();
                            option.onClick();
                        }}
                    >
                        <ToolbarButton
                            icon={option.icon}
                            isActive={option.isActive}
                            text={option.text}
                            disabled={option.disabled}
                            squareDrop={squareDrop}
                            isTriggerType={false}
                        />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
