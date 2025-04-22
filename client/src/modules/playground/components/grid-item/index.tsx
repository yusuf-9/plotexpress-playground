import { PropsWithChildren } from "react";
import { Edit, Image, MoreVertical, Move, Trash2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";

type Props = PropsWithChildren & {
  onDelete: () => void;
  onEdit: () => void;
  onExportAsImage: () => void;
};

const GridItem = (props: Props) => {
  const { children, onDelete, onEdit, onExportAsImage } = props;
  return (
    <div className="h-full w-full relative bg-background rounded-lg pt-3 p-4 pr-2 flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-5 right-5 z-10 flex items-center">
        <Move className="mr-2 h-4 w-4 cursor-grab draggable-region" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onEdit}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onExportAsImage}
            >
              <Image className="mr-2 h-4 w-4" />
              <span>Export as image</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-grow w-full h-full">{children}</div>
    </div>
  );
};

export default GridItem;
