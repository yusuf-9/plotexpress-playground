import { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/common/components/ui/alert-dialog";

export type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  titleClassName?: string;
  descriptionClassName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
};

const ConfirmationDialog = (props: ConfirmationDialogProps & { open: boolean }) => {
  const {
    title,
    description,
    cancelButtonClassName,
    cancelButtonText,
    confirmButtonClassName,
    confirmButtonText,
    descriptionClassName,
    titleClassName,
    onConfirm,
    onCancel,
    open
  } = props;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={titleClassName}>{title}</AlertDialogTitle>
          <AlertDialogDescription className={descriptionClassName}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cancelButtonClassName}
            onClick={onCancel}
          >
            {cancelButtonText ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            className={confirmButtonClassName}
            onClick={onConfirm}
          >
            {confirmButtonText ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(ConfirmationDialog);
