import { useEffect, useRef } from "react";

const useWindowEvent = <T extends keyof WindowEventMap>(
  type: T,
  listener: (this: Window, type: WindowEventMap[T]) => any,
  options?: boolean | AddEventListenerOptions
) => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const eventHandler = (event: WindowEventMap[T]) => {
      listenerRef.current.call(window, event);
    };

    window.addEventListener(type, eventHandler, options);
    () => {};
  }, [type, options]);
};

export { useWindowEvent };
