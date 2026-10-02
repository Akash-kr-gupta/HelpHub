import { io } from 'socket.io-client';
import { getStoredToken } from './storage';

export function createSocket() {
  const url = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
  return io(url || undefined, {
    auth: { token: getStoredToken() },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    timeout: 10000,
  });
}
