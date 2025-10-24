import { Hash, Users } from "lucide-react";
import { useActiveChannel, useConcordStore } from "@/hooks/use-concord-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function ChatHeader() {
  const activeChannel = useActiveChannel();
  const toggleUserPanel = useConcordStore((state) => state.toggleUserPanel);
  const isUserPanelOpen = useConcordStore((state) => state.isUserPanelOpen);
  if (!activeChannel) {
    return (
      <header className="flex-shrink-0 border-b border-border p-3 flex items-center justify-between h-[57px]">
        {/* Placeholder or loading state */}
      </header>
    );
  }
  return (
    <header className="flex-shrink-0 border-b border-border p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Hash className="h-6 w-6 text-muted-foreground" />
        <h2 className="ml-2 text-lg font-bold text-foreground">{activeChannel.name}</h2>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleUserPanel}
          className="text-muted-foreground hover:text-foreground"
        >
          <Users className={cn("h-5 w-5", isUserPanelOpen && "text-primary")} />
        </Button>
      </div>
    </header>
  );
}