import { ReactNode } from "react";
import { Button } from "@/common/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/common/components/ui/tooltip";
import { cn } from "@/common/utils";

type Props = {
  label: string;
  icon: ReactNode;
  renderActiveState: boolean;
  onClick: () => void;
};

export default function IconButton(props: Props) {
  const { label, icon, renderActiveState, onClick } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground hover:text-primary hover:bg-secondary",
            renderActiveState && "!text-primary !bg-primary-light"
          )}
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
