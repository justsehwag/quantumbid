import { io } from 'socket.io-client';
import auth from '../services/auth';

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: { token: auth.getAuthToken() },
});
