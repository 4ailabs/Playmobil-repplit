import { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface MobileDrawerProps {
  title: string;
  triggerLabel: string;
  children: ReactNode;
  side?: "left" | "right";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileDrawer({
  title,
  triggerLabel,
  children,
  side = "left",
  isOpen,
  onOpenChange,
}: MobileDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden fixed top-4 z-50 shadow-lg"
          style={side === "left" ? { left: "1rem" } : { right: "1rem" }}
          aria-label={`Abrir ${triggerLabel}`}
          aria-expanded={isOpen}
        >
          <Menu className="w-4 h-4 mr-2" aria-hidden="true" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-80 sm:w-96 overflow-y-auto p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

