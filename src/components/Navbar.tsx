"use client";

import { useSession } from "next-auth/react";
import Logo from "@/components/Logo";
import UserProfileButton from "@/components/UserProfileButton";
import SignInButton from "@/components/SignInButton";
import { useEffect, useState } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    const [logoSize, setLogoSize] = useState(32);

    useEffect(() => {
        const handleResize = () => {
            setLogoSize(window.innerWidth >= 1024 ? 32 : 25);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="h-[5rem] w-full bg-white shadow-sm md:shadow-md py-4 px-4 flex items-center justify-between border-0 border-b-[1px] border-gray-300">
            <Logo size={logoSize} />
            {session?.user ? (
                <UserProfileButton user={session.user} size={logoSize} />
            ) : (
                <SignInButton size={logoSize} />
            )}
        </nav>
    );
};

export default Navbar;
