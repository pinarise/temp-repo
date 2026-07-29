import { CSSProperties } from "react";

export interface IConType {
  className?: string;
  width?: string | number | null;
  height?: string | number | null;
  color?: string;
  size?: string | number | null;
  fill?: string;
  style?: CSSProperties;
  strokeWidth?: string | number;
}
