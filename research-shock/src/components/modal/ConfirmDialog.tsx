import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "default" | "destructive";
  onConfirm: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "default",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const confirmClassName =
    confirmColor === "destructive"
      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      : "bg-primary hover:bg-primary/90 text-primary-foreground";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={confirmClassName + " flex items-center gap-2"}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Please wait..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
