import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            return agent.fetch(new Request(url.toString(), {
                method: c.req.method,
                headers: c.req.header(),
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            }));
        } catch (error) {
            console.error('Agent routing error:', error);
            return c.json({
                success: false,
                error: API_RESPONSES.AGENT_ROUTING_FAILED
            }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // --- Concord App Routes ---
    // Get initial data (servers, users)
    app.get('/api/concord/data', async (c) => {
        const controller = getAppController(c.env);
        return controller.fetch(new Request(new URL(c.req.url).origin + '/data', { method: 'GET' }));
    });
    // Create a new server
    app.post('/api/concord/servers', async (c) => {
        const controller = getAppController(c.env);
        return controller.fetch(new Request(new URL(c.req.url).origin + '/servers', {
            method: 'POST',
            headers: c.req.header(),
            body: c.req.raw.body,
        }));
    });
    // Get messages for a channel
    app.get('/api/concord/channels/:channelId/messages', async (c) => {
        const { channelId } = c.req.param();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, channelId);
        return agent.fetch(new URL(c.req.url).origin + '/messages', { method: 'GET' });
    });
    // Post a message to a channel
    app.post('/api/concord/channels/:channelId/messages', async (c) => {
        const { channelId } = c.req.param();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, channelId);
        return agent.fetch(new URL(c.req.url).origin + '/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: c.req.raw.body,
        });
    });
    // Edit a message
    app.put('/api/concord/channels/:channelId/messages/:messageId', async (c) => {
        const { channelId, messageId } = c.req.param();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, channelId);
        return agent.fetch(new URL(c.req.url).origin + `/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: c.req.raw.body,
        });
    });
    // Delete a message
    app.delete('/api/concord/channels/:channelId/messages/:messageId', async (c) => {
        const { channelId, messageId } = c.req.param();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, channelId);
        return agent.fetch(new URL(c.req.url).origin + `/messages/${messageId}`, { method: 'DELETE' });
    });
    // --- Session Management Routes (from template) ---
    app.get('/api/sessions', async (c) => {
        try {
            const controller = getAppController(c.env);
            const sessions = await controller.listSessions();
            return c.json({ success: true, data: sessions });
        } catch (error) {
            console.error('Failed to list sessions:', error);
            return c.json({ success: false, error: 'Failed to retrieve sessions' }, { status: 500 });
        }
    });
    app.post('/api/sessions', async (c) => {
        try {
            const body = await c.req.json().catch(() => ({}));
            const { title, sessionId: providedSessionId } = body;
            const sessionId = providedSessionId || crypto.randomUUID();
            let sessionTitle = title || `Chat ${new Date().toLocaleString()}`;
            await registerSession(c.env, sessionId, sessionTitle);
            return c.json({ success: true, data: { sessionId, title: sessionTitle } });
        } catch (error) {
            console.error('Failed to create session:', error);
            return c.json({ success: false, error: 'Failed to create session' }, { status: 500 });
        }
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const deleted = await unregisterSession(c.env, sessionId);
            if (!deleted) {
                return c.json({ success: false, error: 'Session not found' }, { status: 404 });
            }
            return c.json({ success: true, data: { deleted: true } });
        } catch (error) {
            console.error('Failed to delete session:', error);
            return c.json({ success: false, error: 'Failed to delete session' }, { status: 500 });
        }
    });
}