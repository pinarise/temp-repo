import { cn } from "@/lib/utils";
import { IConType } from "@/types/icons";

const NgFlagIcon = ({ className, style }: IConType) => {
  return (
    <svg
      viewBox="0 0 24 16"
      className={cn("h-4 w-6 rounded-sm overflow-hidden", className)}
      style={style}
    >
      <rect width="8" height="16" fill="#008751" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#008751" />
    </svg>
  );
};

export default NgFlagIcon;
