import { useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConcordStore } from "@/hooks/use-concord-store";
import { ThemeToggle } from "./ThemeToggle";
export function SettingsModal() {
  const isSettingsOpen = useConcordStore((state) => state.isSettingsOpen);
  const toggleSettings = useConcordStore((state) => state.toggleSettings);
  const editingUser = useConcordStore((state) => state.editingUser);
  const startEditingUser = useConcordStore((state) => state.startEditingUser);
  const updateEditingUser = useConcordStore((state) => state.updateEditingUser);
  const saveUserChanges = useConcordStore((state) => state.saveUserChanges);
  useEffect(() => {
    if (isSettingsOpen) {
      startEditingUser();
    }
  }, [isSettingsOpen, startEditingUser]);
  const handleSave = () => {
    saveUserChanges();
    toast.success("Profile updated successfully!");
    toggleSettings();
  };
  return (
    <Dialog open={isSettingsOpen} onOpenChange={toggleSettings}>
      <DialogContent className="sm:max-w-2xl w-full bg-card text-foreground border-border p-0">
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex">
            <div className="w-1/3 border-r border-border p-4">
              <DialogHeader className="text-left mb-4">
                <DialogTitle className="font-display text-lg">User Settings</DialogTitle>
              </DialogHeader>
              <TabsList className="flex flex-col items-start justify-start h-auto bg-transparent p-0">
                <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-accent">My Profile</TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-accent">Appearance</TabsTrigger>
              </TabsList>
            </div>
            <div className="w-2/3 p-6">
              <TabsContent value="profile">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">My Profile</DialogTitle>
                  <DialogDescription>
                    Customize your public presence on Concord.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={editingUser?.avatar} />
                      <AvatarFallback>{editingUser?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={editingUser?.avatar || ''}
                        onChange={(e) => updateEditingUser({ avatar: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editingUser?.name || ''}
                      onChange={(e) => updateEditingUser({ name: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="appearance">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Appearance</DialogTitle>
                  <DialogDescription>
                    Make Concord yours.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="text-base font-semibold">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes.
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}