export interface TrackEvent {
  componentName: string;
  variant?: string;
  action: 'render' | 'click' | 'hover' | 'mount' | 'unmount';
  projectId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000';

const TRACK_URL = `${BASE_URL}/api/components/track`;

export async function track(event: TrackEvent): Promise<void> {
  try {
    await fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, timestamp: new Date().toISOString() }),
    });
  } catch {
    // Tracking errors must never crash the UI
  }
}
