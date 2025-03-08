import { useEffect, useState } from "react";

export const useScreenResize = () => {
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);
    const [isDialogAllowed, setIsDialogAllowed] = useState<boolean>(false);

    // For Screen Sizing Utility
    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth > 1024; // lg breakpoint
            setIsLargeScreen(isLarge);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isLargeScreen) {
            setIsDialogAllowed(false);
        } else {
            setIsDialogAllowed(true);
        }
    }, [isLargeScreen]);

    return { isLargeScreen, isDialogAllowed };
};
