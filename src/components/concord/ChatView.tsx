import React, { useEffect, useRef, useMemo } from "react";
import { PlusCircle, Loader2, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useConcordStore,
  useActiveChannel,
  useActiveChannelMessages,
  useCurrentUser,
} from "@/hooks/use-concord-store";
import { ChatMessage } from "./ChatMessage";
import { ChatHeader } from "./ChatHeader";
const EMOJIS = ['😀', '😂', '❤️', '👍', '🔥', '���', '😢', '🙏', '🚀', '🤔', '👋', '😎'];
export function ChatView() {
  const activeChannel = useActiveChannel();
  const messages = useActiveChannelMessages();
  const currentUser = useCurrentUser();
  const addMessage = useConcordStore((state) => state.addMessage);
  const setUserTyping = useConcordStore((state) => state.setUserTyping);
  const isChannelLoading = useConcordStore((state) => state.isChannelLoading);
  const activeChannelId = useConcordStore((state) => state.activeChannelId);
  const typingUsers = useConcordStore((state) => state.typingUsers);
  const [newMessage, setNewMessage] = React.useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [newMessage]);
  useEffect(() => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  }, [messages, activeChannelId, isChannelLoading, typingUsers]);
  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && newMessage.trim() && currentUser) {
      e.preventDefault();
      if (activeChannel) {
        await addMessage(activeChannel.id, {
          authorId: currentUser.id,
          content: newMessage.trim(),
        });
        setNewMessage("");
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (activeChannelId) {
      setUserTyping(activeChannelId);
    }
  };
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };
  const typingDisplay = useMemo(() => {
    const users = Object.values(typingUsers)
      .filter(u => u.name !== currentUser?.name)
      .map(u => u.name);
    if (users.length === 0) return null;
    if (users.length === 1) return `${users[0]} is typing...`;
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;
    return "Several people are typing...";
  }, [typingUsers, currentUser]);
  if (!activeChannelId) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card text-muted-foreground">
        <p>Select a channel to start chatting.</p>
      </div>
    );
  }
  if (!activeChannel) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-card text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  return (
    <motion.div
      key={activeChannel.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-card"
    >
      <ChatHeader />
      <div className="flex-1 relative">
        <ScrollArea className="absolute inset-0" ref={scrollAreaRef}>
          <div className="p-4 space-y-1">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isFirstInGroup = !prevMessage || prevMessage.authorId !== message.authorId;
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isFirstInGroup={isFirstInGroup}
                />
              );
            })}
          </div>
          {typingDisplay && (
            <div className="px-4 pb-2 text-sm text-muted-foreground animate-pulse">
              {typingDisplay}
            </div>
          )}
        </ScrollArea>
        {isChannelLoading && messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="relative rounded-lg bg-muted">
          <PlusCircle className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-primary" />
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleSubmit}
            placeholder={currentUser ? `Message #${activeChannel.name}` : "You must be logged in to send messages."}
            className="w-full resize-none border-none bg-transparent pl-12 pr-12 py-3 text-base placeholder:text-muted-foreground focus:ring-0 focus-visible:ring-0 max-h-40 overflow-y-auto"
            rows={1}
            disabled={!currentUser}
          />
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                <Smile className="h-6 w-6" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-border bg-card p-2 mb-2">
              <div className="grid grid-cols-6 gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl rounded-md p-1 hover:bg-accent transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.div>
  );
}