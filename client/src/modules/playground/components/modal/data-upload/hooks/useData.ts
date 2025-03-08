import { useCallback, useMemo, useRef, useState } from "react";
import cloneDeep from "lodash.clonedeep";

// types
import { ParsedData, ParsedDataObject } from "@/modules/playground/types";
import { AgGridReact } from "ag-grid-react";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// hooks
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

export default function useData() {
  const editableFileId = useStore(store => store.fileToBeEditedId);
  const fileToBeEdited = useStore(store => store.files[editableFileId]);
  const setFileToBeEditedId = useStore(store => store.setFileToBeEditedId);
  const existingParsedData = fileToBeEdited?.data;

  const { dataManager } = useDependencyInjector();

  const [parsedData, setParsedData] = useState<ParsedData | undefined>(cloneDeep(existingParsedData));
  const dataEditorRef = useRef<AgGridReact<ParsedDataObject>>(null);

  const columnDefinitions = useMemo(() => {
    if (!parsedData || !Array.isArray(parsedData)) return [];

    const columnKeys = parsedData.reduce((acc, dataObject) => {
      Object.keys(dataObject).forEach(key => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, []);

    return columnKeys.map((key: string, index: number) => ({
      field: key,
      ...(index === 0 && {
        flex: 1,
      }),
    }));
  }, [parsedData]);

  const defaultColumnProps = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const handleSetData = useCallback((data: ParsedData) => {
    setParsedData(data);
  }, []);

  const handleSaveData = useCallback(
    (fileName: string) => {
      if (!dataEditorRef.current) return;
      const updatedData: ParsedData = [];
      dataEditorRef.current.api.forEachNode(node => {
        updatedData.push(node.data!);
      });

      if (fileToBeEdited) {
        dataManager.updateFile(editableFileId, updatedData);
        setFileToBeEditedId("");
        return;
      }

      dataManager.addFile(fileName, updatedData);
    },
    [fileToBeEdited, dataManager, editableFileId, setFileToBeEditedId]
  );

  return {
    parsedData,
    columnDefinitions,
    setParsedData: handleSetData,
    dataEditorRef,
    handleSaveData,
    editableFileId,
    existingParsedData,
    setEditableFileId: setFileToBeEditedId,
    shouldLoadExistingFile: Boolean(fileToBeEdited),
    defaultColumnProps,
  };
}
