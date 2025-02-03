"use client";

import { Toaster } from "sonner";

export const ToasterProvider = () => {
    return <Toaster position="bottom-center" richColors duration={1500} />;
};
