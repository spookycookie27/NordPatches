import moment from 'moment';

const TOKEN_KEY = 'token';
const EXPIRY_KEY = 'tokenExpiry';

export function getToken() {
  return isSignedIn() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token, tokenExpiryDate) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(EXPIRY_KEY, tokenExpiryDate);
}

export function signOut() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(EXPIRY_KEY);
}

export function isSignedIn() {
  var expiry = window.localStorage.getItem(EXPIRY_KEY);
  var isFuture = moment(expiry).isAfter();
  return !!window.localStorage.getItem(TOKEN_KEY) && isFuture;
}
