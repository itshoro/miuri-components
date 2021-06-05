import React, { forwardRef, MouseEventHandler, ReactNode, Ref } from "react";

const Button = forwardRef(
  (
    { children, className, disabled, onClick, prefix, suffix }: ButtonArgs,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
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
};

export { Button, ButtonArgs };
