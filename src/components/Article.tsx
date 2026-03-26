import { Cell } from "fixed-data-table-2";
import { type CSSProperties, useState } from "react";
import type { Line, TableData } from "../types";

import RowHighlightedCell from "./cells/RowHighlightedCell";
import Runes from "./cells/Runes";

import Screen from "./Screen";
import screenStyles from "./Screen.module.css";
import { CHAR_WIDTH } from "./utils";

const _COLUMNS = [
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
  { Header: "text", accessor: "runes", width: CHAR_WIDTH * 90, fixed: true },
  { Header: "", accessor: "", width: 0, fixed: true, type: "rest" },
];

type Props = {
  lines: Line[];
  width: number;
  height: number;
  // biome-ignore lint/complexity/noBannedTypes: loadPre is unknown function.
  loadPre: Function;
  // biome-ignore lint/complexity/noBannedTypes: loadNext is unknown function.
  loadNext: Function;
  scrollToRow?: number;
  onVerticalScroll?: (scrollPos: number) => boolean;
  scrollTop: number;
};

export default (props: Props) => {
  const {
    lines,
    width,
    height,
    loadPre,
    loadNext,
    scrollToRow,
    onVerticalScroll,
    scrollTop,
  } = props;

  const [selectedRow, setSeletedRow] = useState(-1);

  // assume that we will need to use different highlight for different cell
  const defaultHighlight = {
    backgroundColor: "#333",
  };

  const renderCell = (column: any, data: TableData<any>, fontSize: number) => {
    let renderer = null;

    switch (column.accessor) {
      case "runes":
        renderer = Runes;
        break;
      default:
        return <Cell className={screenStyles.default}></Cell>;
    }
    return (
      <RowHighlightedCell
        column={column}
        data={data}
        fontSize={fontSize}
        content={renderer}
        setRowNum={setSeletedRow}
        highlightRow={selectedRow}
        highlightStyle={defaultHighlight}
        loadPre={loadPre}
        loadNext={loadNext}
      />
    );
  };

  console.info("Article: width:", width, "height:", height);

  if (lines.length === 0) {
    const style: CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
    };
    return <div style={style}></div>;
  }

  return (
    <Screen
      width={width}
      height={height}
      columns={_COLUMNS}
      data={lines}
      renderCell={renderCell}
      scrollToRow={scrollToRow}
      onVerticalScroll={onVerticalScroll}
      scrollTop={scrollTop}
    />
  );
};
