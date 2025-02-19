import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DefaultUser } from "next-auth";

const UserButton = ({ user, size = 32 }: { user: DefaultUser; size: number }) => {
    const textSize = Math.round(size * 0.6); // Adjust text size relative to size
    const avatarSize = size; // Avatar size matches passed size

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-gray-100 px-2 py-2 rounded-full shadow-sm hover:bg-gray-200">
                    <Avatar>
                        <AvatarImage src={user.image || "/default-avatar.png"} height={avatarSize} width={avatarSize} />
                        <AvatarFallback style={{ fontSize: `${textSize}px` }}>
                            {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold" style={{ fontSize: `${textSize}px` }}>
                        {user.name}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel style={{ fontSize: `${textSize}px` }}>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
