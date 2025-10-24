import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUsers } from "@/hooks/use-concord-store";
import type { ConcordUser } from "../../../worker/types";
import { UserProfileCard } from "./UserProfileCard";
export function UserPanel() {
  const users = useUsers();
  const usersByRole = users.reduce((acc, user) => {
    const role = user.role || (user.status === 'online' ? 'Online' : 'Offline');
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(user);
    return acc;
  }, {} as Record<string, ConcordUser[]>);
  return (
    <div className="bg-card h-full p-3">
      <ScrollArea className="h-full">
        {Object.entries(usersByRole).map(([role, roleUsers]) => (
          <div key={role} className="mb-6">
            <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-1">
              {role} — {roleUsers.length}
            </h2>
            <div className="space-y-1">
              {roleUsers.map((user) => (
                <Popover key={user.id}>
                  <PopoverTrigger asChild>
                    <button
                      className="group flex w-full items-center space-x-3 rounded-md p-2 text-left transition-colors duration-200 hover:bg-accent"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-card ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                        {user.name}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="left" align="start" className="w-auto border-none p-0">
                    <UserProfileCard user={user} />
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}