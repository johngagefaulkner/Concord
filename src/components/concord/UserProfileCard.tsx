import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ConcordUser } from "../../../worker/types";
interface UserProfileCardProps {
  user: ConcordUser;
}
export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="w-80 rounded-lg overflow-hidden bg-card text-foreground">
      <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute top-12 left-4">
          <Avatar className="h-20 w-20 rounded-full border-4 border-card">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="pt-14 p-4">
        <h3 className="text-xl font-bold font-display">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.role}</p>
        <div className="mt-4 border-t border-border pt-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Status</h4>
          <p className="text-sm capitalize flex items-center">
            <span
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`}
            />
            {user.status}
          </p>
        </div>
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
          Message
        </Button>
      </div>
    </div>
  );
}