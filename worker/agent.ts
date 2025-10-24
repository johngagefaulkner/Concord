import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ConcordChannelState, ConcordMessage } from './types';
import { messages as mockMessages } from './concord-data';
export class ChatAgent extends Agent<Env, ConcordChannelState> {
  initialState: ConcordChannelState = {
    messages: [],
  };
  async onStart(): Promise<void> {
    if (this.state.messages.length === 0) {
        const channelId = this.name;
        const seedMessages = mockMessages[channelId];
        if (seedMessages) {
            this.setState({ messages: seedMessages });
        }
    }
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'messages') {
      if (pathParts.length === 1) { // /messages
        if (method === 'GET') return this.getMessages();
        if (method === 'POST') {
          try {
            const message = await request.json<Omit<ConcordMessage, 'id' | 'timestamp'>>();
            return this.addMessage(message);
          } catch (e) {
            return new Response('Invalid JSON', { status: 400 });
          }
        }
      } else if (pathParts.length === 2) { // /messages/:messageId
        const messageId = pathParts[1];
        if (method === 'PUT') {
          try {
            const { content } = await request.json<{ content: string }>();
            return this.editMessage(messageId, content);
          } catch (e) {
            return new Response('Invalid JSON', { status: 400 });
          }
        }
        if (method === 'DELETE') {
          return this.deleteMessage(messageId);
        }
      }
    }
    return new Response('Not Found in ChatAgent', { status: 404 });
  }
  private getMessages(): Response {
    return Response.json({ success: true, data: this.state.messages });
  }
  private addMessage(message: Omit<ConcordMessage, 'id' | 'timestamp'>): Response {
    const newMessage: ConcordMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedMessages = [...this.state.messages, newMessage];
    this.setState({ messages: updatedMessages });
    return Response.json({ success: true, data: newMessage });
  }
  private editMessage(messageId: string, content: string): Response {
    const messageIndex = this.state.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      return Response.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
    const updatedMessages = [...this.state.messages];
    const updatedMessage = {
      ...updatedMessages[messageIndex],
      content,
      timestamp: `${updatedMessages[messageIndex].timestamp.replace(' (edited)', '')} (edited)`,
    };
    updatedMessages[messageIndex] = updatedMessage;
    this.setState({ messages: updatedMessages });
    return Response.json({ success: true, data: updatedMessage });
  }
  private deleteMessage(messageId: string): Response {
    const messageExists = this.state.messages.some(m => m.id === messageId);
    if (!messageExists) {
      return Response.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
    const updatedMessages = this.state.messages.filter(m => m.id !== messageId);
    this.setState({ messages: updatedMessages });
    return Response.json({ success: true, data: { id: messageId } });
  }
}