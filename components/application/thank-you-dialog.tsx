"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThankYouDialog({ open, onOpenChange }: ThankYouDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thank You for Your Application</DialogTitle>
          <DialogDescription>
            We appreciate your interest in the position. Our team will review your application and contact you soon.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}