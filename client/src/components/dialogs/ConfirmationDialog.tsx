import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfirmationDialogProps {
  trigger: React.ReactNode; // Trigger to open the dialog (could be a button)
  title: string; // Title of the dialog
  description: string; // Confirmation message, e.g. "Are you sure you want to delete X?"
  onConfirm: () => void; // Callback when confirmed (i.e., deleting)
  onCancel?: () => void; // Optional callback when canceled
}

export const ConfirmationDialog = ({
  trigger,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const handleConfirm = () => {
    onConfirm();
    setOpen(false); // Close the dialog after confirming
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false); // Close the dialog after canceling
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {description}
        </DialogDescription>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
