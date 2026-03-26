import type { TableData } from "../../types";

type Props = {
  data: TableData<any>;
  rowIndex: number;
  columnKey: string;
};

export default (props: Props) => {
  const { data, rowIndex, columnKey } = props;

  const item = data[rowIndex];
  const text = item[columnKey] === true ? "+" : "";

  const style = {
    color: item[columnKey] === true ? "#fff" : "#000",
  };
  return <div style={style}>{text}</div>;
};
