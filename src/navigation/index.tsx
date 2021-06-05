import React, {
  ReactNode,
  useEffect,
  useCallback,
  useRef,
  useState,
  VoidFunctionComponent,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../button/index";
import { Link } from "./link";

const sectionPaddingX = undefined;

const Navigation = ({
  children,
  links,
  className,
  routeChangeCompleteCallback,
}: NavigationArgs) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (routeChangeCompleteCallback)
      router.events.on("routeChangeComplete", routeChangeCompleteCallback);
    return () => {
      if (routeChangeCompleteCallback)
        router.events.off("routeChangeComplete", routeChangeCompleteCallback);
    };
  }, [router]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.stopPropagation();

    switch (event.key) {
      case "Escape":
        setMenuExpanded(false);
        buttonRef?.current?.focus();
        break;
    }
  }, []);

  return (
    <nav
      className={[
        "fixed w-full z-10 bg-black text-white duration-500 ease-in-out backdrop-filter backdrop-blur-lg backdrop-saturate-150",
        menuExpanded ? "h-screen bg-opacity-100" : "h-12 bg-opacity-40",
        "md:h-12",
        className,
      ]
        .filter((x) => x)
        .join(" ")}
      style={{ transitionProperty: "height,background" }}
      onKeyDown={handleKeyDown}
    >
      <div className="md:h-12 md:flex md:justify-between md:items-center mx-auto">
        <div
          className={["flex items-center justify-between py-3", sectionPaddingX]
            .filter((x) => x)
            .join(" ")}
        >
          <div className="w-4 h-auto z-50">{children}</div>
          <Button
            ref={buttonRef}
            className={["rounded md:hidden hover:bg-white hover:bg-opacity-20 "]
              .filter((x) => x)
              .join(" ")}
            onClick={() => {
              setMenuExpanded(!menuExpanded);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <path
                  d="M4 6h16M4"
                  className={[
                    "transform-gpu transition-transform duration-500 origin-center",
                    menuExpanded &&
                      "rotate-45 translate-x-[-4px] translate-y-[4px]",
                  ]
                    .filter((x) => x)
                    .join(" ")}
                />
                <path
                  d="M4 12h16M4"
                  className={[
                    menuExpanded && "opacity-0",
                    "transition-opacity duration-500",
                  ]
                    .filter((x) => x)
                    .join(" ")}
                />
                <path
                  d="M4 18h16"
                  className={[
                    "transform-gpu transition-transform duration-500 origin-center",
                    menuExpanded &&
                      "-rotate-45 translate-x-[-4px] translate-y-[-5px]",
                  ]
                    .filter((x) => x)
                    .join(" ")}
                />
              </g>
            </svg>
          </Button>
        </div>
        <div
          className={[
            "md:py-0 border-t md:border-none transition-colors",
            menuExpanded ? "border-accent py-3" : "border-transparent h-0",
            "md:h-auto",
          ]
            .filter((x) => x)
            .join(" ")}
        >
          <ul
            id="siteNav"
            className={[
              "flex flex-col items-start md:flex-row md:space-x-4 md:justify-end",
              !menuExpanded && "h-0",
              "md:h-auto",
              sectionPaddingX,
            ]
              .filter((x) => x)
              .join(" ")}
            style={{ transitionProperty: "height" }}
          >
            {links.map(({ title, href }, i) => (
              <li
                key={"mainNav" + i}
                style={{
                  transitionDelay: "500ms",
                  transitionDuration: `${250 + i * 150}ms`,
                  transitionProperty: "transform,opacity",
                }}
                className={[
                  "transform transition ease-in-out",
                  !menuExpanded
                    ? "invisible opacity-0 -translate-y-8"
                    : "visible opacity-100 translate-y-0",
                  "md:visible md:opacity-100 md:translate-y-0",
                ]
                  .filter((x) => x)
                  .join(" ")}
              >
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

type NavigationArgs = {
  children: ReactNode;
  links: NavLinkArgs[];
  className?: string;
  routeChangeCompleteCallback?: VoidFunctionComponent;
};

type NavLinkArgs = {
  title: string;
  href: string;
};

export { Navigation, NavigationArgs, NavLinkArgs };
