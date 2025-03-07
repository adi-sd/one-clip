import { ReactNode } from "react";

export type ToolbarButtonComboOptionType = {
    icon: ReactNode;
    isActive: boolean;
    onClick: () => void;
    text?: string;
    disabled?: boolean;
};
