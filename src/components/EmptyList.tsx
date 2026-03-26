import type { CSSProperties } from "react";

type Props = {
  prompt: string;
  width?: number;
  height?: number;
};

export default (props: Props) => {
  let { prompt, width, height } = props;
  width = width || 0;
  height = height || 0;

  const styles: CSSProperties = {
    width,
    height,
  };

  return (
    <div style={styles}>
      <h3 className="mx-4"> {prompt} </h3>
    </div>
  );
};
