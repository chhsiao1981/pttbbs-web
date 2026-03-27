import { useEffect, useState } from "react";

const MIN_INNER_WIDTH = 960;

export type WidthAndHeight = {
  width: number;
  height: number;
};

// useWindowSize
//
// 1. more stable useWindowSize as no change if the differece of the window size is < diff.
// 2. min-width as MIN_INNER_WIDTH
//
// addEventListener in the very beginning.
//
export default (diff: number = 10) => {
  const [widthAndHeight, setWidthAndHeight] = useState<WidthAndHeight>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  const [displayWidthAndHeight, setDisplayWidthAndHeight] =
    useState<WidthAndHeight>(getDisplayWidthAndHeight);

  useEffect(() => {
    const handler = () => {
      if (
        Math.abs(window.innerWidth - widthAndHeight.width) < diff &&
        Math.abs(window.innerHeight - widthAndHeight.height) < diff
      ) {
        return;
      }

      setWidthAndHeight({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const displayWidthAndHeight = getDisplayWidthAndHeight();
      setDisplayWidthAndHeight(displayWidthAndHeight);
    };

    window.addEventListener("resize", handler);
    return () => {
      console.info("useWindowSize: to remove handler");
      window.removeEventListener("resize", handler);
    };
  }, [widthAndHeight.width, widthAndHeight.height, diff]);

  return displayWidthAndHeight;
};

const getDisplayWidthAndHeight = () =>
  window.innerWidth < MIN_INNER_WIDTH
    ? { width: MIN_INNER_WIDTH, height: window.innerHeight }
    : { width: window.innerWidth, height: window.innerHeight };
