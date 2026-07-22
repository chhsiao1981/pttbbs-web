import type CSS from "csstype";
import { useEffect, useRef, useState } from "react";
import styles from "./InitConsts.module.css";
import { CONSTS, calcFontSizeScaleScreenWidth, initCONSTS } from "./utils";

type Props = {
  windowWidth: number;
  isMobile: boolean;
  isInitConsts: boolean;
  setIsInitConsts: any;
};

// This component intends to determine windowWidth / isMobile
// and setup the related constants.
export default (props: Props) => {
  const { windowWidth, isMobile, isInitConsts, setIsInitConsts } = props;
  const ref = useRef<HTMLSpanElement>(null);
  const { fontSize, scale, screenWidth } = calcFontSizeScaleScreenWidth(
    windowWidth,
    isMobile,
  );

  const [style, setStyle] = useState<CSS.Properties>({
    fontSize: `${fontSize}px`,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    console.log(
      "InitConsts.useEffect: current:",
      ref.current,
      "isInitConsts:",
      isInitConsts,
      "CONSTS.IS_INIT",
      CONSTS.IS_INIT,
    );
    if (!ref.current) {
      return;
    }

    if (isInitConsts) {
      setStyle({ display: "none", fontSize: `${fontSize}px` });
      return;
    }
    if (CONSTS.IS_INIT) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const theStyle = getComputedStyle(ref.current);
    const lineHeight = rect.height - 0.5;
    console.log(
      "InitConsts: width:",
      rect.width,
      "height:",
      rect.height,
      "windowWidth:",
      windowWidth,
      "lineHeight:",
      lineHeight,
      "fontSize:",
      theStyle.fontSize,
      "fontFamily:",
      theStyle.fontFamily,
    );
    initCONSTS(windowWidth, lineHeight, isMobile, fontSize, scale, screenWidth);
    setIsInitConsts(true);
  }, [ref.current, isInitConsts]);

  return (
    <span ref={ref} className={styles.root} style={style}>
      █
    </span>
  );
};
