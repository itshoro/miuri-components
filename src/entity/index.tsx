import React, { ReactNode } from "react";
import { EntityField, EntityFieldArgs } from "./field";
import { EntityThumbnail, EntityThumbnailArgs } from "./thumbnail";

const Entity = ({ children, className }: EntityArgs) => {
  return (
    <div
      className={["flex flex-col sm:flex-row justify-between", className]
        .filter((x) => x)
        .join(" ")}
    >
      {children}
    </div>
  );
};

type EntityArgs = {
  children?: ReactNode;
  className?: string;
};

export {
  Entity,
  EntityArgs,
  EntityField,
  EntityFieldArgs,
  EntityThumbnail,
  EntityThumbnailArgs,
};
