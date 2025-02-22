"use client";

import { useSession, signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Logo from "@/components/navbar/Logo";
import { FaGoogle } from "react-icons/fa";

const AuthModal = ({ onClose }: { onClose?: () => void }) => {
    const { data: session } = useSession();

    return (
        <Dialog open={!session} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
            <DialogContent className="w-full flex flex-col items-center justify-center max-w-sm text-center p-6 space-y-4 rounded-md">
                <DialogHeader className="w-full space-y-3 flex items-center justify-center">
                    <Logo size={50} className="mb-4" />
                    <div className="w-full h-[3px] rounded-lg bg-gray-200 mb-6"></div>
                    <DialogTitle className="text-2xl font-semibold">Welcome to One-Clip!</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Please sign in with Google to continue.
                    </DialogDescription>
                </DialogHeader>
                <button
                    onClick={() => signIn("google")}
                    className="w-full max-w-xs bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-x-3 text-lg"
                >
                    <FaGoogle size={24} />
                    <span>Sign in with Google</span>
                </button>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
