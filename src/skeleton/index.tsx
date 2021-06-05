import React, { ReactNode } from "react";

const Skeleton = ({ children, className, show = true }: SkeletonArgs) => {
  if (children && !show) return <>{children}</>;

  return (
    <span
      className={["skeleton rounded inline-block select-none", className]
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
