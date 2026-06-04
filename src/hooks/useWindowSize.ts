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
export default (diff: number = 10, minWidth: number = MIN_INNER_WIDTH) => {
  const [widthAndHeight, setWidthAndHeight] = useState<WidthAndHeight>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  const [displayWidthAndHeight, setDisplayWidthAndHeight] =
    useState<WidthAndHeight>(() => getDisplayWidthAndHeight(minWidth));

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

      const displayWidthAndHeight = getDisplayWidthAndHeight(minWidth);
      setDisplayWidthAndHeight(displayWidthAndHeight);
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [widthAndHeight.width, widthAndHeight.height, diff, minWidth]);

  return displayWidthAndHeight;
};

const getDisplayWidthAndHeight = (minWidth: number) =>
  window.innerWidth < minWidth
    ? { width: minWidth, height: window.innerHeight }
    : { width: window.innerWidth, height: window.innerHeight };
