export function getStoredUser() {
  try {
    const value = localStorage.getItem('helphub_user');
    return value ? JSON.parse(value) : null;
  } catch {
    try {
      localStorage.removeItem('helphub_user');
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
    return null;
  }
}

export function getStoredToken() {
  try {
    return localStorage.getItem('helphub_token');
  } catch {
    return null;
  }
}
export function setStoredAuth(token, user) {
  try {
    localStorage.setItem('helphub_token', token);
    localStorage.setItem('helphub_user', JSON.stringify(user));
  } catch {
    // The session still remains in memory for the current page.
  }
  window.dispatchEvent(new Event('helphub-auth-changed'));
}
export function clearStoredAuth() {
  try {
    localStorage.removeItem('helphub_token');
    localStorage.removeItem('helphub_user');
  } catch {
    // Ignore unavailable browser storage during logout.
  }
  window.dispatchEvent(new Event('helphub-auth-changed'));
}

const CHAT_ROOMS_KEY = 'helphub_chat_rooms';
const UNREAD_MESSAGES_KEY = 'helphub_unread_messages';

export function rememberChatRoom(roomId) {
  if (!roomId) return;
  const rooms = getChatRooms().filter((storedRoomId) => storedRoomId !== roomId);
  try {
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify([roomId, ...rooms].slice(0, 20)));
  } catch {
    // Ignore unavailable browser storage.
  }
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
  try {
    localStorage.setItem(UNREAD_MESSAGES_KEY, JSON.stringify(unread));
  } catch {
    return;
  }
  window.dispatchEvent(new Event('helphub-unread-changed'));
}

export function clearUnreadMessages(roomId) {
  const unread = getUnreadMessages();
  if (!unread[roomId]) return;
  delete unread[roomId];
  try {
    localStorage.setItem(UNREAD_MESSAGES_KEY, JSON.stringify(unread));
  } catch {
    return;
  }
  window.dispatchEvent(new Event('helphub-unread-changed'));
}

export function getUnreadMessageCount() {
  return Object.values(getUnreadMessages()).reduce((total, count) => total + Number(count || 0), 0);
}
