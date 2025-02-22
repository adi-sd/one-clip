"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/modals/AuthModal";

interface AuthModalContextType {
    openAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated" && isFirstLoad) {
            setIsAuthModalOpen(true);
            setIsFirstLoad(false);
        }
    }, [status, isFirstLoad]);

    const openAuthModal = () => {
        setIsAuthModalOpen(true);
    };

    return (
        <AuthModalContext.Provider value={{ openAuthModal }}>
            {children}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </AuthModalContext.Provider>
    );
};

export const useAuthModal = () => {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return context;
};
