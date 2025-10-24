import { create } from 'zustand';
import { useEffect } from 'react';
import { concordApi } from '@/lib/concord-api';
import type { ConcordServer, ConcordUser, ConcordMessage, ConcordChannel } from '../../worker/types';
interface ConcordState {
  servers: ConcordServer[];
  users: ConcordUser[];
  currentUser: ConcordUser | null;
  messages: Record<string, ConcordMessage[]>;
  activeServerId: string | null;
  activeChannelId: string | null;
  isLoading: boolean;
  isChannelLoading: boolean;
  isSettingsOpen: boolean;
  editingUser: Partial<ConcordUser> | null;
  isCreatingServer: boolean;
  typingUsers: Record<string, { name: string; lastTyped: number }>;
  channelPanelWidth: number | null;
  isUserPanelOpen: boolean;
  fetchInitialData: () => Promise<void>;
  selectServer: (serverId: string) => void;
  selectChannel: (channelId: string) => Promise<void>;
  addMessage: (channelId: string, message: { authorId: string; content: string }) => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
  toggleSettings: () => void;
  startEditingUser: () => void;
  updateEditingUser: (updates: Partial<ConcordUser>) => void;
  saveUserChanges: () => void;
  optimisticUpdateMessage: (channelId: string, tempId: string, finalMessage: ConcordMessage) => void;
  editMessage: (channelId: string, messageId: string, content: string) => Promise<void>;
  deleteMessage: (channelId: string, messageId: string) => Promise<void>;
  setUserTyping: (channelId: string) => void;
  addServer: (server: { name: string; icon: string }) => Promise<void>;
  toggleCreateServerModal: () => void;
  setChannelPanelWidth: (width: number | null) => void;
  toggleUserPanel: () => void;
}
export const useConcordStore = create<ConcordState>((set, get) => ({
  servers: [],
  users: [],
  currentUser: null,
  messages: {},
  activeServerId: null,
  activeChannelId: null,
  isLoading: true,
  isChannelLoading: false,
  isSettingsOpen: false,
  editingUser: null,
  isCreatingServer: false,
  typingUsers: {},
  channelPanelWidth: null,
  isUserPanelOpen: true,
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const { servers, users } = await concordApi.getInitialData();
      const initialServerId = servers[0]?.id || null;
      const initialChannelId = servers[0]?.channels.find(c => c.type === 'text')?.id || null;
      const currentUser = users.find(u => u.status === 'online') || users[0] || null;
      set({
        servers,
        users,
        currentUser,
        activeServerId: initialServerId,
        activeChannelId: initialChannelId,
        isLoading: false
      });
      if (initialChannelId) {
        await get().selectChannel(initialChannelId);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error instanceof Error ? error.message : JSON.stringify(error));
      set({ isLoading: false });
    }
  },
  selectServer: (serverId) => {
    const { servers } = get();
    const newServer = servers.find(s => s.id === serverId);
    const newChannelId = newServer?.channels.find(c => c.type === 'text')?.id || null;
    set({ activeServerId: serverId, channelPanelWidth: null });
    if (newChannelId && newChannelId !== get().activeChannelId) {
      get().selectChannel(newChannelId);
    } else if (!newChannelId) {
      set({ activeChannelId: null });
    }
  },
  selectChannel: async (channelId) => {
    set({ activeChannelId: channelId, isChannelLoading: true });
    try {
      const messages = await concordApi.getMessages(channelId);
      set((state) => ({
        messages: { ...state.messages, [channelId]: messages },
        isChannelLoading: false,
      }));
    } catch (error) {
      console.error(`Failed to fetch messages for channel ${channelId}:`, error);
      set({ isChannelLoading: false });
    }
  },
  addMessage: async (channelId, message) => {
    const tempId = `temp-${Date.now()}`;
    const tempMessage: ConcordMessage = {
      ...message,
      id: tempId,
      timestamp: 'Sending...',
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), tempMessage],
      },
    }));
    try {
      const newMessage = await concordApi.postMessage(channelId, message);
      get().optimisticUpdateMessage(channelId, tempId, newMessage);
    } catch (error) {
      console.error("Failed to post message:", error);
      set(state => ({
        messages: {
          ...state.messages,
          [channelId]: state.messages[channelId]?.filter(m => m.id !== tempId) || []
        }
      }));
    }
  },
  optimisticUpdateMessage: (channelId, tempId, finalMessage) => {
    set(state => {
      const channelMessages = state.messages[channelId] || [];
      const messageIndex = channelMessages.findIndex(m => m.id === tempId);
      if (messageIndex !== -1) {
        const newMessages = [...channelMessages];
        newMessages[messageIndex] = finalMessage;
        return {
          messages: {
            ...state.messages,
            [channelId]: newMessages
          }
        };
      }
      return {};
    });
  },
  fetchMessages: async (channelId: string) => {
    try {
      const messages = await concordApi.getMessages(channelId);
      const currentMessages = get().messages[channelId] || [];
      if (JSON.stringify(messages) !== JSON.stringify(currentMessages.filter(m => !m.id.startsWith('temp-')))) {
        set((state) => ({
          messages: { ...state.messages, [channelId]: messages },
        }));
      }
    } catch (error) {
      console.error(`Failed to poll messages for channel ${channelId}:`, error);
    }
  },
  editMessage: async (channelId, messageId, content) => {
    try {
      const updatedMessage = await concordApi.editMessage(channelId, messageId, { content });
      set(state => {
        const newMessages = (state.messages[channelId] || []).map(m =>
          m.id === messageId ? updatedMessage : m
        );
        return { messages: { ...state.messages, [channelId]: newMessages } };
      });
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  },
  deleteMessage: async (channelId, messageId) => {
    try {
      await concordApi.deleteMessage(channelId, messageId);
      set(state => {
        const newMessages = (state.messages[channelId] || []).filter(m => m.id !== messageId);
        return { messages: { ...state.messages, [channelId]: newMessages } };
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  },
  setUserTyping: (channelId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;
    const now = Date.now();
    set(state => ({
      typingUsers: {
        ...state.typingUsers,
        [currentUser.id]: { name: currentUser.name, lastTyped: now },
      }
    }));
  },
  addServer: async (server) => {
    try {
      const newServer = await concordApi.createServer(server);
      set(state => ({
        servers: [...state.servers, newServer],
        isCreatingServer: false,
      }));
      get().selectServer(newServer.id);
    } catch (error) {
      console.error("Failed to create server:", error);
    }
  },
  toggleCreateServerModal: () => set(state => ({ isCreatingServer: !state.isCreatingServer })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen, editingUser: null })),
  startEditingUser: () => {
    const { currentUser } = get();
    if (currentUser) {
      set({ editingUser: { ...currentUser } });
    }
  },
  updateEditingUser: (updates) => {
    set(state => ({
      editingUser: state.editingUser ? { ...state.editingUser, ...updates } : null
    }));
  },
  saveUserChanges: () => {
    set(state => {
      if (!state.editingUser || !state.currentUser) return {};
      const updatedUser = { ...state.currentUser, ...state.editingUser };
      const updatedUsers = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
      return {
        currentUser: updatedUser,
        users: updatedUsers,
        editingUser: null,
      };
    });
  },
  setChannelPanelWidth: (width) => set({ channelPanelWidth: width }),
  toggleUserPanel: () => set(state => ({ isUserPanelOpen: !state.isUserPanelOpen })),
}));
// Custom hook for polling
export const useMessagePolling = () => {
  const activeChannelId = useConcordStore((state) => state.activeChannelId);
  const fetchMessages = useConcordStore((state) => state.fetchMessages);
  useEffect(() => {
    if (!activeChannelId) return;
    const intervalId = setInterval(() => {
      fetchMessages(activeChannelId);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [activeChannelId, fetchMessages]);
};
// Custom hook for cleaning up typing users
export const useTypingIndicatorCleanup = () => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      useConcordStore.setState(state => {
        const newTypingUsers = { ...state.typingUsers };
        let changed = false;
        for (const userId in newTypingUsers) {
          if (now - newTypingUsers[userId].lastTyped > 3000) {
            delete newTypingUsers[userId];
            changed = true;
          }
        }
        return changed ? { typingUsers: newTypingUsers } : {};
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);
};
// Selectors
const EMPTY_MESSAGES: ConcordMessage[] = [];
export const useActiveServer = (): ConcordServer | undefined => {
  return useConcordStore(
    (state) => state.servers.find((s) => s.id === state.activeServerId)
  );
};
export const useActiveChannel = (): ConcordChannel | undefined => {
  return useConcordStore(
    (state) =>
      state.servers
        .find((s) => s.id === state.activeServerId)
        ?.channels.find((c) => c.id === state.activeChannelId)
  );
};
export const useActiveChannelMessages = (): ConcordMessage[] => {
  const messages = useConcordStore((state) => state.messages);
  const activeChannelId = useConcordStore((state) => state.activeChannelId);
  return activeChannelId ? messages[activeChannelId] || EMPTY_MESSAGES : EMPTY_MESSAGES;
};
export const useUsers = (): ConcordUser[] => {
    return useConcordStore((state) => state.users);
};
export const useCurrentUser = (): ConcordUser | null => {
    return useConcordStore((state) => state.currentUser);
};