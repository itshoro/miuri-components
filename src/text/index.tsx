import React from "react";
import { CSSProperties, ReactNode } from "react";

// const sizeToTailwindClass = {
//   12: "text-xs",
//   14: "text-sm",
//   16: "text-base",
//   20: "text-lg",
//   24: "text-xl",
//   32: "text-2xl",
//   40: "text-3xl",
//   48: "text-4xl",
//   64: "text-5xl",
//   96: "text-6xl",
// };

const alignToTailwindClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const colorToTailwindClass = {
  foreground: "text-foreground",
  background: "text-background",
  skeleton_background: "text-skeleton_background",
  skeleton_foreground: "text-skeleton_foreground",
  accent: "text-accent",
  secondary: "text-secondary",
};

const weightToTailwindClass = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const Text = ({
  as,
  align,
  children,
  className,
  color,
  // size = 14,
  style,
  transform,
  truncate = false,
  weight,
}: TextArgs) => {
  const TextTag = as;

  return (
    <TextTag
      className={[
        className,
        color && colorToTailwindClass[color],
        // size && sizeToTailwindClass[size],
        weight && weightToTailwindClass[weight],
        align && alignToTailwindClass[align],
        transform,
        truncate && "truncate",
      ]
        .filter((x) => x)
        .join(" ")}
      style={style}
    >
      {children}
    </TextTag>
  );
};

type TextArgs = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  align?: "left" | "center" | "right";
  children?: ReactNode;
  color?:
    | "foreground"
    | "background"
    | "skeleton_background"
    | "skeleton_foreground"
    | "accent"
    | "secondary";
  className?: string;
  // size?: 12 | 14 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 96;
  style?: CSSProperties;
  transform?: "lowercase" | "uppercase" | "capitalize";
  truncate?: boolean;
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
};

export { Text, TextArgs };
