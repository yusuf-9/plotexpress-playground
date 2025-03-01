import { forwardRef, LegacyRef, memo } from "react";

import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

// types
import { ParsedDataObject } from "@/modules/playground/types";

type Props = AgGridReactProps;

const DataEditorSection = forwardRef((props: Props, ref: LegacyRef<AgGridReact<ParsedDataObject>>) => {
  return (
    <AgGridReact
      ref={ref}
      {...props}
    />
  );
});

DataEditorSection.displayName = "Data Editor";

export default memo(DataEditorSection);
