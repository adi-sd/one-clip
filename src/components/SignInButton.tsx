import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

const SignInButton = ({ size = 32 }: { size: number }) => {
    const logoTextSize = Math.round(size * 0.6);

    return (
        <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 bg-green-500 pl-3 pr-4 py-3 shadow-sm rounded-full hover:bg-green-600
            "
        >
            <FaGoogle size={size} className="text-white" />
            <span className="font-bold text-white" style={{ fontSize: `${logoTextSize}` }}>
                Sign In
            </span>
        </button>
    );
};

export default SignInButton;
