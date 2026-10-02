import { io } from 'socket.io-client';

export function createSocket() {
  const url = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  return io(url || undefined, { transports: ['websocket', 'polling'] });
}
