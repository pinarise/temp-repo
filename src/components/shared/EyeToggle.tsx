import React from "react"; 
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface EyeToggleProps {
  value: boolean;
  onToggle: (_: boolean) => void;
  style?: React.CSSProperties;
  iconSize?: string | number;
  className?: string;
}

const EyeToggle = ({ onToggle, value, style, iconSize = 14, className }: EyeToggleProps) => {
  return (
    <div
      onClick={() => onToggle(!value)}
      className={cn(
        "flex cursor-pointer items-center justify-center text-muted-foreground transition-all duration-300 ease-in-out hover:text-foreground hover:opacity-80",
        className
      )}
      style={style}
    >
      {value ?  <Eye size={iconSize} />:  <EyeOff size={iconSize} />}
    </div>
  );
};

export default EyeToggle;