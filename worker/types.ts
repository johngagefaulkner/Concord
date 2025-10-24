export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }
export interface WeatherResult {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}
export interface MCPResult {
  content: string;
}
export interface ErrorResult {
  error: string;
}
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
  toolCalls?: ToolCall[];
}
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}
export interface ChatState {
  messages: Message[];
  sessionId: string;
  isProcessing: boolean;
  model: string;
  streamingMessage?: string;
}
export interface SessionInfo {
  id:string;
  title: string;
  createdAt: number;
  lastActive: number;
}
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}
// Concord-specific types
export interface ConcordUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  role: 'Online' | 'Offline';
}
export interface ConcordMessage {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}
export interface ConcordChannel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category: string;
}
export interface ConcordServer {
  id: string;
  name: string;
  icon: string;
  channels: ConcordChannel[];
}
export interface ConcordData {
    servers: ConcordServer[];
    users: ConcordUser[];
}
export interface ConcordChannelState {
    messages: ConcordMessage[];
}