import React, {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface CommonProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface DataInputConfig {
  container?: CommonProps;
  button?: {
    component?: ReactNode;
    onClick?: () => void;
    position?: "left" | "right";
    props?: CommonProps;
  };
  components?: {
    left?: ReactNode;
    right?: ReactNode;
  };
  icons?: {
    left?: { icon: ReactNode; onClick?: () => void };
    right?: { icon: ReactNode; onClick?: () => void };
  };
  label?: CommonProps;
  input?: CommonProps;
  error?: CommonProps;
}

export interface DataInputProps extends Omit<
  ComponentPropsWithoutRef<"input"> & ComponentPropsWithoutRef<"textarea">,
  "ref" | "className" | "style"
> {
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  isTextArea?: boolean;
  label?: ReactNode;
  error?: string;
  className?: string;
  style?: CSSProperties;
  config?: DataInputConfig;
}

const DataInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, DataInputProps>(
  (
    {
      isTextArea = false,
      label,
      error,
      className,
      style,
      config,
      disabled,
      id: idProp,
      ...inputProps
    },
    ref,
  ) => {
    const id = idProp ?? useId();
    const hasError = Boolean(error);
    const isDisabled = Boolean(disabled);
    const errorId = hasError ? `${id}-error` : undefined;
    const Input = isTextArea ? "textarea" : "input";
    const btn = config?.button;
    const btnPos = btn?.position ?? "right";

    return (
      <div className={cn("flex w-full flex-col", className)} style={style}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "mb-0.5 block text-[13px] font-semibold leading-6 tracking-[-0.5px]  2xl:text-base",
              config?.label?.className,
            )}
            style={config?.label?.style}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-stretch justify-between w-full overflow-hidden border transition-all duration-200 rounded-md bg-card",
            isTextArea ? "h-27" : "h-10",
            isDisabled && "opacity-60",
            hasError
              ? "border-red-600 focus-within:border-red-600"
              : "border-border focus-within:border-brand",
            config?.container?.className,
          )}
          style={config?.container?.style}
        >



          {/* LEFT */}
          {btn &&
            btnPos === "left" &&
            (btn.component ?? (
              <button
                type="button"
                onClick={btn.onClick}
                className={cn(
                  "h-auto rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  btn.props?.className,
                )}
                style={btn.props?.style}
              >
                {btn.props?.children ?? "Add"}
              </button>
            ))}

          {config?.components?.left}
          {config?.icons?.left && (
            <button
              type="button"
              tabIndex={-1}
              onClick={config.icons.left.onClick}
              className="flex cursor-pointer items-center justify-center border-none bg-transparent p-0 pl-2.5 text-gray-500 transition-colors hover:text-gray-700"
            >
              {config.icons.left.icon}
            </button>
          )}

          {/* INPUT */}
          <Input
            ref={ref as any}
            id={id}
            aria-invalid={hasError}
            aria-describedby={errorId}
            disabled={isDisabled}
            className={cn(
              "flex-1 w-full bg-transparent placeholder:text-[#828282] focus:outline-none focus:ring-0",
              isTextArea ? "block h-full resize-none p-5" : "inline-block px-3",
              !isTextArea &&
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0",
              isDisabled && "cursor-not-allowed text-text-[#828282]",
              config?.input?.className,
            )}
            style={config?.input?.style}
            {...inputProps}
          />

          {/* RIGHT */}
          {config?.icons?.right && (
            <button
              type="button"
              tabIndex={-1}
              onClick={config.icons.right.onClick}
              className="flex cursor-pointer items-center justify-center border-none bg-transparent p-0 pr-2.5 text-gray-500 transition-colors hover:text-gray-700"
            >
              {config.icons.right.icon}
            </button>
          )}
          {config?.components?.right}
          {btn &&
            btnPos === "right" &&
            (btn.component ?? (
              <button
                type="button"
                onClick={btn.onClick}
                className={cn(
                  "h-auto rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  btn.props?.className,
                )}
                style={btn.props?.style}
              >
                {btn.props?.children ?? "Add"}
              </button>
            ))}
        </div>

        {error && (
          <p
            className={cn(
              "mt-1 text-left text-sm font-normal leading-4.5 text-red-600",
              config?.error?.className,
            )}
            style={config?.error?.style}
          >
            <span id={errorId} role="alert">
              {error}
            </span>
          </p>
        )}
      </div>
    );
  },
);

DataInput.displayName = "DataInput";

export default DataInput;
