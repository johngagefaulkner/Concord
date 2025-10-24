import { useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { type PanelHandle } from "react-resizable-panels";
import { ServerList } from "./ServerList";
import { ChannelList } from "./ChannelList";
import { ChatView } from "./ChatView";
import { UserPanel } from "./UserPanel";
import { SettingsModal } from "./SettingsModal";
import { CreateServerModal } from "./CreateServerModal";
import { useConcordStore, useMessagePolling, useTypingIndicatorCleanup } from "@/hooks/use-concord-store";
import { Loader2 } from "lucide-react";
function ConcordApp() {
  useMessagePolling();
  useTypingIndicatorCleanup();
  const channelPanelWidth = useConcordStore((state) => state.channelPanelWidth);
  const isUserPanelOpen = useConcordStore((state) => state.isUserPanelOpen);
  const panelRef = useRef<PanelHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!channelPanelWidth || !panelRef.current || !container) {
      return;
    }
    const resizePanel = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        const newSize = (channelPanelWidth / containerWidth) * 100;
        panelRef.current?.resize(newSize);
      }
    };
    resizePanel();
    const resizeObserver = new ResizeObserver(resizePanel);
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, [channelPanelWidth]);
  return (
    <div className="flex h-full w-full">
      <div className="w-[66px] flex-shrink-0">
        <ServerList />
      </div>
      <div className="flex-1 flex" ref={containerRef}>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel ref={panelRef} defaultSize={20} minSize={15} maxSize={30}>
            <ChannelList />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={40}>
            <ChatView />
          </ResizablePanel>
        </ResizablePanelGroup>
        {isUserPanelOpen && (
          <div className="w-[240px] flex-shrink-0 border-l border-border">
            <UserPanel />
          </div>
        )}
      </div>
      <SettingsModal />
      <CreateServerModal />
    </div>
  );
}
export function ConcordLayout() {
  const fetchInitialData = useConcordStore((state) => state.fetchInitialData);
  const isLoading = useConcordStore((state) => state.isLoading);
  const servers = useConcordStore((state) => state.servers);
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  if (servers.length === 0 && isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-950 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg font-display">Loading Concord...</p>
      </div>
    );
  }
  return (
    <div className="h-full w-full bg-background text-foreground">
      <ConcordApp />
    </div>
  );
}