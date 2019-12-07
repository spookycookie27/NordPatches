import { getToken } from '../services/Auth';

export default class RestUtilities {
  static get(url) {
    return RestUtilities.request('GET', url);
  }

  static delete(url) {
    return RestUtilities.request('DELETE', url);
  }

  static put(url, data) {
    return RestUtilities.request('PUT', url, data);
  }

  static post(url, data) {
    return RestUtilities.request('POST', url, data);
  }

  static postFormData(url, data) {
    return RestUtilities.request('POST', url, data, true);
  }

  static request(method, url, data, isFormData = false) {
    let body = data;
    const token = getToken();
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    if (!isFormData) {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(data);
    } else {
      body = data;
    }

    return fetch(url, { method, headers, body });
  }
}
