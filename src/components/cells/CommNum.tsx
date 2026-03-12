import type { TableData } from "../../types";

type Props = {
  data: TableData<any>;
  rowIndex: number;
  columnKey: string;
};

export default (props: Props) => {
  const { data, rowIndex, columnKey } = props;

  const item = data[rowIndex];
  let color = "green";

  let text = item[columnKey] || 0;
  const num = parseInt(text, 10);
  if (num === 0) {
    return <div></div>;
  }
  if (Number.isInteger(num)) {
    if (num > 9) {
      color = "yellow";
    }
    if (num > 99) {
      color = "red";
      text = "爆";
    }
  }

  const style = {
    color: color,
  };

  return <div style={style}>{text}</div>;
};
