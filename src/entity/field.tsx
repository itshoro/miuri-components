import React, { ReactNode } from "react";
import { Skeleton } from "../skeleton";
import { Text } from "../text";

const EntityField = ({
  title,
  description,
  align,
  loading = false,
}: EntityFieldArgs) => {
  const alignClass =
    align &&
    {
      left: "items-start text-left",
      center: "items-center text-center",
      right: "items-end text-right",
    }[align];

  return (
    <div
      className={["flex-1 flex flex-col min-w-0", alignClass]
        .filter((x) => x)
        .join(" ")}
    >
      <Skeleton show={loading}>
        <Text weight="semibold" as="div">
          {title}
        </Text>
      </Skeleton>
      <Skeleton show={loading}>
        <Text as="div" truncate={true}>
          {description}
        </Text>
      </Skeleton>
    </div>
  );
};

type EntityFieldArgs = {
  title?: string;
  description?: string;
  align?: "left" | "center" | "right";
  loading?: boolean;
};

export { EntityField, EntityFieldArgs };
