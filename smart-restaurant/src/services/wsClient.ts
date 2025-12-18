// src/services/wsClient.ts

class WSClient {
  private socket: WebSocket | null = null;
  private eventHandlers: { [key: string]: Function[] } = {};

  connect() {
    this.socket = new WebSocket('ws://localhost:8000/ws');
    this.socket.onopen = () => this.emit('connection_open');
    this.socket.onclose = () => this.emit('connection_close');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data);
    };
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers[event]) this.eventHandlers[event] = [];
    this.eventHandlers[event].push(handler);
  }

  off(event: string, handler: Function) {
    this.eventHandlers[event] = (this.eventHandlers[event] || []).filter(h => h !== handler);
  }

  emit(event: string, data?: any) {
    (this.eventHandlers[event] || []).forEach(handler => handler(data));
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  subscribeToOrder(orderId: number) {
    this.send({ action: 'subscribe_order', order_id: orderId });
  }
}

export const wsClient = new WSClient();
