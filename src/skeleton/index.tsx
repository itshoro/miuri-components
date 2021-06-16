import React, { ReactNode } from "react";
import style from "./index.module.css";

const Skeleton = ({ children, className, show = true }: SkeletonArgs) => {
  if (children && !show) return <>{children}</>;

  return (
    <span
      className={[style.skeleton, "rounded inline-block select-none", className]
        .filter((x) => x)
        .join(" ")}
    >
      {children}
    </span>
  );
};

type SkeletonArgs = {
  children?: ReactNode;
  className?: string;
  show?: boolean;
};

export { Skeleton, SkeletonArgs };
