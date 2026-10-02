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
