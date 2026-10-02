export function getStoredUser() {
  try {
    const value = localStorage.getItem('helphub_user');
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem('helphub_user');
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('helphub_token');
}
export function setStoredAuth(token, user) {
  localStorage.setItem('helphub_token', token);
  localStorage.setItem('helphub_user', JSON.stringify(user));
  window.dispatchEvent(new Event('helphub-auth-changed'));
}
export function clearStoredAuth() {
  localStorage.removeItem('helphub_token');
  localStorage.removeItem('helphub_user');
  window.dispatchEvent(new Event('helphub-auth-changed'));
}

const CHAT_ROOMS_KEY = 'helphub_chat_rooms';
const UNREAD_MESSAGES_KEY = 'helphub_unread_messages';

export function rememberChatRoom(roomId) {
  if (!roomId) return;
  const rooms = getChatRooms().filter((storedRoomId) => storedRoomId !== roomId);
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify([roomId, ...rooms].slice(0, 20)));
}

export function getChatRooms() {
  try {
    const value = JSON.parse(localStorage.getItem(CHAT_ROOMS_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function getUnreadMessages() {
  try {
    const value = JSON.parse(localStorage.getItem(UNREAD_MESSAGES_KEY) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

export function incrementUnreadMessages(roomId) {
  if (!roomId) return;
  const unread = getUnreadMessages();
  unread[roomId] = (unread[roomId] || 0) + 1;
  localStorage.setItem(UNREAD_MESSAGES_KEY, JSON.stringify(unread));
  window.dispatchEvent(new Event('helphub-unread-changed'));
}

export function clearUnreadMessages(roomId) {
  const unread = getUnreadMessages();
  if (!unread[roomId]) return;
  delete unread[roomId];
  localStorage.setItem(UNREAD_MESSAGES_KEY, JSON.stringify(unread));
  window.dispatchEvent(new Event('helphub-unread-changed'));
}

export function getUnreadMessageCount() {
  return Object.values(getUnreadMessages()).reduce((total, count) => total + Number(count || 0), 0);
}
