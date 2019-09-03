import API from 'claudia-api-builder';

function request(callback) {
  return async function (req) {
    try {
      return await callback(req);
    }
    catch (error) {
      console.error(`Status: ${error.status}. Message: ${error.message}. Code: ${error.code}. Stack: ${error.stack}`);

      const status = error.status || 500;
      if (error.through) {
        delete error.through;
        return new API.ApiResponse(error, { 'Content-Type': 'pplication/json' }, status);
      }

      const code = error.code || 'unexpected';
      const message = (error.code && error.message) || '';

      return new API.ApiResponse({ code, message }, { 'Content-Type': 'pplication/json' }, status);
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

export default api;