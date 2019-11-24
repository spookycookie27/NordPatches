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
    let isBadRequest = false;
    let body = data;
    let statusCode = 200;
    let statusText = '';
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Authorization',`Bearer ${getToken()}`);

    if (!isFormData) {
      headers.set('Content-Type','application/json');
      body = JSON.stringify(data);
    } else {
      body = data;
    }

    return fetch(url, { method, headers, body })
      .then((response) => {
        isBadRequest = !response.ok;
        statusCode = response.status;
        statusText = response.statusText;
        const responseContentType = response.headers.get('content-type');
        if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
          return response.json();
        }
        return response.text();
      }).then((responseContent) => {
        const response = {
          ok: !isBadRequest,
          errorContent: isBadRequest ? responseContent : null,
          content: isBadRequest ? null : responseContent,
          status: statusCode,
          statusText: statusText
        };
        return response;
      });
  }
}