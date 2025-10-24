import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, ConcordData, ConcordServer } from './types';
import type { Env } from './core-utils';
import { servers as mockServers, users as mockUsers } from './concord-data';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private concordData: ConcordData | null = null;
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [storedSessions, storedConcordData] = await Promise.all([
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions'),
        this.ctx.storage.get<ConcordData>('concordData')
      ]);
      this.sessions = new Map(Object.entries(storedSessions || {}));
      if (storedConcordData) {
        this.concordData = storedConcordData;
      } else {
        this.concordData = { servers: mockServers, users: mockUsers };
        await this.ctx.storage.put('concordData', this.concordData);
      }
      this.loaded = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  private async persistConcordData(): Promise<void> {
    await this.ctx.storage.put('concordData', this.concordData);
  }
  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);
    const method = request.method;
    if (url.pathname === '/data' && method === 'GET') {
        return Response.json({ success: true, data: this.concordData });
    }
    if (url.pathname === '/servers' && method === 'POST') {
        try {
            const newServerData = await request.json<{ name: string; icon: string }>();
            return this.addServer(newServerData);
        } catch (e) {
            return new Response('Invalid JSON', { status: 400 });
        }
    }
    return new Response('Not found in AppController', { status: 404 });
  }
  private async addServer(serverData: { name: string; icon: string }): Promise<Response> {
    if (!this.concordData) {
        return Response.json({ success: false, error: 'Data not loaded' }, { status: 500 });
    }
    const newServer: ConcordServer = {
        id: `server-${Date.now()}`,
        name: serverData.name,
        icon: serverData.icon,
        channels: [
            { id: `channel-${Date.now()}`, name: 'general', type: 'text', category: 'Text Channels' }
        ]
    };
    this.concordData.servers.push(newServer);
    await this.persistConcordData();
    return Response.json({ success: true, data: newServer });
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
}