const STORAGE_KEY = 'token';

export function getToken() {
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(STORAGE_KEY, token);
}

export function signOut() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isSignedIn() {
  return !!window.localStorage.getItem(STORAGE_KEY);
}