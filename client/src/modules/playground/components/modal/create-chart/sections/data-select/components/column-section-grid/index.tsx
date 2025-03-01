import { memo, useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, CellMouseOverEvent, CellClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

type Props = {
  rowData: any[];
  columnDefs: ColDef[];
};

const ColumnSelectionGrid = ({ rowData, columnDefs }: Props) => {
  const [highlightedCol, setHighlightedCol] = useState<string | null>(null);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);

  // Memoized default column definitions
  const defaultColDef = useMemo<ColDef>(
    () => ({
      editable: true,
      filter: true,
      resizable: true, // Helps reduce DOM reflows when resizing
    }),
    []
  );

  // Optimized column hover and click handlers
  const handleCellMouseOver = useCallback((event: CellMouseOverEvent) => {
    setHighlightedCol(event.colDef.field || null);
  }, []);

  const handleCellMouseOut = useCallback(() => {
    setHighlightedCol(null);
  }, []);

  const handleCellClick = useCallback((event: CellClickedEvent) => {
    setSelectedCol(event.colDef.field || null);
  }, []);

  // Optimize dynamic styling logic for cells
  const getCellClass = useCallback(
    (params: any) => {
      const colField = params.colDef.field;
      if (colField === selectedCol) return "selected-column";
      if (colField === highlightedCol) return "hovered-column";
      return "";
    },
    [highlightedCol, selectedCol]
  );

  // Memoized column definitions with updated header and cell styles
  const updatedColumnDefs = useMemo(() => {
    return columnDefs.map(colDef => ({
      ...colDef,
      cellClass: getCellClass,
      headerClass:
        colDef.field === selectedCol
          ? "selected-column-header"
          : colDef.field === highlightedCol
          ? "hovered-column-header"
          : "",
    }));
  }, [columnDefs, getCellClass, highlightedCol, selectedCol]);

  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={updatedColumnDefs}
      defaultColDef={defaultColDef}
      suppressRowClickSelection={true}
      suppressCellFocus={true}
      suppressRowHoverHighlight
      onCellMouseOver={handleCellMouseOver}
      onCellMouseOut={handleCellMouseOut}
      onCellClicked={handleCellClick}
    />
  );
};

export default memo(ColumnSelectionGrid);
