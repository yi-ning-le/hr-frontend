import { useEffect, useState } from "react";

interface Size {
  width: number | undefined;
  height: number | undefined;
}

export function useResizeObserver(
  elementRef: React.RefObject<Element | null>,
): Size {
  const [size, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return size;
}
