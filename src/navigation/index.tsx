import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../button/index";
import { Link } from "./link";
import { useWindowEvent } from "../hooks/useWindowEvent";

const Navigation = ({
  children,
  links,
  position,
  className,
  routeChangeCompleteCallback,
}: NavigationArgs) => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const hoveredItem = useRef(-1);
  const router = useRouter();

  useWindowEvent("keydown", (event) => {
    if (event.key === "Escape") {
      hoveredItem.current = -1;
      setMenuExpanded(false);
    }
  });

  const handleRouteChangeComplete = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (routeChangeCompleteCallback)
      routeChangeCompleteCallback(url, { shallow });
    setMenuExpanded(false);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  const handleKeyDownButton = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        setMenuExpanded(false);
        buttonRef?.current?.focus();
        break;

      case "Enter":
        // For some reason the Enter key seems to have some default behaviour.
        // I can handle it to some degree, e.g. do `console.log`, however updating state
        // doesn't work.
        event.preventDefault();
        event.stopPropagation();

        const nextMenu = !menuExpanded;
        setMenuExpanded((menuExpanded) => !menuExpanded);

        if (nextMenu) {
          hoveredItem.current = 0;
          requestAnimationFrame(() => {
            linksRef?.current
              ?.querySelectorAll("a")
              [hoveredItem.current].focus();
          });
        }
    }
  };

  const handleKeyDownItems = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();

        hoveredItem.current = -1;
        setMenuExpanded(false);

        requestAnimationFrame(() => {
          buttonRef?.current?.focus();
        });

      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();

        if (hoveredItem.current - 1 < 0) hoveredItem.current = links.length - 1;
        else hoveredItem.current--;
        console.log(hoveredItem);

        requestAnimationFrame(() => {
          linksRef?.current
            ?.querySelectorAll("a")
            [hoveredItem.current]?.focus();
        });
        break;

      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();

        hoveredItem.current = (hoveredItem.current + 1) % links.length;
        console.log(hoveredItem);

        requestAnimationFrame(() => {
          linksRef?.current
            ?.querySelectorAll("a")
            [hoveredItem.current]?.focus();
        });
        break;

      case "Tab":
        if (event.shiftKey) {
          hoveredItem.current--;

          if (hoveredItem.current < 0) {
            requestAnimationFrame(() => {
              buttonRef?.current?.focus();
            });
          }
        } else {
          hoveredItem.current =
            hoveredItem.current + 1 >= links.length
              ? -1
              : hoveredItem.current + 1;
        }
        break;
    }
  };

  return (
    <nav
      className={[
        "w-full md:h-12 z-10 bg-black text-white duration-500 ease-in-out backdrop-filter backdrop-blur-lg backdrop-saturate-150",
        menuExpanded ? "h-screen bg-opacity-100" : "h-12 bg-opacity-40",
        position,
      ]
        .filter((x) => x)
        .join(" ")}
      style={{ transitionProperty: "height,background" }}
      aria-label="Main"
    >
      <div
        className={[
          "md:h-12 md:flex md:justify-between md:items-center mx-auto",
          className,
        ]
          .filter((x) => x)
          .join(" ")}
      >
        <div className="flex items-center justify-between py-3">
          <div className="w-4 h-auto z-50">{children}</div>
          <Button
            ref={buttonRef}
            className="rounded md:hidden hover:bg-white hover:bg-opacity-20"
            onClick={() => {
              setMenuExpanded((menuExpanded) => !menuExpanded);
            }}
            onKeyDown={handleKeyDownButton}
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
            "md:py-0 border-t md:border-none transition-colors md:h-auto",
            menuExpanded ? "border-accent py-3" : "border-transparent h-0",
          ]
            .filter((x) => x)
            .join(" ")}
        >
          <ul
            ref={linksRef}
            className={[
              "flex flex-col items-start md:flex-row md:space-x-4 md:justify-end md:h-auto",
              !menuExpanded && "h-0",
            ]
              .filter((x) => x)
              .join(" ")}
            style={{ transitionProperty: "height" }}
            onKeyDown={handleKeyDownItems}
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
                  "transform transition ease-in-out md:visible md:opacity-100 md:translate-y-0",
                  !menuExpanded
                    ? "invisible opacity-0 -translate-y-8"
                    : "visible opacity-100 translate-y-0",
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
  children?: ReactNode;
  links: NavLinkArgs[];
  className?: string;
  position?: "fixed" | "sticky" | "relative" | "absolute" | "static";
  routeChangeCompleteCallback?: (
    url: string,
    { shallow }: { shallow: boolean }
  ) => void;
};

type NavLinkArgs = {
  title: string;
  href: string;
};

export { Navigation, NavigationArgs, NavLinkArgs };
