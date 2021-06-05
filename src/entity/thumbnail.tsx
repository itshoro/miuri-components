import React, { ReactNode } from "react";

const EntityThumbnail = ({ className, children }: EntityThumbnailArgs) => {
  return (
    <div className={["flex-auto", className].filter((x) => x).join(" ")}>
      {children}
    </div>
  );
};

type EntityThumbnailArgs = {
  className?: string;
  children?: ReactNode;
};

export { EntityThumbnail, EntityThumbnailArgs };
