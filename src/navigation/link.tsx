import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Link = ({ href, children }: LinkArgs) => {
  const router = useRouter();
  const isCurrentPage = router?.pathname === href;

  return (
    <NextLink href={href}>
      <a
        className={[
          "font-medium",
          isCurrentPage ? "text-foreground" : "text-secondary",
        ]
          .filter((x) => x)
          .join(" ")}
      >
        {children}
      </a>
    </NextLink>
  );
};

type LinkArgs = {
  href: string;
  children: ReactNode;
};

export { Link, LinkArgs };
