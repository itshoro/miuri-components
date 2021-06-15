import React, {
  ReactNode,
  useEffect,
  useReducer,
  KeyboardEvent,
  MutableRefObject,
  createRef,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../button/index";
import { Link } from "./link";
import { useWindowEvent } from "../hooks/useWindowEvent";

const reducer = (state: NavigationStateDefinition, action: Action) => {
  switch (action.type) {
    case ActionType.OpenMenu:
      if (state.menuState === MenuState.Open) return state;

      requestAnimationFrame(() => {
        state.linksRef.current?.querySelector("a")?.focus();
      });

      return {
        ...state,
        menuState: MenuState.Open,
        focusedItem: 0,
      };

    case ActionType.CloseMenu:
      if (state.menuState === MenuState.Closed) return state;

      return {
        ...state,
        menuState: MenuState.Closed,
        focusedItem: null,
      };

    case ActionType.FocusItem:
      if (state.menuState === MenuState.Closed) return state;

      return {
        ...state,
        menuState: MenuState.Open,
        focusedItem: action.item,
      };

    default:
      return state;
  }
};

interface NavigationStateDefinition {
  menuState: MenuState;
  focusedItem: number | null;
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  linksRef: MutableRefObject<HTMLUListElement | null>;
}

type Action =
  | { type: ActionType.OpenMenu }
  | { type: ActionType.CloseMenu }
  | { type: ActionType.FocusItem; item: number };
enum ActionType {
  OpenMenu,
  CloseMenu,
  FocusItem,
}

enum MenuState {
  Open,
  Closed,
}

const Navigation = ({
  children,
  links,
  position,
  className,
  routeChangeCompleteCallback,
}: NavigationArgs) => {
  const reducerBag = useReducer(reducer, {
    menuState: MenuState.Closed,
    focusedItem: null,
    buttonRef: createRef(),
    linksRef: createRef(),
  } as NavigationStateDefinition);
  const [navState, dispatch] = reducerBag;

  const router = useRouter();

  const handleRouteChangeComplete = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (routeChangeCompleteCallback)
      routeChangeCompleteCallback(url, { shallow });
    dispatch({ type: ActionType.CloseMenu });
  };

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (navState.focusedItem !== null) {
        navState.linksRef.current
          ?.querySelectorAll("a")
          [navState.focusedItem]?.focus();
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [navState.focusedItem]);

  useWindowEvent("resize", (event) => {
    if (
      navState.menuState === MenuState.Open &&
      matchMedia("(min-width: 640px)")
    ) {
      dispatch({ type: ActionType.CloseMenu });
    }
  });

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

  const handleKeyDownButton = (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        dispatch({ type: ActionType.CloseMenu });

        requestAnimationFrame(() => {
          navState.buttonRef.current?.focus();
        });
        break;

      case "Enter":
        // For some reason the Enter key seems to have some default behaviour.
        // I can handle it to some degree, e.g. do `console.log`, however updating state
        // doesn't work.
        event.preventDefault();
        event.stopPropagation();

        if (navState.menuState === MenuState.Open) {
          dispatch({ type: ActionType.CloseMenu });
        } else {
          dispatch({ type: ActionType.OpenMenu });
        }
    }
  };

  const handleKeyDownItems = (event: KeyboardEvent) => {
    const handleDecrement = (rollover = true) => {
      if (navState.focusedItem === null) return 0;

      let targetItem = navState.focusedItem - 1;
      if (targetItem === -1) {
        if (!rollover) {
          return null;
        }
        targetItem += links.length;
      }
      return targetItem;
    };

    const handleIncrement = (rollover = true) => {
      if (navState.focusedItem === null) return 0;

      let targetItem = navState.focusedItem + 1;
      if (targetItem === links.length) {
        if (!rollover) {
          return null;
        }
        targetItem -= links.length;
      }

      return targetItem;
    };

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();

        dispatch({ type: ActionType.CloseMenu });

        requestAnimationFrame(() => {
          navState.buttonRef.current?.focus();
        });

      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        event.stopPropagation();

        const possibleTarget =
          event.key === "ArrowUp" ? handleDecrement() : handleIncrement();

        if (possibleTarget !== null) {
          dispatch({ type: ActionType.FocusItem, item: possibleTarget });
        } else {
          dispatch({ type: ActionType.CloseMenu });
        }

        break;
      }

      case "Tab": {
        const possibleTarget = event.shiftKey
          ? handleDecrement(false)
          : handleIncrement(false);

        if (possibleTarget !== null) {
          dispatch({ type: ActionType.FocusItem, item: possibleTarget });
        } else {
          dispatch({ type: ActionType.CloseMenu });
        }

        break;
      }
    }
  };

  return (
    <nav
      className={[
        "w-full md:h-12 z-10 bg-black text-white duration-500 ease-in-out backdrop-filter backdrop-blur-lg backdrop-saturate-150",
        navState.menuState === MenuState.Open
          ? "h-screen bg-opacity-100"
          : "h-12 bg-opacity-40",
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
            ref={navState.buttonRef}
            className="rounded md:hidden hover:bg-white hover:bg-opacity-20"
            onClick={() => {
              if (navState.menuState === MenuState.Open) {
                dispatch({ type: ActionType.CloseMenu });
              } else {
                dispatch({ type: ActionType.OpenMenu });

                dispatch({ type: ActionType.FocusItem, item: 0 });
              }
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
                    navState.menuState === MenuState.Open &&
                      "rotate-45 translate-x-[-4px] translate-y-[4px]",
                  ]
                    .filter((x) => x)
                    .join(" ")}
                />
                <path
                  d="M4 12h16M4"
                  className={[
                    navState.menuState === MenuState.Open && "opacity-0",
                    "transition-opacity duration-500",
                  ]
                    .filter((x) => x)
                    .join(" ")}
                />
                <path
                  d="M4 18h16"
                  className={[
                    "transform-gpu transition-transform duration-500 origin-center",
                    navState.menuState === MenuState.Open &&
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
            navState.menuState === MenuState.Open
              ? "border-accent py-3"
              : "border-transparent h-0",
          ]
            .filter((x) => x)
            .join(" ")}
        >
          <ul
            ref={navState.linksRef}
            className={[
              "flex flex-col items-start md:flex-row md:space-x-4 md:justify-end md:h-auto",
              navState.menuState === MenuState.Closed && "h-0",
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
                  navState.menuState === MenuState.Closed
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
