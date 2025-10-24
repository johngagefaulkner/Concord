import { Mic, Headphones, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConcordStore, useCurrentUser } from "@/hooks/use-concord-store";
export function UserSettings() {
  const currentUser = useCurrentUser();
  const toggleSettings = useConcordStore((state) => state.toggleSettings);
  if (!currentUser) {
    return null;
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 overflow-hidden">
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <span
            className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-gray-950 ${
              currentUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-white truncate">{currentUser.name}</span>
          <span className="text-xs text-muted-foreground">{currentUser.status}</span>
        </div>
      </div>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <Mic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <Headphones className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-white"
          onClick={toggleSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}