import { BsClipboardFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const Logo = ({ size = 32, className = "" }) => {
    const textSize = Math.round(size * 0.7); // Adjust text size relative to icon size

    return (
        <div className={twMerge("flex items-center gap-2 text-nowrap", className)}>
            <BsClipboardFill size={size} />
            <span className="font-bold ml-1" style={{ fontSize: `${textSize}px` }}>
                One-Clip
            </span>
        </div>
    );
};

export default Logo;
