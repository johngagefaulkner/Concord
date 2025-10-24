import type { ConcordServer, ConcordUser, ConcordMessage } from './types';
export const users: ConcordUser[] = [
  { id: 'user-1', name: 'Aria', avatar: 'https://i.pravatar.cc/150?u=aria', status: 'online', role: 'Online' },
  { id: 'user-2', name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=leo', status: 'online', role: 'Online' },
  { id: 'user-3', name: 'Zara', avatar: 'https://i.pravatar.cc/150?u=zara', status: 'online', role: 'Online' },
  { id: 'user-4', name: 'Kai', avatar: 'https://i.pravatar.cc/150?u=kai', status: 'offline', role: 'Offline' },
  { id: 'user-5', name: 'Nia', avatar: 'https://i.pravatar.cc/150?u=nia', status: 'offline', role: 'Offline' },
];
export const messages: Record<string, ConcordMessage[]> = {
  'channel-1': [
    { id: 'msg-1', authorId: 'user-1', content: 'Hey everyone, welcome to the general channel!', timestamp: '3:45 PM' },
    { id: 'msg-2', authorId: 'user-2', content: 'Glad to be here! The UI on this is amazing.', timestamp: '3:46 PM' },
    { id: 'msg-3', authorId: 'user-1', content: 'Right? It feels so fast and lightweight.', timestamp: '3:47 PM' },
    { id: 'msg-4', authorId: 'user-3', content: 'I agree. The minimalist design is really clean. What are we working on today?', timestamp: '3:49 PM' },
  ],
  'channel-2': [
    { id: 'msg-5', authorId: 'user-2', content: 'Okay team, let\'s kick off the Q3 planning session here.', timestamp: '10:00 AM' },
    { id: 'msg-6', authorId: 'user-4', content: 'I\'ve pushed the initial draft to the repo.', timestamp: '10:01 AM' },
  ],
  'channel-3': [
    { id: 'msg-7', authorId: 'user-3', content: 'Anyone seen the latest design mockups? They look incredible.', timestamp: '1:20 PM' },
  ],
  'channel-4': [
    { id: 'msg-8', authorId: 'user-1', content: 'Welcome to the Cloudflare server!', timestamp: '9:00 AM' },
  ],
  'channel-5': [
    { id: 'msg-9', authorId: 'user-5', content: 'Any updates on the Workers deployment?', timestamp: '11:30 AM' },
  ],
};
export const servers: ConcordServer[] = [
  {
    id: 'server-1',
    name: 'Acme Corporation',
    icon: '🏢',
    channels: [
      { id: 'channel-1', name: 'general', type: 'text', category: 'Text Channels' },
      { id: 'channel-2', name: 'planning', type: 'text', category: 'Text Channels' },
      { id: 'channel-3', name: 'design-team', type: 'text', category: 'Text Channels' },
      { id: 'channel-voice-1', name: 'Lounge', type: 'voice', category: 'Voice Channels' },
      { id: 'channel-voice-2', name: 'Meeting Room', type: 'voice', category: 'Voice Channels' },
    ],
  },
  {
    id: 'server-2',
    name: 'Cloudflare',
    icon: '☁️',
    channels: [
      { id: 'channel-4', name: 'announcements', type: 'text', category: 'Text Channels' },
      { id: 'channel-5', name: 'workers-dev', type: 'text', category: 'Text Channels' },
      { id: 'channel-voice-3', name: 'All Hands', type: 'voice', category: 'Voice Channels' },
    ],
  },
  {
    id: 'server-3',
    name: 'Gaming Hub',
    icon: '🎮',
    channels: [
      { id: 'channel-6', name: 'lobby', type: 'text', category: 'Text Channels' },
      { id: 'channel-7', name: 'matchmaking', type: 'text', category: 'Text Channels' },
      { id: 'channel-voice-4', name: 'Squad A', type: 'voice', category: 'Voice Channels' },
    ],
  },
];