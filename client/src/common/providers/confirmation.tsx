import { createContext, useContext, useState, ReactElement, useCallback, PropsWithChildren } from "react";
import ConfirmationDialog, { ConfirmationDialogProps } from "@/common/components/confirmation-dialog";

type ConfirmContextType = {
  confirm: (options: ConfirmationDialogProps) => void;
  isDialogOpen: boolean;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

const ConfirmProvider = ({ children }: PropsWithChildren): ReactElement => {
  const [dialogOptions, setDialogOptions] = useState<ConfirmationDialogProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirm = useCallback((options: ConfirmationDialogProps) => {
    setIsDialogOpen(true);
    setDialogOptions({
      title: options.title,
      description: options.description,
      onCancel: () => {
        setIsDialogOpen(false);
        options.onCancel();
      },
      onConfirm: () => {
        setIsDialogOpen(false);
        options.onConfirm();
      },
      ...(options.titleClassName && { titleClassName: options.titleClassName }),
      ...(options.descriptionClassName && { descriptionClassName: options.descriptionClassName }),
      ...(options.confirmButtonText && { confirmButtonText: options.confirmButtonText }),
      ...(options.cancelButtonText && { cancelButtonText: options.cancelButtonText }),
      ...(options.confirmButtonClassName && { confirmButtonClassName: options.confirmButtonClassName }),
      ...(options.cancelButtonClassName && { cancelButtonClassName: options.cancelButtonClassName }),
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, isDialogOpen }}>
      {children}
      {dialogOptions && (
        <ConfirmationDialog
          {...dialogOptions}
          open={isDialogOpen}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
