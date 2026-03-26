import type { TableData } from "../../types";

type Props = {
  data: TableData<any>;
  rowIndex: number;
  columnKey: string;
};

export default (props: Props) => {
  const { data, rowIndex, columnKey } = props;

  const item = data[rowIndex];
  const moderators = item[columnKey] || [];
  return <div>{moderators.join("/")}</div>;
};
