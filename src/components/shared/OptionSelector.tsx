import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import ReactSelect from "react-select";
import { DashLoading } from "respinner";
import { cn } from "@/lib/utils";
import { ChevronDown, RotateCw } from "lucide-react";

interface CommonProps {
  className?: string;
  style?: CSSProperties;
}

export interface OptionSelectorConfig {
  container?: CommonProps;
  label?: CommonProps;
  input?: CommonProps;
  error?: CommonProps;
  control?: CommonProps;
  singleValue?: CommonProps;
  placeholder?: CommonProps;
  option?: CommonProps;
  menu?: CommonProps;
  menuList?: CommonProps;
  multiValue?: CommonProps;
  multiValueLabel?: CommonProps;
  multiValueRemove?: CommonProps;
  components?: any;
}

export interface OptionSelectorRef {
  focus: () => void;
  blur: () => void;
  clearValue: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  getValue: () => any;
}

export interface OptionSelectorProps {
  options: any;
  value?: any;
  placeholder?: string;
  label?: string | ReactNode;
  onChange: (...event: any[]) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  error?: string | ReactNode;
  isClearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  menuPlacement?: "bottom" | "top" | "auto";
  loadingText?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  config?: OptionSelectorConfig;
}

const OptionSelector = forwardRef<OptionSelectorRef, OptionSelectorProps>(
  (
    {
      options,
      value,
      placeholder,
      label,
      onChange,
      disabled,
      className,
      style,
      error,
      isClearable,
      multiple,
      loading = false,
      menuPlacement = "auto",
      loadingText = "Loading...",
      onRetry,
      showRetry = false,
      config,
    },
    ref,
  ) => {
    const selectRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      focus: () => selectRef.current?.focus(),
      blur: () => selectRef.current?.blur(),
      clearValue: () => selectRef.current?.clearValue(),
      openMenu: () => selectRef.current?.openMenu("first"),
      closeMenu: () => selectRef.current?.blur(),
      getValue: () => selectRef.current?.getValue(),
    }));

    const inputStyles = {
      singleValue: (base: any) => ({
        ...base,
        fontSize: 14,
        fontWeight: 500,
        color: "var(--color-foreground)",
        ...config?.singleValue?.style,
      }),
      control: (base: any, { isDisabled }: any) => ({
        ...base,
        border: "none",
        outline: "none",
        boxShadow: "none",
        height: "100%",
        borderRadius: 0, 
        background: "transparent",
        opacity: isDisabled || loading ? 0.6 : 1,
        cursor: isDisabled || loading ? "not-allowed" : "default",
        position: "relative", 
        ...config?.control?.style,
      }),
      placeholder: (base: any) => ({
        ...base,
        fontSize: 14,
        fontWeight: 500,
        color: "var(--color-muted-foreground)",
        ...config?.placeholder?.style,
      }),
      option: (base: any, { isSelected }: any) => ({
        ...base,
        fontSize: 14,
        fontWeight: 500,
        transition: "all 300ms ease",
        cursor: loading ? "not-allowed" : "pointer",
        borderRadius: 10,
        color: isSelected ? "white" : "var(--color-foreground)",
        background: isSelected ? "var(--color-primary)" : "transparent",
        ":hover": {
          backgroundColor: isSelected ? "var(--color-primary)" : "var(--color-muted)",
          color: isSelected ? "white" : "var(--color-primary)",
          cursor: loading ? "not-allowed" : "pointer",
        },
        ...config?.option?.style,
      }),
      menu: (base: any) => ({
        ...base,
        background: "var(--color-card)",
        borderRadius: 20,
        ...config?.menu?.style,
      }),
      menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
      menuList: (base: any) => ({
        ...base,
        padding: 10,
        ...config?.menuList?.style,
      }),
      multiValue: (base: any) => ({
        ...base,
        backgroundColor: "var(--color-primary)",
        borderRadius: 20,
        overflow: "hidden",
        ...config?.multiValue?.style,
      }),
      multiValueLabel: (base: any) => ({
        ...base,
        color: "white",
        ...config?.multiValueLabel?.style,
      }),
      multiValueRemove: (base: any) => ({
        ...base,
        color: "white",
        ":hover": {
          backgroundColor: "var(--color-destructive)",
          color: "white",
          cursor: "pointer",
        },
        ...config?.multiValueRemove?.style,
      }),
      loadingIndicator: () => ({ display: "none" }),
      loadingMessage: (base: any) => ({
        ...base,
        fontSize: 14,
        fontWeight: 500,
        color: "var(--color-muted-foreground)",
        textAlign: "center",
        padding: "10px",
      }),
      input: (base: any) => ({
        ...base,
        color: "var(--color-foreground)",
        fontWeight: 500,
      }),
    };

    const DropdownIndicator = (props: any) => {
      if (loading) {
        return (
          <div className="flex items-center px-2">
            <DashLoading
              duration={1.6}
              size={16}
              opacity={1}
              stroke="var(--color-primary)"
              strokeWidth={1.5}
            />
          </div>
        );
      }
      if (showRetry && onRetry) {
        return (
          <button
            type="button"
            className="flex items-center justify-center rounded p-1 transition-colors hover:bg-red-500/10 active:bg-red-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            title="Retry"
          >
            <RotateCw/>
          </button>
        );
      }
      return (
        <div className="flex items-center justify-center px-2 text-muted-foreground">
            <ChevronDown/> 
        </div>
      );
    };

    const LoadingMessage = (props: any) => (
      <div className="flex items-center justify-center gap-2 p-4">
        <DashLoading
          duration={1.6}
          size={20}
          opacity={1}
          stroke="var(--color-primary)"
          strokeWidth={1.5}
        />
        <span className="text-sm font-medium text-muted-foreground">{loadingText}</span>
      </div>
    );

    const NoOptionsMessage = (props: any) => {
      if (showRetry && onRetry) {
        return (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <span className="text-sm font-medium text-muted-foreground mb-2">
              Failed to load options
            </span>
            <button
              type="button"
              className="bg-destructive text-white text-xs font-medium px-3 py-1.5 rounded-md transition-opacity hover:opacity-90"
              onClick={onRetry}
            >
              Retry
            </button>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center text-sm font-medium text-muted-foreground">
          No options available
        </div>
      );
    };

    return (
      <div className={cn("relative text-left", className)} style={style}>
        {label && (
          <label
            className={cn( 
              "mb-0.5 block text-[13px] font-semibold leading-6 tracking-[-0.5px]  2xl:text-base", 
              loading && "opacity-70",
              config?.label?.className,
            )}
            style={config?.label?.style}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative h-10 rounded-md border bg-card transition-all duration-200",
            multiple && "h-auto min-h-14",
            error ? "border-destructive" : "border-border",
            loading && "border-primary opacity-80",
            showRetry && "border-destructive",
            disabled && "opacity-60 cursor-not-allowed",
            config?.container?.className,
          )}
          style={config?.container?.style}
        >

          <ReactSelect
            ref={selectRef}
            options={loading ? [] : options}
            value={value}
            placeholder={loading ? loadingText : placeholder}
            onChange={onChange}
            isDisabled={disabled || loading}
            styles={inputStyles}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator,
              LoadingMessage: loading ? LoadingMessage : undefined,
              NoOptionsMessage,
              ...config?.components,
            }}
            className={cn("h-full", config?.input?.className)}
            classNamePrefix="os"
            isClearable={isClearable && !loading}
            isMulti={multiple}
            menuPlacement={menuPlacement}
            isLoading={loading}
            loadingMessage={() => loadingText}
          />
        </div>

        {error && (
          <p
            className={cn(
              "mt-1 text-left text-sm font-normal leading-4.5 text-destructive",
              config?.error?.className,
            )}
            style={config?.error?.style}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
); 

export default OptionSelector;
