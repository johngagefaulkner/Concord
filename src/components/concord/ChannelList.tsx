import { useRef, useEffect } from "react";
import { Hash, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useConcordStore, useActiveServer } from "@/hooks/use-concord-store";
import type { ConcordChannel } from "../../../worker/types";
import { UserSettings } from "./UserSettings";
export function ChannelList() {
  const activeServer = useActiveServer();
  const activeChannelId = useConcordStore((state) => state.activeChannelId);
  const selectChannel = useConcordStore((state) => state.selectChannel);
  const setChannelPanelWidth = useConcordStore((state) => state.setChannelPanelWidth);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      const channelButtons = Array.from(contentRef.current.querySelectorAll('[data-channel-name]'));
      if (channelButtons.length > 0) {
        const widths = channelButtons.map(el => el.scrollWidth);
        const maxWidth = Math.max(...widths);
        const totalWidth = maxWidth + 16; // p-2 on each side = 1rem = 16px
        setChannelPanelWidth(totalWidth);
      } else {
        setChannelPanelWidth(null);
      }
    }
  }, [activeServer, setChannelPanelWidth]);
  if (!activeServer) {
    return (
      <div className="bg-card h-full flex flex-col">
        {/* Placeholder for when no server is selected or loading */}
      </div>
    );
  }
  const channelsByCategory = activeServer.channels.reduce((acc, channel) => {
    const category = channel.category || (channel.type === 'text' ? 'Text Channels' : 'Voice Channels');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, ConcordChannel[]>);
  return (
    <div className="bg-card h-full flex flex-col">
      <div className="p-3">
        <header className="mb-4">
          <h1 className="text-lg font-display font-bold text-foreground truncate">
            {activeServer.name}
          </h1>
        </header>
        <Separator className="bg-border/50" />
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="pb-4" ref={contentRef}>
          {Object.entries(channelsByCategory).map(([category, channels]) => (
            <div key={category} className="mb-4">
              <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-1 px-2">
                {category}
              </h2>
              <div className="space-y-1">
                {channels.map((channel) => {
                  const Icon = channel.type === 'text' ? Hash : Mic;
                  if (channel.type === 'voice') {
                    return (
                      <div
                        key={channel.id}
                        data-channel-name={channel.name}
                        className="group flex w-full items-center rounded-md p-2 text-sm font-medium text-muted-foreground opacity-60 cursor-not-allowed"
                      >
                        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap truncate">{channel.name}</span>
                      </div>
                    );
                  }
                  return (
                    <button
                      key={channel.id}
                      data-channel-name={channel.name}
                      onClick={() => selectChannel(channel.id)}
                      className={cn(
                        "group flex w-full items-center rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground",
                        {
                          "bg-accent text-accent-foreground": activeChannelId === channel.id
                        }
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap truncate">{channel.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-2 bg-secondary/50">
        <UserSettings />
      </div>
    </div>
  );
}