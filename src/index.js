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
        return new API.ApiResponse(error, { 'Content-Type': 'application/json' }, status);
      }

      const code = error.code || 'unexpected';
      const message = (error.code && error.message) || '';

      return new API.ApiResponse({ code, message }, { 'Content-Type': 'application/json' }, status);
    }
  }
}

const api = new API();

const originRouter = api.proxyRouter;

// Suport AWS ALB
api.proxyRouter = function (event, context, callback) {
  if (event.requestContext && event.requestContext.elb) {
    event.requestContext.resourcePath = event.path;
    event.requestContext.httpMethod = event.httpMethod;
  }
  originRouter(event, context, callback);
}

['get', 'post', 'put', 'delete', 'head', 'patch'].forEach(method => {
  api[`${method}_`] = api[method];
  api[method] = function (route, handler, options) {
    return api[`${method}_`](route, request(handler), options);
  }
});

export default api;