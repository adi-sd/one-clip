"use client";

import { useSession } from "next-auth/react";
import Logo from "@/components/navbar/Logo";
import UserProfileButton from "@/components/navbar/UserProfileButton";
import SignInButton from "@/components/navbar/SignInButton";
import { useEffect, useState } from "react";
import { useScreenResize } from "@/hooks/useScreenResize";

const Navbar = () => {
    const { data: session } = useSession();
    const [logoSize, setLogoSize] = useState<number>(32);
    const { isLargeScreen } = useScreenResize();

    useEffect(() => {
        setLogoSize(isLargeScreen ? 32 : 24);
    }, [isLargeScreen]);

    return (
        <nav className="h-[4rem] md:h-[5rem] w-full bg-white shadow-sm md:shadow-md py-4 px-4 flex items-center justify-between border-0 border-b-[1px] border-gray-300 sticky">
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
