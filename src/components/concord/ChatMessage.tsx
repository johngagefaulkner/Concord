import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConcordStore, useUsers, useCurrentUser } from "@/hooks/use-concord-store";
import { cn } from "@/lib/utils";
import type { ConcordMessage } from '../../../worker/types';
interface ChatMessageProps {
  message: ConcordMessage;
  isFirstInGroup: boolean;
}
export function ChatMessage({ message, isFirstInGroup }: ChatMessageProps) {
  const users = useUsers();
  const currentUser = useCurrentUser();
  const editMessage = useConcordStore((state) => state.editMessage);
  const deleteMessage = useConcordStore((state) => state.deleteMessage);
  const activeChannelId = useConcordStore((state) => state.activeChannelId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const author = users.find((u) => u.id === message.authorId);
  const isAuthor = currentUser?.id === message.authorId;
  const isSending = message.id.startsWith('temp-');
  const handleSaveEdit = async () => {
    if (editedContent.trim() && activeChannelId && editedContent.trim() !== message.content) {
      await editMessage(activeChannelId, message.id, editedContent.trim());
    }
    setIsEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedContent(message.content);
    }
  };
  const handleDelete = async () => {
    if (activeChannelId) {
      await deleteMessage(activeChannelId, message.id);
    }
  };
  return (
    <div
      className={cn(
        "group relative flex items-start space-x-4 py-1 hover:bg-accent/50 transition-colors",
        isFirstInGroup && "mt-4",
        isSending && "opacity-50"
      )}
    >
      {isFirstInGroup ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={author?.avatar} alt={author?.name} />
          <AvatarFallback>{author?.name?.[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-10 pl-4 text-transparent text-xs group-hover:text-muted-foreground transition-colors">
          {!isSending && message.timestamp}
        </div>
      )}
      <div className="flex-1">
        {isFirstInGroup && (
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-foreground">{author?.name}</span>
            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
          </div>
        )}
        {isEditing ? (
          <div className="mt-1">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full resize-none bg-muted text-base"
              autoFocus
            />
            <div className="text-xs text-muted-foreground mt-1">
              escape to cancel • enter to save
            </div>
          </div>
        ) : (
          <p className="text-base text-foreground whitespace-pre-wrap">
            {message.content}
            {message.timestamp.endsWith('(edited)') && <span className="text-xs text-muted-foreground ml-2">(edited)</span>}
          </p>
        )}
      </div>
      {isAuthor && !isSending && (
        <div className="absolute top-0 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}