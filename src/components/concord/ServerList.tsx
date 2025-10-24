import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useConcordStore } from "@/hooks/use-concord-store";
export function ServerList() {
  const servers = useConcordStore((state) => state.servers);
  const activeServerId = useConcordStore((state) => state.activeServerId);
  const selectServer = useConcordStore((state) => state.selectServer);
  const toggleCreateServerModal = useConcordStore((state) => state.toggleCreateServerModal);
  return (
    <div className="bg-gradient-to-b from-[#0c1427] to-background h-full p-2 flex flex-col items-center justify-start space-y-2">
      <TooltipProvider delayDuration={0}>
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => selectServer(server.id)}
                className={cn(
                  "group relative flex items-center justify-center w-full max-w-12 aspect-square rounded-full bg-secondary text-2xl text-foreground transition-all duration-200 ease-in-out hover:rounded-2xl hover:bg-accent",
                  {
                    "rounded-full bg-accent shadow-[0_0_12px_2px_hsl(var(--primary))]": activeServerId === server.id,
                  }
                )}
              >
                {server.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="bg-popover text-popover-foreground">
              <p>{server.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <div className="w-full pt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleCreateServerModal}
                className="group flex items-center justify-center w-full max-w-12 aspect-square rounded-full bg-secondary text-foreground transition-all duration-200 ease-in-out hover:rounded-2xl hover:bg-green-500"
              >
                <Plus className="h-1/2 w-1/2 text-green-500 group-hover:text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="bg-popover text-popover-foreground">
              <p>Add a Server</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}