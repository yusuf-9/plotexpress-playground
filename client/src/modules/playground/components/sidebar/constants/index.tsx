import { Upload, PieChart, Save } from "lucide-react";

export const SECTIONS = {
  DATA: "data",
  CHARTS: "charts",
  SAVE: "save",
  // SHARE: "share",
  // EXPORT: "export",
} as const;

export const ICON_BUTTONS: {
  name: (typeof SECTIONS)[keyof typeof SECTIONS];
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    name: "data",
    label: "Upload Data",
    icon: <Upload />,
  },
  {
    name: "charts",
    label: "Create Chart",
    icon: <PieChart />,
  },
  {
    name: "save",
    label: "Actions",
    icon: <Save />,
  },
  // {
  //   name: "share",
  //   label: "Share",
  //   icon: <Share2 />,
  // },
  // {
  //   name: "export",
  //   label: "Export",
  //   icon: <Download />,
  // },
];
