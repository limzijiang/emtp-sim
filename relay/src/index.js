// emtp-sim WebSocket relay — one Durable Object per room.
// Replaces the public MQTT brokers for deployments that opt in (the Cloudflare
// Pages copy of the app). Protocol is a minimal pub/sub over JSON frames:
//   client → { type:'pub', topic, payload, retain? }
//   client → { type:'sub', topics:[...] }   (server replies with retained msgs)
//   client → { type:'ping' }                (auto-answered, keeps socket alive)
//   server → { type:'msg', topic, payload, retained? }
// Retained payloads are persisted in DO storage so a display that joins late
// still receives the latest state, same as MQTT retain.

export class Room {
  constructor(state) {
    this.state = state;
    // Answer pings without waking the DO from hibernation.
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair('{"type":"ping"}', '{"type":"pong"}')
    );
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('emtp-sim relay room. Connect with a WebSocket.', { status: 200 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === 'pub' && typeof msg.topic === 'string' && typeof msg.payload === 'string') {
      const frame = JSON.stringify({ type: 'msg', topic: msg.topic, payload: msg.payload });
      for (const s of this.state.getWebSockets()) {
        if (s !== ws) { try { s.send(frame); } catch {} }
      }
      if (msg.retain) {
        await this.state.storage.put('retained:' + msg.topic, msg.payload);
      }
    } else if (msg.type === 'sub') {
      const topics = Array.isArray(msg.topics) ? msg.topics.slice(0, 16) : [];
      for (const t of topics) {
        if (typeof t !== 'string') continue;
        const payload = await this.state.storage.get('retained:' + t);
        if (payload !== undefined) {
          try { ws.send(JSON.stringify({ type: 'msg', topic: t, payload, retained: true })); } catch {}
        }
      }
    }
  }

  async webSocketClose(ws) { try { ws.close(); } catch {} }
  async webSocketError(ws) { try { ws.close(); } catch {} }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/ws\/([A-Za-z0-9_-]{1,64})$/);
    if (!m) {
      return new Response('emtp-sim relay. Usage: wss://<host>/ws/<room>', {
        status: url.pathname === '/' ? 200 : 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const id = env.ROOMS.idFromName(m[1]);
    return env.ROOMS.get(id).fetch(request);
  }
};
