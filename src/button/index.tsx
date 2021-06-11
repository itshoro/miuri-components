import React, {
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
} from "react";

const Button = forwardRef(
  (
    {
      children,
      className,
      disabled,
      onClick,
      onKeyDown,
      prefix,
      suffix,
    }: ButtonArgs,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={className}
      >
        {prefix} {children} {suffix}
      </button>
    );
  }
);

type ButtonArgs = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  onKeyDown?: KeyboardEventHandler;
};

export { Button, ButtonArgs };
