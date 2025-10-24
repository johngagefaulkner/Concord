import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConcordStore } from "@/hooks/use-concord-store";
export function CreateServerModal() {
  const isCreatingServer = useConcordStore((state) => state.isCreatingServer);
  const toggleCreateServerModal = useConcordStore((state) => state.toggleCreateServerModal);
  const addServer = useConcordStore((state) => state.addServer);
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState('');
  const handleCreate = () => {
    if (serverName.trim() && serverIcon.trim()) {
      addServer({ name: serverName.trim(), icon: serverIcon.trim() });
      setServerName('');
      setServerIcon('');
    }
  };
  return (
    <Dialog open={isCreatingServer} onOpenChange={toggleCreateServerModal}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">Create Your Server</DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an icon. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              placeholder="My Awesome Server"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="server-icon">Server Icon (Emoji)</Label>
            <Input
              id="server-icon"
              placeholder="🚀"
              value={serverIcon}
              onChange={(e) => setServerIcon(e.target.value)}
              maxLength={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!serverName.trim() || !serverIcon.trim()}>
            Create Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}