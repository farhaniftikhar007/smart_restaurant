import { API_BASE_URL } from '../config/api';

type EventCallback = (data: any) => void;

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private token: string = '';
  private eventListeners: Map<string, Set<EventCallback>> = new Map();

  connect(token: string, onMessage?: (data: any) => void) {
    this.token = token;
    const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    const fullUrl = `${wsUrl}/ws?token=${token}`;
    
    console.log('🔌 Connecting to WebSocket:', fullUrl);
    
    this.socket = new WebSocket(fullUrl);

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connection_open', {});
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Call the callback if provided
        if (onMessage) {
          onMessage(data);
        }
        
        // Emit to event listeners
        if (data.type) {
          this.emit(data.type, data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.emit('connection_error', error);
    };

    this.socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      this.emit('connection_close', {});
      this.attemptReconnect(onMessage);
    };
  }

  private attemptReconnect(onMessage?: (data: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => {
        if (this.token) {
          this.connect(this.token, onMessage);
        }
      }, this.reconnectDelay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  on(event: string, callback: EventCallback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  subscribeToOrder(orderId: number) {
    this.send({
      type: 'subscribe_order',
      order_id: orderId
    });
  }

  unsubscribeFromOrder(orderId: number) {
    this.send({
      type: 'unsubscribe_order',
      order_id: orderId
    });
  }
}

export const wsClient = new WebSocketClient();
