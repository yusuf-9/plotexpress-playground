import { memo } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/common/components/ui/alert-dialog";
import { Button, ButtonVariant } from "@/common/components/ui/button";

export type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  titleClassName?: string;
  descriptionClassName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: ButtonVariant;
  cancelButtonVariant?: ButtonVariant;
};

const ConfirmationDialog = (props: ConfirmationDialogProps & { open: boolean }) => {
  const {
    title,
    description,
    cancelButtonText,
    confirmButtonText,
    descriptionClassName,
    titleClassName,
    onConfirm,
    onCancel,
    open,
    confirmButtonVariant,
    cancelButtonVariant,
  } = props;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={titleClassName}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClassName}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={cancelButtonVariant ?? "outline"}
            onClick={onCancel}
          >
            {cancelButtonText ?? "Cancel"}
          </Button>
          <Button
            variant={confirmButtonVariant ?? "default"}
            onClick={onConfirm}
          >
            {confirmButtonText ?? "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(ConfirmationDialog);
