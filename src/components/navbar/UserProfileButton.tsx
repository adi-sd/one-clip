import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DefaultUser } from "next-auth";
import Image from "next/image";

const UserProfileButton = ({ user, size = 32 }: { user: DefaultUser; size: number }) => {
    const logoTextSize = Math.round(size * 0.6); // Adjust text size relative to size
    const menuTextSize = Math.round(size * 0.5); // Adjust text size relative to size
    const avatarSize = size; // Avatar size matches passed size

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full shadow-sm hover:bg-gray-200 border border-gray-300 outline-0">
                    {/* <Avatar>
                        <AvatarImage src={user.image || "/default-avatar.png"} height={avatarSize} width={avatarSize} />
                        <AvatarFallback style={{ fontSize: `${logoTextSize}px` }}>
                            {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar> */}
                    <Image
                        src={user.image || "/default-avatar.png"}
                        alt="User Profile Image"
                        height={avatarSize}
                        width={avatarSize}
                        className="rounded-full"
                    ></Image>
                    <span className="font-semibold text-nowrap" style={{ fontSize: `${logoTextSize}px` }}>
                        {user.name}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel style={{ fontSize: `${menuTextSize}px` }}>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileButton;
