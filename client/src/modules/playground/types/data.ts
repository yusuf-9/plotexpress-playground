export type ParsedDataObject = {
  [key: string]: any;
};

export type ParsedData = ParsedDataObject[];

export type FileData = {
  [fileUUID: string]: {
    name: string;
    data: ParsedData;
  };
};

export type Workspace = {
  name: string;
}