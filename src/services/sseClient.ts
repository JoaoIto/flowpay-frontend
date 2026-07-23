import type { DashboardSnapshot } from '../types/dashboard';

type SseCallback = (data: DashboardSnapshot) => void;

class DashboardSseClient {
  private eventSource: EventSource | null = null;
  private url: string;
  private onMessageCallback: SseCallback | null = null;
  private isConnecting: boolean = false;

  constructor(url: string = 'http://localhost:8080/api/v1/dashboard/stream') {
    this.url = url;
  }

  public connect(onMessage: SseCallback) {
    if (this.isConnecting || (this.eventSource && this.eventSource.readyState === EventSource.OPEN)) {
      return; // Already connected or connecting
    }
    
    this.isConnecting = true;
    this.onMessageCallback = onMessage;
    
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.isConnecting = false;
      console.log('✅ SSE Connected to Dashboard Stream');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data: DashboardSnapshot = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      this.isConnecting = false;
      console.error('❌ SSE connection error:', error);
      // EventSource tries to reconnect automatically. We don't close it to allow native reconnection.
    };
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnecting = false;
      console.log('🛑 SSE Disconnected');
    }
  }
}

export const dashboardSse = new DashboardSseClient();
