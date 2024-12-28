import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Seat } from "@/types";
import SeatingLayout from "./seating-layout";

interface SeatingLayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seats: Seat[];
  maxSeats: number;
  onSeatSelect: (selectedSeats: Seat[]) => void;
}

export function SeatingLayoutDialog({
  open,
  onOpenChange,
  seats,
  maxSeats,
  onSeatSelect,
}: SeatingLayoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Your Seats</DialogTitle>
        </DialogHeader>
        <SeatingLayout
          seats={seats}
          maxSeats={maxSeats}
          onSeatSelect={(selectedSeats) => {
            onSeatSelect(selectedSeats);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
