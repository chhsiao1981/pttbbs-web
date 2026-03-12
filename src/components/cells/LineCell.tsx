import { Cell } from "fixed-data-table-2";
import type { PttColumn, TableData } from "../../types";

type Props = {
  data: TableData<any>;
  fontSize: number;
  rowIndex?: number;
  columnKey?: string;
  column: PttColumn;
};

export default (props: Props) => {
  const { data, fontSize, rowIndex, columnKey } = props;

  // @ts-expect-error
  const item = data[rowIndex];
  const renderLine = item[columnKey];

  return <Cell>{renderLine(data, fontSize, rowIndex, columnKey)}</Cell>;
};
