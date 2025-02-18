"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FaGoogle } from "react-icons/fa";
import { useEffect } from "react";

const Navbar = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            console.log("Current User Id - ", session.user.id);
        } else {
            console.log("User not logged in!");
        }
    });

    return (
        <nav className="h-[5rem] w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
            <Logo />

            <div>
                {session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:bg-gray-200">
                                <Avatar>
                                    <AvatarImage src={session.user.image || "/default-avatar.png"} />
                                    <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-lg font-semibold">{session.user.name}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-2 bg-green-500 pl-2 pr-4 py-2 rounded-full shadow-sm hover:bg-green-600"
                    >
                        <Avatar className="bg-white">
                            <AvatarFallback>
                                <FaGoogle size={20} className="text-green-500" />
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-lg font-semibold text-white">Sign In</span>
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
