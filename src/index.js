import API from 'claudia-api-builder';
import { StatusError } from './errors';

function request(callback) {
  return async function (req) {
    try {
      return await callback(req);
    }
    catch (error) {
      console.error(`Status: ${error.status}. Message: ${error.message}. Code: ${error.code}. Stack: ${error.stack}`);

      const { status, code } = error instanceof StatusError
        ? error
        : { status: error.status || 500, code: '' };

      return new API.ApiResponse({ code }, {}, status);
    }
  }
}

const api = new API();

['get', 'post', 'put', 'delete', 'head', 'patch'].forEach(method => {
  api[`${method}_`] = api[method];
  api[method] = function (route, handler, options) {
    return api[`${method}_`](route, request(handler), options);
  }
});

export { api, StatusError };