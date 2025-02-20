import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { parse } from 'url';

interface Client extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    noServer: true,
    clientTracking: true,
  });

  server.on('upgrade', (request, socket, head) => {
    // Handle CORS
    const origin = request.headers.origin;
    if (origin && (origin === 'http://localhost:5173' || origin.startsWith('http://localhost'))) {
      const pathname = parse(request.url!).pathname;

      if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    } else {
      socket.destroy();
    }
  });

  // Heartbeat to keep connections alive
  const interval = setInterval(() => {
    wss.clients.forEach((ws: Client) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('connection', (ws: Client) => {
    console.log('Client connected to WebSocket');
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        wss.clients.forEach((client: Client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'message',
              content: data.content,
              timestamp: new Date().toISOString()
            }));
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
    });
  });

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}
