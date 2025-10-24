import type { ConcordData, ConcordMessage, ConcordServer } from '../../worker/types';
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success === false) {
        throw new Error(result.error || 'API returned an error');
    }
    return result.data;
};
export const concordApi = {
    getInitialData: async (): Promise<ConcordData> => {
        const response = await fetch('/api/concord/data');
        return handleResponse<ConcordData>(response);
    },
    getMessages: async (channelId: string): Promise<ConcordMessage[]> => {
        const response = await fetch(`/api/concord/channels/${channelId}/messages`);
        return handleResponse<ConcordMessage[]>(response);
    },
    postMessage: async (channelId: string, message: { authorId: string; content: string }): Promise<ConcordMessage> => {
        const response = await fetch(`/api/concord/channels/${channelId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        return handleResponse<ConcordMessage>(response);
    },
    editMessage: async (channelId: string, messageId: string, update: { content: string }): Promise<ConcordMessage> => {
        const response = await fetch(`/api/concord/channels/${channelId}/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
        });
        return handleResponse<ConcordMessage>(response);
    },
    deleteMessage: async (channelId: string, messageId: string): Promise<{ id: string }> => {
        const response = await fetch(`/api/concord/channels/${channelId}/messages/${messageId}`, {
            method: 'DELETE',
        });
        return handleResponse<{ id: string }>(response);
    },
    createServer: async (server: { name: string; icon: string }): Promise<ConcordServer> => {
        const response = await fetch('/api/concord/servers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(server),
        });
        return handleResponse<ConcordServer>(response);
    },
};