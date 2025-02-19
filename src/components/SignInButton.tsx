import { signIn } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaGoogle } from "react-icons/fa";

const SignInButton = ({ size }: { size: number }) => {
    return (
        <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 bg-green-500 px-2 py-2 rounded-full shadow-sm hover:bg-green-600
            "
        >
            <Avatar className="bg-white">
                <AvatarFallback>
                    <FaGoogle size={size} className="text-green-500" />
                </AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold text-white">Sign In</span>
        </button>
    );
};

export default SignInButton;
