import React from "react";
import { cn } from "@/lib/utils";
import UserIcon from "../icons/User";
import { getInitials, stringToColor } from "@/lib/user";
import Image from "next/image";

export interface IAvatarProps {
  imageSrc?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  className?: string;
  onClick?: () => void;
  userId?: string; 
}
const Avatar: React.FC<IAvatarProps> = ({
  imageSrc,
  name,
  size = "md",
  className,
  onClick,
  userId,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
    xxl: "h-[108px] w-[108px] text-xl",
  };

  const sizePixels = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 108,
  }[size];

  const bgColor = userId 
    ? stringToColor(userId)
    : name 
    ? stringToColor(name)
    : "bg-gray-200"; // Fallback

  const avatarClasses = cn(
    "rounded-full flex items-center justify-center text-gray-600 font-medium overflow-hidden select-none",
    !imageSrc && typeof bgColor === 'string' && !bgColor.startsWith('bg-') 
      ? `bg-[${bgColor}]` 
      : bgColor,
    sizeClasses[size],
    className,
    onClick && "cursor-pointer"
  );

  return (
    <div 
      className={avatarClasses} 
      onClick={onClick}
      style={!imageSrc && bgColor.startsWith('hsl') ? { backgroundColor: bgColor } : {}}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name ? `${name}'s avatar` : "Avatar"}
          width={sizePixels}
          height={sizePixels}
          className="w-full h-full object-cover"
          unoptimized={imageSrc.startsWith('http')}
          priority={false}
        />
      ) : name ? (
        <span className="text-white font-semibold">
          {getInitials(name)}
        </span>
      ) : (
        <UserIcon className={size === "xxl" ? "w-3/4 h-3/4" : "w-1/2 h-1/2"} />
      )}
    </div>
  );
};

export default Avatar;