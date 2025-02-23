import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    // Format options for "13 Feb, 2025, 02:30 PM"
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Forces 12-hour format with AM/PM
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
};

export const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);

    // Format options for "MM/DD/YY, hh:mm AM/PM"
    const options: Intl.DateTimeFormatOptions = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Ensures 12-hour format with AM/PM
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
};
